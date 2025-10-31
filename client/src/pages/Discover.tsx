import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { movies as moviesApi } from "@/lib/api";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: trendingMovies = [] } = useQuery({
    queryKey: ['/api/movies/trending']
  });

  const { data: popularMovies = [] } = useQuery({
    queryKey: ['/api/movies/popular']
  });

  const { data: topRatedMovies = [] } = useQuery({
    queryKey: ['/api/movies/top-rated']
  });

  const { data: searchResults = [], refetch: searchMovies } = useQuery({
    queryKey: ['/api/movies/search', searchQuery],
    queryFn: () => searchQuery ? moviesApi.search(searchQuery) : Promise.resolve([]),
    enabled: false
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      searchMovies();
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

  const renderMovieGrid = (movies: any[]) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie: any) => (
        <MovieCard 
          key={movie.id}
          movie={convertMovie(movie)}
          onWatchlistToggle={(id) => console.log('Toggled watchlist:', id)}
          onRate={(id, rating) => console.log('Rated:', id, rating)}
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
              data-testid="input-search-movies"
            />
          </div>
        </div>

        {searchQuery && searchResults.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Search Results for "{searchQuery}"</h2>
            {renderMovieGrid(searchResults)}
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
              {renderMovieGrid(trendingMovies)}
            </TabsContent>

            <TabsContent value="popular" className="mt-8">
              {renderMovieGrid(popularMovies)}
            </TabsContent>

            <TabsContent value="top-rated" className="mt-8">
              {renderMovieGrid(topRatedMovies)}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
