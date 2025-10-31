import { useState } from "react";
import Header from "@/components/Header";
import MoodSelector from "@/components/MoodSelector";
import AIMoodDetector from "@/components/AIMoodDetector";
import MovieCard from "@/components/MovieCard";
import GenreSelector from "@/components/GenreSelector";
import { Card } from "@/components/ui/card";
import { Film, Heart, Star } from "lucide-react";
import type { MoodType, Movie } from "@/lib/types";

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([28, 35, 878]);

  const mockMovies: Movie[] = [
    {
      id: 1,
      title: "Inception",
      posterPath: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      backdropPath: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      overview: "A thief who steals corporate secrets through dream-sharing technology.",
      releaseDate: "2010-07-16",
      voteAverage: 8.4,
      genreIds: [28, 878, 53]
    },
    {
      id: 2,
      title: "The Shawshank Redemption",
      posterPath: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      backdropPath: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
      overview: "Two imprisoned men bond over years, finding solace and redemption.",
      releaseDate: "1994-09-23",
      voteAverage: 8.7,
      genreIds: [18, 80]
    },
    {
      id: 3,
      title: "The Dark Knight",
      posterPath: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdropPath: "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
      overview: "Batman faces the Joker in an epic battle for Gotham's soul.",
      releaseDate: "2008-07-18",
      voteAverage: 8.5,
      genreIds: [28, 80, 18]
    },
    {
      id: 4,
      title: "Interstellar",
      posterPath: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdropPath: "/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg",
      overview: "A team of explorers travel through a wormhole in space.",
      releaseDate: "2014-11-07",
      voteAverage: 8.6,
      genreIds: [12, 18, 878]
    }
  ];

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
      <Header isAuthenticated={true} />
      
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mockMovies.map(movie => (
              <MovieCard 
                key={movie.id}
                movie={movie}
                onWatchlistToggle={(id) => console.log('Toggled watchlist:', id)}
                onRate={(id, rating) => console.log('Rated:', id, rating)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
