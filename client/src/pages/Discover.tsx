import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { movies as moviesApi, watchlist as watchlistApi, ratings as ratingsApi } from "@/lib/api";
import { useLocation } from "wouter";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlistItems, setWatchlistItems] = useState<Set<number>>(new Set());
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Extract search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, []);

  // Fetch watchlist items
  const { data: watchlistData = [], refetch: refetchWatchlist } = useQuery({
    queryKey: ['/api/watchlist'],
    queryFn: watchlistApi.get,
    enabled: !!localStorage.getItem('token')
  });

  useEffect(() => {
    if (watchlistData.length > 0) {
      const watchlistSet = new Set<number>();
      watchlistData.forEach((item: any) => {
        watchlistSet.add(item.movieId);
      });
      setWatchlistItems(watchlistSet);
    }
  }, [watchlistData]);

  const { data: trendingMovies = [] } = useQuery({
    queryKey: ['/api/movies/trending'],
    queryFn: moviesApi.getTrending
  });

  const { data: popularMovies = [] } = useQuery({
    queryKey: ['/api/movies/popular'],
    queryFn: moviesApi.getPopular
  });

  const { data: topRatedMovies = [] } = useQuery({
    queryKey: ['/api/movies/top-rated'],
    queryFn: moviesApi.getTopRated
  });

  const { data: searchResults = [], refetch: refetchSearch } = useQuery({
    queryKey: ['/api/movies/search', searchQuery],
    queryFn: () => moviesApi.search(searchQuery),
    enabled: !!searchQuery.trim()
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Update URL with search query
    if (query.trim()) {
      setLocation(`/discover?search=${encodeURIComponent(query)}`);
    } else {
      setLocation('/discover');
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

  const handleWatchlistToggle = async (movieId: number) => {
    try {
      if (watchlistItems.has(movieId)) {
        // Remove from watchlist
        await watchlistApi.remove(movieId);
      } else {
        // Add to watchlist
        await watchlistApi.add(movieId);
      }
      refetchWatchlist();
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    }
  };

  const handleRating = async (movieId: number, rating: number) => {
    try {
      // Submit rating to backend
      await ratingsApi.add(movieId, rating);
      
      // Invalidate ratings query to refresh analytics
      queryClient.invalidateQueries({ queryKey: ['/api/ratings'] });
      
      console.log(`Rated movie ${movieId} with ${rating} stars`);
    } catch (error) {
      console.error('Failed to rate movie:', error);
    }
  };

  const renderMovieGrid = (movies: any[]) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie: any) => (
        <MovieCard 
          key={movie.id}
          movie={convertMovie(movie)}
          isInWatchlist={watchlistItems.has(movie.id)}
          onWatchlistToggle={handleWatchlistToggle}
          onRate={handleRating}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-6">Discover Movies</h1>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for movies..."
              className="pl-12 h-14 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e.currentTarget.value);
                }
              }}
              data-testid="input-search-movies"
            />
          </div>
        </div>

        {searchQuery && searchResults.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Search Results for "{searchQuery}"</h2>
            {renderMovieGrid(searchResults)}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-muted-foreground">Try searching for something else</p>
          </div>
        ) : (
          <Tabs defaultValue="trending" className="w-full">
            <TabsList>
              <TabsTrigger value="trending" data-testid="tab-trending">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="popular" data-testid="tab-popular">
                Popular
              </TabsTrigger>
              <TabsTrigger value="top-rated" data-testid="tab-top-rated">
                Top Rated
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="mt-8">
              {renderMovieGrid(trendingMovies as any[])}
            </TabsContent>

            <TabsContent value="popular" className="mt-8">
              {renderMovieGrid(popularMovies as any[])}
            </TabsContent>

            <TabsContent value="top-rated" className="mt-8">
              {renderMovieGrid(topRatedMovies as any[])}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}