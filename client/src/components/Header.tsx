import { Button } from "@/components/ui/button";
import { Film, Search, User, LogOut, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
}

export default function Header({ isAuthenticated = false, onLogout, onSearch }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    console.log('Dark mode toggled:', !isDarkMode);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/">
            <a className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2" data-testid="link-home">
              <Film className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                CineSense
              </span>
            </a>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <a>
                  <Button 
                    variant={location === '/dashboard' ? 'secondary' : 'ghost'}
                    data-testid="link-dashboard"
                  >
                    Dashboard
                  </Button>
                </a>
              </Link>
              <Link href="/discover">
                <a>
                  <Button 
                    variant={location === '/discover' ? 'secondary' : 'ghost'}
                    data-testid="link-discover"
                  >
                    Discover
                  </Button>
                </a>
              </Link>
              <Link href="/watchlist">
                <a>
                  <Button 
                    variant={location === '/watchlist' ? 'secondary' : 'ghost'}
                    data-testid="link-watchlist"
                  >
                    Watchlist
                  </Button>
                </a>
              </Link>
              <Link href="/analytics">
                <a>
                  <Button 
                    variant={location === '/analytics' ? 'secondary' : 'ghost'}
                    data-testid="link-analytics"
                  >
                    Analytics
                  </Button>
                </a>
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search movies..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
            </form>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleDarkMode}
            data-testid="button-theme-toggle"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" data-testid="button-user-menu">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem data-testid="menu-profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => {
                    onLogout?.();
                    console.log('User logged out');
                  }}
                  data-testid="menu-logout"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <a>
                  <Button variant="ghost" data-testid="button-login">
                    Login
                  </Button>
                </a>
              </Link>
              <Link href="/register">
                <a>
                  <Button data-testid="button-signup">
                    Sign Up
                  </Button>
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
