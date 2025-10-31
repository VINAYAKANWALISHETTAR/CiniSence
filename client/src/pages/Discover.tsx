import { useState } from "react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Movie } from "@/lib/types";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");

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
    },
    {
      id: 5,
      title: "Pulp Fiction",
      posterPath: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      backdropPath: "/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg",
      overview: "The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine.",
      releaseDate: "1994-10-14",
      voteAverage: 8.5,
      genreIds: [80, 18]
    },
    {
      id: 6,
      title: "Forrest Gump",
      posterPath: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      backdropPath: "/7c9UVPPiTPltouxRVY6N9uUaJsf.jpg",
      overview: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.",
      releaseDate: "1994-07-06",
      voteAverage: 8.5,
      genreIds: [35, 18, 10749]
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} onSearch={handleSearch} />
      
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
            <TabsTrigger value="upcoming" data-testid="tab-upcoming">
              Upcoming
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="mt-8">
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
          </TabsContent>

          <TabsContent value="popular" className="mt-8">
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
          </TabsContent>

          <TabsContent value="top-rated" className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {mockMovies.slice(0, 4).map(movie => (
                <MovieCard 
                  key={movie.id}
                  movie={movie}
                  onWatchlistToggle={(id) => console.log('Toggled watchlist:', id)}
                  onRate={(id, rating) => console.log('Rated:', id, rating)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {mockMovies.slice(0, 3).map(movie => (
                <MovieCard 
                  key={movie.id}
                  movie={movie}
                  onWatchlistToggle={(id) => console.log('Toggled watchlist:', id)}
                  onRate={(id, rating) => console.log('Rated:', id, rating)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
