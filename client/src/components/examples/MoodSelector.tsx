import { useState } from 'react';
import MoodSelector from '../MoodSelector';
import type { MoodType } from '@/lib/types';

export default function MoodSelectorExample() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>('Happy');

  return (
    <div className="p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">How are you feeling today?</h2>
        <MoodSelector 
          selectedMood={selectedMood}
          onMoodSelect={(mood) => {
            console.log('Mood selected:', mood);
            setSelectedMood(mood);
          }}
        />
      </div>
    </div>
  );
}
