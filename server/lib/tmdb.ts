import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import https from 'https';

// Load environment variables with explicit path for Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Create an HTTPS agent with relaxed SSL settings for Windows environments
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Only for development environments
  keepAlive: true,
});

if (!TMDB_API_KEY) {
  console.error('ERROR: TMDB_API_KEY is not defined in environment variables');
  console.error('Checked .env file at:', envPath);
}

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

const moodToGenreMap: Record<string, number[]> = {
  Happy: [35, 10751, 16],
  Sad: [18, 10749],
  Romantic: [10749, 35],
  Adventurous: [12, 28, 878],
  Angry: [28, 53, 80],
  Relaxed: [99, 10402, 10770]
};

// Helper function to make HTTP requests with better error handling
async function makeRequest(url: string): Promise<any> {
  try {
    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url, {
      agent: httpsAgent,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CineSensePlatform/1.0'
      }
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP Error: ${response.status} - ${response.statusText}`, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: any = await response.json();
    console.log(`Successfully fetched data with ${data.results ? data.results.length : 'no'} results`);
    return data;
  } catch (error: any) {
    console.error(`Request failed for URL: ${url}`, error);
    throw error;
  }
}

export async function getTrendingMovies(): Promise<TMDBMovie[]> {
  try {
    const data = await makeRequest(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
    );
    return data.results || [];
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

export async function getPopularMovies(): Promise<TMDBMovie[]> {
  try {
    const data = await makeRequest(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
    );
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}

export async function getTopRatedMovies(): Promise<TMDBMovie[]> {
  try {
    const data = await makeRequest(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`
    );
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  try {
    const data = await makeRequest(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    return data.results || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

export async function getMoviesByMood(mood: string): Promise<TMDBMovie[]> {
  const genreIds = moodToGenreMap[mood] || [];
  
  if (genreIds.length === 0) {
    return getTrendingMovies();
  }
  
  try {
    const data = await makeRequest(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreIds.join(',')}&sort_by=popularity.desc`
    );
    return data.results || [];
  } catch (error) {
    console.error('Error fetching movies by mood:', error);
    return [];
  }
}

export async function getMoviesByGenres(genreIds: number[]): Promise<TMDBMovie[]> {
  if (genreIds.length === 0) {
    return getPopularMovies();
  }
  
  try {
    const data = await makeRequest(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreIds.join(',')}&sort_by=popularity.desc`
    );
    return data.results || [];
  } catch (error) {
    console.error('Error fetching movies by genres:', error);
    return [];
  }
}

export async function getMovieDetails(movieId: number) {
  try {
    // Make the request with videos, credits, and images to get comprehensive data
    const data = await makeRequest(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,images&include_image_language=en,null`
    );
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export async function getGenres(): Promise<TMDBGenre[]> {
  try {
    const data = await makeRequest(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
    );
    return data.genres || [];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}