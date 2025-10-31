import Header from "@/components/Header";
import MoodDistributionChart from "@/components/MoodDistributionChart";
import { Card } from "@/components/ui/card";
import { TrendingUp, Heart, Star, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Analytics() {
  const mockMoodData = [
    { mood: 'Happy', count: 12, color: '#eab308' },
    { mood: 'Sad', count: 5, color: '#3b82f6' },
    { mood: 'Romantic', count: 8, color: '#ec4899' },
    { mood: 'Adventurous', count: 15, color: '#22c55e' },
    { mood: 'Angry', count: 3, color: '#ef4444' },
    { mood: 'Relaxed', count: 10, color: '#06b6d4' },
  ];

  const mockMoodHistory = [
    { date: '2025-10-31', mood: 'Happy', moviesWatched: 3 },
    { date: '2025-10-30', mood: 'Adventurous', moviesWatched: 2 },
    { date: '2025-10-29', mood: 'Relaxed', moviesWatched: 4 },
    { date: '2025-10-28', mood: 'Romantic', moviesWatched: 1 },
    { date: '2025-10-27', mood: 'Happy', moviesWatched: 2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Analytics</h1>
          <p className="text-muted-foreground text-lg">
            Track your movie watching patterns and mood insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Movies</p>
              <Film className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">127</p>
            <p className="text-sm text-green-500 mt-2">+12 this month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">4.2</p>
            <p className="text-sm text-muted-foreground mt-2">Out of 5 stars</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Watchlist</p>
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
            <p className="text-3xl font-bold">23</p>
            <p className="text-sm text-muted-foreground mt-2">Movies to watch</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Most Common</p>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">Adventurous</p>
            <p className="text-sm text-muted-foreground mt-2">Your top mood</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MoodDistributionChart data={mockMoodData} />

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Recent Mood History</h3>
            <div className="space-y-4">
              {mockMoodHistory.map((entry, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground w-24">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <Badge variant="outline" className="px-3 py-1">
                      {entry.mood}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {entry.moviesWatched} movie{entry.moviesWatched !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Top Genres</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Science Fiction', count: 28 },
              { name: 'Action', count: 24 },
              { name: 'Adventure', count: 22 },
              { name: 'Drama', count: 18 },
              { name: 'Comedy', count: 15 },
              { name: 'Thriller', count: 12 },
            ].map((genre, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg"
              >
                <span className="font-medium">{genre.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {genre.count}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
