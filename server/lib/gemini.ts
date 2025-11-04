import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables with explicit path for Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not defined in environment variables');
  console.error('Checked .env file at:', envPath);
}

export async function detectMoodFromText(text: string): Promise<{ mood: string; confidence: number }> {
  try {
    const prompt = `Analyze the following text and determine the person's mood. Choose ONE mood from this list: Happy, Sad, Romantic, Adventurous, Angry, Relaxed. 
    
Also provide a confidence score from 0 to 100.

Respond in this exact JSON format:
{
  "mood": "one of: Happy, Sad, Romantic, Adventurous, Angry, Relaxed",
  "confidence": number between 0-100
}

Text to analyze:
"${text}"`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response from Gemini');
    }

    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        mood: result.mood || 'Happy',
        confidence: Math.min(100, Math.max(0, result.confidence || 75))
      };
    }

    return { mood: 'Happy', confidence: 50 };
  } catch (error) {
    console.error('Error detecting mood with Gemini:', error);
    return { mood: 'Happy', confidence: 50 };
  }
}
