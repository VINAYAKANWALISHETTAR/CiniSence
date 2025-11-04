import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Heart, Search } from "lucide-react";
import { watchlist as watchlistApi, movies as moviesApi, ratings as ratingsApi } from "@/lib/api";

export default function Watchlist() {
  const queryClient = useQueryClient();
  
  const { data: watchlistItems = [], refetch: refetchWatchlist } = useQuery({
    queryKey: ['/api/watchlist'],
    queryFn: watchlistApi.get,
  });

  // Fetch movie details for each watchlist item
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['/api/watchlist/movies'],
    queryFn: async () => {
      if (watchlistItems.length === 0) return [];
      
      try {
        const moviePromises = watchlistItems.map((item: any) => 
          moviesApi.getDetails(item.movieId)
        );
        const movieResults = await Promise.all(moviePromises);
        return movieResults.filter(movie => movie !== null);
      } catch (error) {
        console.error('Error fetching watchlist movies:', error);
        return [];
      }
    },
    enabled: watchlistItems.length > 0
  });

  const handleWatchlistToggle = async (movieId: number) => {
    try {
      await watchlistApi.remove(movieId);
      refetchWatchlist();
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
    }
  };

  const handleRating = async (movieId: number, rating: number) => {
    try {
      // Submit rating to backend
      await ratingsApi.add(movieId, rating);
      
      // Invalidate ratings query to refresh analytics
      queryClient.invalidateQueries();
      
      console.log(`Rated movie ${movieId} with ${rating} stars`);
    } catch (error) {
      console.error('Failed to rate movie:', error);
    }
  };

  const convertMovie = (movie: any) => ({
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    overview: movie.overview,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    genreIds: movie.genre_ids
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <div className="bg-pink-500/10 p-4 rounded-lg">
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">My Watchlist</h1>
            <p className="text-muted-foreground text-lg">
              {movies.length} movies to watch
            </p>
          </div>
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie: any) => (
              <MovieCard 
                key={movie.id}
                movie={convertMovie(movie)}
                isInWatchlist={true}
                onWatchlistToggle={handleWatchlistToggle}
                onRate={handleRating}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-4">
              Start adding movies you want to watch later
            </p>
            <button 
              onClick={() => window.location.href = '/discover'}
              className="text-primary hover:underline"
            >
              Discover movies now
            </button>
          </div>
        )}
      </main>
    </div>
  );
}