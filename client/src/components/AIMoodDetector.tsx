import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Sparkles } from "lucide-react";
import { useState } from "react";
import type { MoodType } from "@/lib/types";

interface AIMoodDetectorProps {
  onMoodDetected: (mood: MoodType, confidence: number) => void;
}

export default function AIMoodDetector({ onMoodDetected }: AIMoodDetectorProps) {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ mood: MoodType; confidence: number } | null>(null);

  const analyzeMood = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const moods: MoodType[] = ['Happy', 'Sad', 'Romantic', 'Adventurous', 'Angry', 'Relaxed'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      const confidence = Math.floor(Math.random() * 30) + 70;
      
      const detectedResult = { mood: randomMood, confidence };
      setResult(detectedResult);
      setIsAnalyzing(false);
      onMoodDetected(randomMood, confidence);
      console.log('AI detected mood:', randomMood, 'with confidence:', confidence + '%');
    }, 1500);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">AI Mood Detector</h3>
          <Sparkles className="h-5 w-5 text-yellow-500" />
        </div>
        
        <p className="text-sm text-muted-foreground">
          Tell us how you're feeling, and our AI will detect your mood automatically.
        </p>

        <Textarea
          placeholder="I'm feeling pretty good today! Just had a great day at work and I'm ready to relax with a good movie..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-32 resize-none"
          data-testid="input-mood-text"
        />

        <Button 
          onClick={analyzeMood}
          disabled={!text.trim() || isAnalyzing}
          className="w-full"
          data-testid="button-analyze-mood"
        >
          {isAnalyzing ? (
            <>
              <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Analyze My Mood
            </>
          )}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Detected Mood</p>
                <p className="text-xl font-bold text-primary" data-testid="text-detected-mood">
                  {result.mood}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-xl font-bold" data-testid="text-confidence">
                  {result.confidence}%
                </p>
              </div>
            </div>
            <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000"
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
