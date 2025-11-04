import { type User, type InsertUser, type Mood, type WatchlistItem, type Rating } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const { Pool } = pg;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  addMood(userId: string, mood: string): Promise<Mood>;
  getUserMoods(userId: string, limit?: number): Promise<Mood[]>;
  
  addToWatchlist(userId: string, movieId: number): Promise<WatchlistItem>;
  removeFromWatchlist(userId: string, movieId: number): Promise<boolean>;
  getWatchlist(userId: string): Promise<WatchlistItem[]>;
  isInWatchlist(userId: string, movieId: number): Promise<boolean>;
  
  addRating(userId: string, movieId: number, rating: number): Promise<Rating>;
  getUserRatings(userId: string): Promise<Rating[]>;
  getRating(userId: string, movieId: number): Promise<Rating | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private moods: Map<string, Mood>;
  private watchlist: Map<string, WatchlistItem>;
  private ratings: Map<string, Rating>;
  private initialized: boolean = false;

  constructor() {
    this.users = new Map();
    this.moods = new Map();
    this.watchlist = new Map();
    this.ratings = new Map();
  }
  
  async initialize() {
    if (this.initialized) return;
    
    // Create a default test user for development
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser: User = {
      id: 'test-user-123',
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      favoriteGenres: [],
      createdAt: new Date()
    };
    this.users.set(testUser.id, testUser);
    console.log('✓ Test user created - Email: test@example.com, Password: password123');
    this.initialized = true;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      email: insertUser.email,
      password: insertUser.password,
      name: insertUser.name || null,
      favoriteGenres: [],
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async addMood(userId: string, mood: string): Promise<Mood> {
    const id = randomUUID();
    const moodEntry: Mood = {
      id,
      userId,
      mood,
      timestamp: new Date()
    };
    this.moods.set(id, moodEntry);
    return moodEntry;
  }

  async getUserMoods(userId: string, limit = 10): Promise<Mood[]> {
    return Array.from(this.moods.values())
      .filter(m => m.userId === userId)
      .sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, limit);
  }

  async addToWatchlist(userId: string, movieId: number): Promise<WatchlistItem> {
    const id = randomUUID();
    const item: WatchlistItem = {
      id,
      userId,
      movieId,
      addedAt: new Date()
    };
    this.watchlist.set(id, item);
    return item;
  }

  async removeFromWatchlist(userId: string, movieId: number): Promise<boolean> {
    const items = Array.from(this.watchlist.entries());
    const entry = items.find(([_, item]) => 
      item.userId === userId && item.movieId === movieId
    );
    
    if (entry) {
      this.watchlist.delete(entry[0]);
      return true;
    }
    return false;
  }

  async getWatchlist(userId: string): Promise<WatchlistItem[]> {
    return Array.from(this.watchlist.values())
      .filter(item => item.userId === userId)
      .sort((a, b) => {
        const timeA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
        const timeB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
        return timeB - timeA;
      });
  }

  async isInWatchlist(userId: string, movieId: number): Promise<boolean> {
    return Array.from(this.watchlist.values()).some(
      item => item.userId === userId && item.movieId === movieId
    );
  }

  async addRating(userId: string, movieId: number, rating: number): Promise<Rating> {
    const existing = Array.from(this.ratings.entries()).find(([_, r]) => 
      r.userId === userId && r.movieId === movieId
    );
    
    if (existing) {
      const updated = { ...existing[1], rating, ratedAt: new Date() };
      this.ratings.set(existing[0], updated);
      return updated;
    }
    
    const id = randomUUID();
    const ratingEntry: Rating = {
      id,
      userId,
      movieId,
      rating,
      ratedAt: new Date()
    };
    this.ratings.set(id, ratingEntry);
    return ratingEntry;
  }

  async getUserRatings(userId: string): Promise<Rating[]> {
    return Array.from(this.ratings.values())
      .filter(r => r.userId === userId);
  }

  async getRating(userId: string, movieId: number): Promise<Rating | undefined> {
    return Array.from(this.ratings.values()).find(
      r => r.userId === userId && r.movieId === movieId
    );
  }
}

// PostgreSQL Storage Implementation
export class PostgresStorage implements IStorage {
  private pool: pg.Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return undefined;
    const row = result.rows[0];
    return {
      ...row,
      favoriteGenres: Array.isArray(row.favorite_genres) ? row.favorite_genres : [],
      createdAt: new Date(row.created_at)
    };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) return undefined;
    const row = result.rows[0];
    return {
      ...row,
      favoriteGenres: Array.isArray(row.favorite_genres) ? row.favorite_genres : [],
      createdAt: new Date(row.created_at)
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const result = await this.pool.query(
      'INSERT INTO users (id, email, password, name, favorite_genres, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, insertUser.email, insertUser.password, insertUser.name || null, [], new Date()]
    );
    const row = result.rows[0];
    return {
      ...row,
      favoriteGenres: [],
      createdAt: new Date(row.created_at)
    };
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const favoriteGenres = updates.favoriteGenres || [];
    const result = await this.pool.query(
      'UPDATE users SET name = $1, favorite_genres = $2 WHERE id = $3 RETURNING *',
      [updates.name ?? user.name, favoriteGenres, id]
    );
    const row = result.rows[0];
    return {
      ...row,
      favoriteGenres: Array.isArray(row.favorite_genres) ? row.favorite_genres : [],
      createdAt: new Date(row.created_at)
    };
  }

  async addMood(userId: string, mood: string): Promise<Mood> {
    const id = randomUUID();
    const result = await this.pool.query(
      'INSERT INTO moods (id, user_id, mood, timestamp) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, userId, mood, new Date()]
    );
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      mood: row.mood,
      timestamp: new Date(row.timestamp)
    };
  }

  async getUserMoods(userId: string, limit = 10): Promise<Mood[]> {
    const result = await this.pool.query(
      'SELECT * FROM moods WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      mood: row.mood,
      timestamp: new Date(row.timestamp)
    }));
  }

  async addToWatchlist(userId: string, movieId: number): Promise<WatchlistItem> {
    const id = randomUUID();
    const result = await this.pool.query(
      'INSERT INTO watchlist (id, user_id, movie_id, added_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, userId, movieId, new Date()]
    );
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      movieId: row.movie_id,
      addedAt: new Date(row.added_at)
    };
  }

  async removeFromWatchlist(userId: string, movieId: number): Promise<boolean> {
    const result = await this.pool.query(
      'DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2',
      [userId, movieId]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getWatchlist(userId: string): Promise<WatchlistItem[]> {
    const result = await this.pool.query(
      'SELECT * FROM watchlist WHERE user_id = $1 ORDER BY added_at DESC',
      [userId]
    );
    return result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      movieId: row.movie_id,
      addedAt: new Date(row.added_at)
    }));
  }

  async isInWatchlist(userId: string, movieId: number): Promise<boolean> {
    const result = await this.pool.query(
      'SELECT 1 FROM watchlist WHERE user_id = $1 AND movie_id = $2',
      [userId, movieId]
    );
    return result.rows.length > 0;
  }

  async addRating(userId: string, movieId: number, rating: number): Promise<Rating> {
    const existing = await this.getRating(userId, movieId);
    
    if (existing) {
      const result = await this.pool.query(
        'UPDATE ratings SET rating = $1, rated_at = $2 WHERE user_id = $3 AND movie_id = $4 RETURNING *',
        [rating, new Date(), userId, movieId]
      );
      const row = result.rows[0];
      return {
        id: row.id,
        userId: row.user_id,
        movieId: row.movie_id,
        rating: row.rating,
        ratedAt: new Date(row.rated_at)
      };
    }
    
    const id = randomUUID();
    const result = await this.pool.query(
      'INSERT INTO ratings (id, user_id, movie_id, rating, rated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, userId, movieId, rating, new Date()]
    );
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      movieId: row.movie_id,
      rating: row.rating,
      ratedAt: new Date(row.rated_at)
    };
  }

  async getUserRatings(userId: string): Promise<Rating[]> {
    const result = await this.pool.query(
      'SELECT * FROM ratings WHERE user_id = $1',
      [userId]
    );
    return result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      movieId: row.movie_id,
      rating: row.rating,
      ratedAt: new Date(row.rated_at)
    }));
  }

  async getRating(userId: string, movieId: number): Promise<Rating | undefined> {
    const result = await this.pool.query(
      'SELECT * FROM ratings WHERE user_id = $1 AND movie_id = $2',
      [userId, movieId]
    );
    if (result.rows.length === 0) return undefined;
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      movieId: row.movie_id,
      rating: row.rating,
      ratedAt: new Date(row.rated_at)
    };
  }
}

// Use PostgreSQL storage if DATABASE_URL is set, otherwise use in-memory storage
export const storage = process.env.DATABASE_URL 
  ? new PostgresStorage()
  : new MemStorage();

// Initialize storage
if (storage instanceof MemStorage) {
  storage.initialize().then(() => {
    console.log('✓ In-memory storage initialized');
  });
} else {
  console.log('✓ PostgreSQL storage initialized');
}
