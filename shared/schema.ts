import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  favoriteGenres: text("favorite_genres").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const moods = pgTable("moods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  mood: text("mood").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const watchlist = pgTable("watchlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  movieId: integer("movie_id").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  movieId: integer("movie_id").notNull(),
  rating: integer("rating").notNull(),
  ratedAt: timestamp("rated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertMoodSchema = createInsertSchema(moods).pick({
  mood: true,
});

export const insertWatchlistSchema = createInsertSchema(watchlist).pick({
  movieId: true,
});

export const insertRatingSchema = createInsertSchema(ratings).pick({
  movieId: true,
  rating: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Mood = typeof moods.$inferSelect;
export type WatchlistItem = typeof watchlist.$inferSelect;
export type Rating = typeof ratings.$inferSelect;
