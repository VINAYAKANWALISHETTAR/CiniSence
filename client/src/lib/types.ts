export type MoodType = 'Happy' | 'Sad' | 'Romantic' | 'Adventurous' | 'Angry' | 'Relaxed';

export interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  releaseDate: string;
  voteAverage: number;
  genreIds: number[];
  genres?: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MoodHistory {
  id: string;
  mood: MoodType;
  timestamp: string;
}
