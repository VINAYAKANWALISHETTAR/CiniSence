import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertMoodSchema, insertWatchlistSchema, insertRatingSchema } from "@shared/schema";
import { generateToken, authMiddleware, type AuthRequest } from "./middleware/auth";
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies, 
  searchMovies,
  getMoviesByMood,
  getMoviesByGenres,
  getMovieDetails,
  getGenres
} from "./lib/tmdb";
import { detectMoodFromText } from "./lib/gemini";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        ...data,
        password: hashedPassword
      });

      const token = generateToken(user.id);
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      console.log(`Login attempt for email: ${data.email}`);
      
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        console.log(`User not found: ${data.email}`);
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      console.log(`User found, checking password...`);
      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) {
        console.log(`Invalid password for: ${data.email}`);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      console.log(`Login successful for: ${data.email}`);
      const token = generateToken(user.id);
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          favoriteGenres: user.favoriteGenres
        },
        token
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(400).json({ error: error.message || "Login failed" });
    }
  });

  app.get("/api/auth/profile", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        favoriteGenres: user.favoriteGenres
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/auth/profile", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { name, favoriteGenres } = req.body;
      
      const user = await storage.updateUser(req.userId!, {
        name,
        favoriteGenres
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        favoriteGenres: user.favoriteGenres
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/movies/trending", async (_req, res) => {
    try {
      const movies = await getTrendingMovies();
      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/movies/popular", async (_req, res) => {
    try {
      const movies = await getPopularMovies();
      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/movies/top-rated", async (_req, res) => {
    try {
      const movies = await getTopRatedMovies();
      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/movies/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter required" });
      }

      const movies = await searchMovies(query);
      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/movies/by-mood", async (req, res) => {
    try {
      const mood = req.query.mood as string;
      if (!mood) {
        return res.status(400).json({ error: "Mood parameter required" });
      }

      const movies = await getMoviesByMood(mood);
      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/movies/recommend", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user || !user.favoriteGenres || user.favoriteGenres.length === 0) {
        const movies = await getPopularMovies();
        return res.json(movies);
      }

      const genreIds = user.favoriteGenres.map(Number);
      const movies = await getMoviesByGenres(genreIds);
      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movieId = parseInt(req.params.id);
      const movie = await getMovieDetails(movieId);
      
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      res.json(movie);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/genres", async (_req, res) => {
    try {
      const genres = await getGenres();
      res.json(genres);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/mood/detect", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text required for mood detection" });
      }

      const result = await detectMoodFromText(text);
      
      await storage.addMood(req.userId!, result.mood);

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/mood", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = insertMoodSchema.parse(req.body);
      const mood = await storage.addMood(req.userId!, data.mood);
      res.json(mood);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/mood/history", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const moods = await storage.getUserMoods(req.userId!, limit);
      res.json(moods);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/watchlist", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const watchlist = await storage.getWatchlist(req.userId!);
      res.json(watchlist);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/watchlist", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = insertWatchlistSchema.parse(req.body);
      
      const exists = await storage.isInWatchlist(req.userId!, data.movieId);
      if (exists) {
        return res.status(400).json({ error: "Movie already in watchlist" });
      }

      const item = await storage.addToWatchlist(req.userId!, data.movieId);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/watchlist/:movieId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const movieId = parseInt(req.params.movieId);
      const removed = await storage.removeFromWatchlist(req.userId!, movieId);
      
      if (!removed) {
        return res.status(404).json({ error: "Movie not in watchlist" });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/watchlist/check/:movieId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const movieId = parseInt(req.params.movieId);
      const inWatchlist = await storage.isInWatchlist(req.userId!, movieId);
      res.json({ inWatchlist });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ratings", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = insertRatingSchema.parse(req.body);
      
      if (data.rating < 1 || data.rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }

      const rating = await storage.addRating(req.userId!, data.movieId, data.rating);
      res.json(rating);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/ratings", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const ratings = await storage.getUserRatings(req.userId!);
      res.json(ratings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/ratings/:movieId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const movieId = parseInt(req.params.movieId);
      const rating = await storage.getRating(req.userId!, movieId);
      res.json(rating || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
