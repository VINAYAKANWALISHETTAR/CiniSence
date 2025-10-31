import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

interface GenreSelectorProps {
  selectedGenres: number[];
  onGenreToggle: (genreId: number) => void;
}

export default function GenreSelector({ selectedGenres, onGenreToggle }: GenreSelectorProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Favorite Genres</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Select your favorite genres to get better recommendations
      </p>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre.id);
          
          return (
            <Badge
              key={genre.id}
              variant={isSelected ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2 text-sm hover-elevate active-elevate-2"
              onClick={() => onGenreToggle(genre.id)}
              data-testid={`badge-genre-${genre.id}`}
            >
              {isSelected && <Check className="h-3 w-3 mr-1" />}
              {genre.name}
            </Badge>
          );
        })}
      </div>
    </Card>
  );
}
