# CineSense - Intelligent Movie Recommendation System

## Overview
CineSense is a full-stack intelligent movie recommendation web application that personalizes movie suggestions based on user mood, genre preferences, ratings, and behavior. The system combines content-based filtering with AI-powered mood detection to provide highly personalized recommendations.

## Tech Stack

### Frontend
- React with Wouter for routing
- TypeScript for type safety
- Tailwind CSS + Shadcn UI components
- TanStack Query for data fetching
- Recharts for data visualization

### Backend
- Express.js with TypeScript
- In-memory storage (MemStorage)
- JWT authentication with bcrypt
- TMDb API for movie data
- Google Gemini API for AI mood detection

## Key Features

1. **User Authentication**
   - Secure signup/login with JWT tokens
   - Password hashing with bcrypt
   - Protected routes

2. **Mood Intelligence**
   - Manual mood selection (Happy, Sad, Romantic, Adventurous, Angry, Relaxed)
   - AI-powered mood detection using Google Gemini
   - Mood history tracking

3. **Movie Recommendations**
   - TMDb API integration for real movie data
   - Mood-based filtering
   - Genre-based personalization
   - Trending, popular, and top-rated movies

4. **User Features**
   - Personal watchlist management
   - Movie rating system (1-5 stars)
   - Search functionality
   - Analytics dashboard with mood distribution charts

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile

### Movies
- GET `/api/movies/trending` - Get trending movies
- GET `/api/movies/popular` - Get popular movies
- GET `/api/movies/top-rated` - Get top rated movies
- GET `/api/movies/search?q=query` - Search movies
- GET `/api/movies/by-mood?mood=Happy` - Get mood-based recommendations
- GET `/api/movies/recommend` - Get personalized recommendations
- GET `/api/movies/:id` - Get movie details

### Mood
- POST `/api/mood/detect` - Detect mood from text using AI
- POST `/api/mood` - Log user mood
- GET `/api/mood/history` - Get mood history

### Watchlist
- GET `/api/watchlist` - Get user watchlist
- POST `/api/watchlist` - Add movie to watchlist
- DELETE `/api/watchlist/:movieId` - Remove from watchlist
- GET `/api/watchlist/check/:movieId` - Check if in watchlist

### Ratings
- GET `/api/ratings` - Get user ratings
- POST `/api/ratings` - Rate a movie
- GET `/api/ratings/:movieId` - Get rating for specific movie

## Environment Variables

Required secrets:
- `TMDB_API_KEY` - The Movie Database API key
- `GEMINI_API_KEY` - Google Gemini API key  
- `SESSION_SECRET` - JWT signing secret

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities and API client
│   │   └── App.tsx      # Main app component
├── server/              # Backend Express application
│   ├── lib/             # TMDb and Gemini integrations
│   ├── middleware/      # Auth middleware
│   ├── routes.ts        # API routes
│   └── storage.ts       # In-memory data storage
└── shared/              # Shared types and schemas
    └── schema.ts        # Database schemas and types
```

## Recent Changes
- Completed full-stack implementation
- Integrated TMDb API for real movie data
- Added Google Gemini for AI mood detection
- Implemented authentication system with JWT
- Created all CRUD operations for watchlist, ratings, and moods
- Built responsive UI with modern design
- Added mood-based and genre-based recommendations

## Development
Run `npm run dev` to start both frontend and backend servers.