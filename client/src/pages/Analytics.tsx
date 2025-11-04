import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Heart, Star, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mood, watchlist, ratings } from "@/lib/api";

export default function Analytics() {
  // Fetch real mood data
  const { data: moodHistory = [] } = useQuery({
    queryKey: ['/api/mood/history'],
    queryFn: () => mood.getHistory(20)
  });

  // Fetch watchlist data
  const { data: watchlistItems = [] } = useQuery({
    queryKey: ['/api/watchlist'],
    queryFn: watchlist.get
  });

  // Fetch ratings data
  const { data: userRatings = [] } = useQuery({
    queryKey: ['/api/ratings'],
    queryFn: ratings.get
  });

  // Calculate average rating
  const averageRating = userRatings.length > 0 
    ? (userRatings.reduce((sum: number, rating: { rating: number }) => sum + rating.rating, 0) / userRatings.length).toFixed(1)
    : "0.0";

  // Get mood history with actual timestamps
  const recentMoodHistory = moodHistory.slice(0, 10).map((mood: any) => ({
    ...mood,
    date: new Date(mood.timestamp)
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Analytics</h1>
          <p className="text-muted-foreground text-lg">
            Track your movie watching patterns and mood insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Movies Rated</p>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">{userRatings.length}</p>
            <p className="text-sm text-muted-foreground mt-2">Movies you've rated</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">{averageRating}</p>
            <p className="text-sm text-muted-foreground mt-2">Out of 5 stars</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Watchlist</p>
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
            <p className="text-3xl font-bold">{watchlistItems.length}</p>
            <p className="text-sm text-muted-foreground mt-2">Movies to watch</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Recent Mood History</h3>
            <div className="space-y-4">
              {recentMoodHistory.length > 0 ? (
                recentMoodHistory.map((entry: any, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground w-24">
                        {entry.date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <Badge variant="outline" className="px-3 py-1">
                        {entry.mood}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.date.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No mood history yet. Detect your mood to see history here.
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Your Activity</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Film className="h-5 w-5 text-primary" />
                  <span>Watchlist Items</span>
                </div>
                <Badge>{watchlistItems.length}</Badge>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Movies Rated</span>
                </div>
                <Badge>{userRatings.length}</Badge>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <span>Mood Detections</span>
                </div>
                <Badge>{moodHistory.length}</Badge>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-xs text-white">★</span>
                  </div>
                  <span>Avg Rating</span>
                </div>
                <Badge>{averageRating}</Badge>
              </div>
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