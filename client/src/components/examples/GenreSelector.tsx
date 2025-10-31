import { useState } from 'react';
import GenreSelector from '../GenreSelector';

export default function GenreSelectorExample() {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([28, 35, 878]);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
    console.log('Genre toggled:', genreId);
  };

  return (
    <div className="p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <GenreSelector 
          selectedGenres={selectedGenres}
          onGenreToggle={handleGenreToggle}
        />
      </div>
    </div>
  );
}
