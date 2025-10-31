import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, Play } from "lucide-react";
import { useState } from "react";
import type { Movie } from "@/lib/types";

interface MovieCardProps {
  movie: Movie;
  onWatchlistToggle?: (movieId: number) => void;
  onRate?: (movieId: number, rating: number) => void;
  isInWatchlist?: boolean;
  userRating?: number;
}

export default function MovieCard({ 
  movie, 
  onWatchlistToggle, 
  onRate,
  isInWatchlist = false,
  userRating 
}: MovieCardProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentRating, setCurrentRating] = useState(userRating || 0);
  const [isWatchlisted, setIsWatchlisted] = useState(isInWatchlist);

  const posterUrl = movie.posterPath 
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const handleWatchlistClick = () => {
    setIsWatchlisted(!isWatchlisted);
    onWatchlistToggle?.(movie.id);
  };

  const handleRating = (rating: number) => {
    setCurrentRating(rating);
    onRate?.(movie.id, rating);
  };

  return (
    <Card 
      className="group relative overflow-hidden rounded-lg border-0 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
      data-testid={`card-movie-${movie.id}`}
    >
      <div className="aspect-[2/3] relative">
        <img 
          src={posterUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
          data-testid={`img-poster-${movie.id}`}
        />
        
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-2 right-2 backdrop-blur-md bg-black/30 hover:bg-black/50 z-10 ${
            isWatchlisted ? 'text-red-500' : 'text-white'
          }`}
          onClick={handleWatchlistClick}
          data-testid={`button-watchlist-${movie.id}`}
        >
          <Heart className={`h-5 w-5 ${isWatchlisted ? 'fill-current' : ''}`} />
        </Button>

        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-300 ${
          showOverlay ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 p-4 flex flex-col justify-end text-white space-y-3">
            <h3 className="font-semibold text-lg line-clamp-2" data-testid={`text-title-${movie.id}`}>
              {movie.title}
            </h3>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{movie.voteAverage.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-300">
                {new Date(movie.releaseDate).getFullYear()}
              </span>
            </div>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className="hover:scale-110 transition-transform"
                  data-testid={`button-rate-${movie.id}-${star}`}
                >
                  <Star 
                    className={`h-5 w-5 ${
                      star <= currentRating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>

            <Button 
              size="sm" 
              className="w-full backdrop-blur-md bg-primary/90 hover:bg-primary"
              data-testid={`button-details-${movie.id}`}
            >
              <Play className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
