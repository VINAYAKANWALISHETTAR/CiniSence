import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Calendar, Clock, Users, Play, Globe, DollarSign, Award } from "lucide-react";
import { movies as moviesApi, watchlist as watchlistApi, ratings as ratingsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function MovieDetails() {
  const { id } = useParams();
  const movieId = parseInt(id || "0");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [allTrailers, setAllTrailers] = useState<any[]>([]);

  const { data: movie, isLoading, error } = useQuery({
    queryKey: [`/api/movies/${movieId}`],
    queryFn: () => moviesApi.getDetails(movieId),
    enabled: !!movieId
  });

  // Check if movie is in watchlist
  const { data: watchlistCheck } = useQuery({
    queryKey: [`/api/watchlist/check/${movieId}`],
    queryFn: () => watchlistApi.check(movieId),
    enabled: !!user && !!movieId
  });

  // Fetch existing rating for this movie
  const { data: existingRating } = useQuery({
    queryKey: [`/api/ratings/${movieId}`],
    queryFn: () => ratingsApi.getForMovie(movieId),
    enabled: !!user && !!movieId
  });

  useEffect(() => {
    if (existingRating) {
      setUserRating(existingRating.rating);
    }
  }, [existingRating]);

  useEffect(() => {
    if (watchlistCheck) {
      setIsInWatchlist(watchlistCheck.inWatchlist);
    }
  }, [watchlistCheck]);

  useEffect(() => {
    if (movie && movie.videos && movie.videos.results) {
      // Find all trailers and teasers
      const trailers = movie.videos.results.filter(
        (video: any) => (video.type === "Trailer" || video.type === "Teaser") && video.site === "YouTube"
      );
      
      setAllTrailers(trailers);
      
      // Set the first trailer as the primary one
      if (trailers.length > 0) {
        setTrailerKey(trailers[0].key);
      }
    }
  }, [movie]);

  const handleWatchlistToggle = async () => {
    if (!user) {
      alert("Please log in to add movies to your watchlist");
      return;
    }
    
    try {
      if (isInWatchlist) {
        await watchlistApi.remove(movieId);
      } else {
        await watchlistApi.add(movieId);
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    }
  };

  const handleRating = async (rating: number) => {
    if (!user) {
      alert("Please log in to rate movies");
      return;
    }
    
    try {
      // Submit rating to backend
      await ratingsApi.add(movieId, rating);
      
      // Update local state
      setUserRating(rating);
      
      // Invalidate ratings query to refresh analytics
      queryClient.invalidateQueries({ queryKey: ['/api/ratings'] });
      
      console.log("Rating movie:", movieId, "with rating:", rating);
    } catch (error) {
      console.error('Failed to rate movie:', error);
    }
  };

  const handleWatchTrailer = (key: string) => {
    window.open(`https://www.youtube.com/watch?v=${key}`, "_blank");
  };

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

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">Movie not found</h1>
            <p className="mt-2">Could not load details for this movie.</p>
            <Button 
              className="mt-4" 
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://via.placeholder.com/1280x720?text=No+Backdrop';

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';
  
  // Format budget and revenue in Indian Rupees
  const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A';
    
    // Convert USD to INR (approximate exchange rate)
    const inrAmount = amount * 83; // 1 USD ≈ 83 INR (approximate)
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(inrAmount);
  };

  // Get director
  const director = movie.credits?.crew?.find((person: any) => person.job === "Director");

  // Get top cast
  const topCast = movie.credits?.cast?.slice(0, 15) || [];

  // Get all crew members
  const allCrew = movie.credits?.crew || [];

  // Get genres
  const genres = movie.genres || [];

  // Get production companies
  const productionCompanies = movie.production_companies?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Backdrop */}
      <div className="relative h-96 md:h-[500px]">
        <img 
          src={backdropUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        
        {/* Movie info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="container mx-auto flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img 
                src={posterUrl} 
                alt={movie.title}
                className="w-48 md:w-64 rounded-lg shadow-2xl"
              />
            </div>
            
            <div className="text-white flex-1">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{movie.vote_average?.toFixed(1)}</span>
                  <span className="text-gray-300">/10</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-5 w-5" />
                  <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  <span>{runtime}</span>
                </div>
                
                {movie.status && (
                  <Badge variant="secondary">{movie.status}</Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((genre: any) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <Button 
                  variant="default" 
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleWatchlistToggle}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
                  {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
                
                {trailerKey && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="bg-white/10 hover:bg-white/20 border-white/20"
                    onClick={() => handleWatchTrailer(trailerKey)}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Trailer
                  </Button>
                )}
                
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg">
                  <span className="text-white">Rate:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star 
                          className={`h-6 w-6 ${
                            star <= userRating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Movie details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-lg text-muted-foreground">
                {movie.overview || 'No overview available.'}
              </p>
            </section>
            
            {topCast.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {topCast.map((person: any) => (
                    <div key={person.id} className="text-center">
                      <div className="bg-muted rounded-lg aspect-[2/3] mb-2 flex items-center justify-center overflow-hidden">
                        {person.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} 
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <p className="font-medium text-sm truncate">{person.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{person.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {allTrailers.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Trailers & Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allTrailers.map((trailer: any) => (
                    <div 
                      key={trailer.id} 
                      className="bg-muted rounded-lg overflow-hidden cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleWatchTrailer(trailer.key)}
                    >
                      <div className="relative aspect-video bg-black">
                        <img 
                          src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`} 
                          alt={trailer.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-3">
                            <Play className="h-8 w-8 text-white fill-white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-medium truncate">{trailer.name}</p>
                        <p className="text-xs text-muted-foreground">{trailer.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          
          <div>
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Details</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Release Date</p>
                    <p>{movie.release_date || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-muted-foreground mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Runtime</p>
                    <p>{runtime}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-muted-foreground mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p>{movie.status || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p>{formatCurrency(movie.budget)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p>{formatCurrency(movie.revenue)}</p>
                  </div>
                </div>
                
                {director && (
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-muted-foreground mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Director</p>
                      <p>{director.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
            
            {productionCompanies.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Production Companies</h2>
                <div className="flex flex-wrap gap-2">
                  {productionCompanies.map((company: any) => (
                    <Badge key={company.id} variant="outline">
                      {company.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
            
            {allCrew.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Crew</h2>
                <div className="space-y-3">
                  {allCrew
                    .filter((person: any) => ['Director', 'Producer', 'Writer', 'Executive Producer', 'Composer'].includes(person.job))
                    .slice(0, 10)
                    .map((person: any) => (
                      <div key={person.id} className="flex justify-between">
                        <span className="font-medium">{person.name}</span>
                        <span className="text-muted-foreground text-sm">{person.job}</span>
                      </div>
                    ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}