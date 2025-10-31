import { type User, type InsertUser, type Mood, type WatchlistItem, type Rating } from "@shared/schema";
import { randomUUID } from "crypto";

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

  constructor() {
    this.users = new Map();
    this.moods = new Map();
    this.watchlist = new Map();
    this.ratings = new Map();
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

export const storage = new MemStorage();
