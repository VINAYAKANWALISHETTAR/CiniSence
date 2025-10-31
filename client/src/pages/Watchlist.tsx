import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Heart } from "lucide-react";
import type { Movie } from "@/lib/types";

export default function Watchlist() {
  const mockWatchlist: Movie[] = [
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
      id: 3,
      title: "The Dark Knight",
      posterPath: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdropPath: "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
      overview: "Batman faces the Joker in an epic battle for Gotham's soul.",
      releaseDate: "2008-07-18",
      voteAverage: 8.5,
      genreIds: [28, 80, 18]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <div className="bg-pink-500/10 p-4 rounded-lg">
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">My Watchlist</h1>
            <p className="text-muted-foreground text-lg">
              {mockWatchlist.length} movies to watch
            </p>
          </div>
        </div>

        {mockWatchlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mockWatchlist.map(movie => (
              <MovieCard 
                key={movie.id}
                movie={movie}
                isInWatchlist={true}
                onWatchlistToggle={(id) => console.log('Removed from watchlist:', id)}
                onRate={(id, rating) => console.log('Rated:', id, rating)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground">
              Start adding movies you want to watch later
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
