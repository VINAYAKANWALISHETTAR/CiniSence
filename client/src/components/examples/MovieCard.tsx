import MovieCard from '../MovieCard';

export default function MovieCardExample() {
  const mockMovie = {
    id: 1,
    title: "Inception",
    posterPath: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdropPath: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
    releaseDate: "2010-07-16",
    voteAverage: 8.4,
    genreIds: [28, 878, 53]
  };

  return (
    <div className="w-64 p-4 bg-background">
      <MovieCard 
        movie={mockMovie}
        onWatchlistToggle={(id) => console.log('Watchlist toggled for movie:', id)}
        onRate={(id, rating) => console.log('Rated movie', id, 'with', rating, 'stars')}
      />
    </div>
  );
}
