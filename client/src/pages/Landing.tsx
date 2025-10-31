import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { Film, Brain, Heart, TrendingUp, Star, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Discover Movies That
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Match Your Mood
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            AI-powered movie recommendations based on how you feel. 
            Because every mood deserves the perfect movie.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register">
              <a>
                <Button size="lg" className="text-lg px-8 h-14" data-testid="button-get-started">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Get Started Free
                </Button>
              </a>
            </Link>
            <Link href="/login">
              <a>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 h-14 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border-white/30"
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to find your perfect movie match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 hover-elevate transition-all">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">1. Share Your Mood</h3>
              <p className="text-muted-foreground">
                Tell us how you're feeling or let our AI detect your mood from your words. 
                Happy, sad, romantic, or adventurous - we've got you covered.
              </p>
            </Card>

            <Card className="p-8 hover-elevate transition-all">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">2. AI Analysis</h3>
              <p className="text-muted-foreground">
                Our intelligent recommendation engine analyzes your mood, preferences, 
                and viewing history to curate personalized suggestions.
              </p>
            </Card>

            <Card className="p-8 hover-elevate transition-all">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Film className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">3. Enjoy Perfect Picks</h3>
              <p className="text-muted-foreground">
                Get a curated list of movies that perfectly match your current mood. 
                Rate them to improve future recommendations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for the perfect movie discovery experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: Brain,
                title: "AI Mood Detection",
                description: "Advanced sentiment analysis to understand your emotions"
              },
              {
                icon: Heart,
                title: "Personalized Watchlist",
                description: "Save and organize movies you want to watch later"
              },
              {
                icon: Star,
                title: "Smart Ratings",
                description: "Rate movies to improve your recommendations"
              },
              {
                icon: TrendingUp,
                title: "Trending Movies",
                description: "Stay updated with what's popular right now"
              },
              {
                icon: Sparkles,
                title: "Genre Preferences",
                description: "Customize recommendations by your favorite genres"
              },
              {
                icon: Film,
                title: "Detailed Insights",
                description: "View trailers, cast info, and comprehensive details"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover-elevate transition-all">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary/10 to-purple-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Perfect Movie?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of movie lovers discovering films that match their mood
          </p>
          <Link href="/register">
            <a>
              <Button size="lg" className="text-lg px-10 h-14" data-testid="button-start-now">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Watching Now
              </Button>
            </a>
          </Link>
        </div>
      </section>

      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Film className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">CineSense</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Intelligent movie recommendations powered by AI
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">How It Works</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CineSense. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
