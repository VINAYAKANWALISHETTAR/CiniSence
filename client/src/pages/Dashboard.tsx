import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import MoodSelector from "@/components/MoodSelector";
import AIMoodDetector from "@/components/AIMoodDetector";
import MovieCard from "@/components/MovieCard";
import GenreSelector from "@/components/GenreSelector";
import { Card } from "@/components/ui/card";
import { Film, Heart, Star } from "lucide-react";
import type { MoodType } from "@/lib/types";
import { movies as moviesApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([28, 35, 878]);
  const { user } = useAuth();

  const { data: recommendedMovies = [] } = useQuery({
    queryKey: ['/api/movies/recommend'],
    enabled: !!user
  });

  const { data: moodMovies = [] } = useQuery({
    queryKey: ['/api/movies/by-mood', selectedMood],
    queryFn: () => selectedMood ? moviesApi.getByMood(selectedMood) : Promise.resolve([]),
    enabled: !!selectedMood
  });

  const displayMovies = selectedMood ? moodMovies : recommendedMovies;

  const handleMoodDetected = (mood: MoodType, confidence: number) => {
    setSelectedMood(mood);
    console.log('Mood detected and set:', mood, confidence);
  };

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground text-lg">How are you feeling today?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <Film className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Movies Watched</p>
                <p className="text-3xl font-bold">127</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-pink-500/10 p-4 rounded-lg">
                <Heart className="h-8 w-8 text-pink-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Watchlist</p>
                <p className="text-3xl font-bold">23</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/10 p-4 rounded-lg">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-3xl font-bold">4.2</p>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Select Your Mood</h2>
          <MoodSelector 
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIMoodDetector onMoodDetected={handleMoodDetected} />
          <GenreSelector 
            selectedGenres={selectedGenres}
            onGenreToggle={handleGenreToggle}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedMood ? `${selectedMood} Movies` : 'Recommended For You'}
            </h2>
          </div>
          {displayMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {displayMovies.map((movie: any) => (
                <MovieCard 
                  key={movie.id}
                  movie={{
                    id: movie.id,
                    title: movie.title,
                    posterPath: movie.poster_path,
                    backdropPath: movie.backdrop_path,
                    overview: movie.overview,
                    releaseDate: movie.release_date,
                    voteAverage: movie.vote_average,
                    genreIds: movie.genre_ids
                  }}
                  onWatchlistToggle={(id) => console.log('Toggled watchlist:', id)}
                  onRate={(id, rating) => console.log('Rated:', id, rating)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {selectedMood ? 'Loading movies...' : 'Select a mood to get started!'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
