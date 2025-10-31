import { Card } from "@/components/ui/card";
import { Smile, Frown, Heart, Compass, Flame, Wind } from "lucide-react";
import type { MoodType } from "@/lib/types";

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onMoodSelect: (mood: MoodType) => void;
}

const moods: { type: MoodType; icon: typeof Smile; color: string; gradient: string }[] = [
  { type: 'Happy', icon: Smile, color: 'text-yellow-500', gradient: 'from-yellow-500/20 to-orange-500/20' },
  { type: 'Sad', icon: Frown, color: 'text-blue-500', gradient: 'from-blue-500/20 to-indigo-500/20' },
  { type: 'Romantic', icon: Heart, color: 'text-pink-500', gradient: 'from-pink-500/20 to-rose-500/20' },
  { type: 'Adventurous', icon: Compass, color: 'text-green-500', gradient: 'from-green-500/20 to-emerald-500/20' },
  { type: 'Angry', icon: Flame, color: 'text-red-500', gradient: 'from-red-500/20 to-orange-600/20' },
  { type: 'Relaxed', icon: Wind, color: 'text-cyan-500', gradient: 'from-cyan-500/20 to-teal-500/20' },
];

export default function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {moods.map(({ type, icon: Icon, color, gradient }) => {
        const isSelected = selectedMood === type;
        
        return (
          <Card
            key={type}
            className={`p-6 cursor-pointer transition-all duration-300 hover-elevate active-elevate-2 ${
              isSelected 
                ? `ring-4 ring-primary scale-105 bg-gradient-to-br ${gradient}` 
                : 'hover:scale-105'
            }`}
            onClick={() => onMoodSelect(type)}
            data-testid={`button-mood-${type.toLowerCase()}`}
          >
            <div className="flex flex-col items-center gap-3">
              <Icon className={`h-12 w-12 ${isSelected ? color : 'text-muted-foreground'}`} />
              <span className={`font-semibold text-sm ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                {type}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
