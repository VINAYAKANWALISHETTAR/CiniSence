# 🎬 CineSense – Intelligent Movie Recommendation System

## Project Overview

CineSense is a full-stack intelligent movie recommendation web application that personalizes movie suggestions based on user mood, genre preferences, ratings, and behavior. The system combines content-based and collaborative filtering techniques with AI-powered mood detection to provide highly personalized recommendations.

## Key Features

### 1. User Authentication
- Secure signup/login with email and password
- JWT-based authentication for secure session management
- User profile management with preference settings

### 2. Mood Intelligence
- **Manual Mood Selection**: Users can select from 6 predefined moods (Happy, Sad, Romantic, Adventurous, Angry, Relaxed)
- **AI-Powered Mood Detection**: Text sentiment analysis to automatically detect user's mood from written input
- **Mood History Tracking**: Records user's mood selections over time for better recommendations

### 3. Hybrid Recommendation Engine
- **Content-Based Filtering**: Recommends movies based on user's favorite genres
- **Collaborative Filtering**: Suggests movies based on similar users' preferences (partially implemented)
- **Mood-Based Recommendations**: Suggests movies that match the user's current or detected mood
- **Real-time Data**: Powered by TMDb API for up-to-date movie information

### 4. User Dashboard
- Personalized movie recommendations based on mood and preferences
- Interactive mood selector with visual feedback
- AI mood detector for automatic mood analysis
- Genre preference management

### 5. Watchlist & Ratings
- Bookmark movies for later viewing
- Personalized watchlist per user
- Movie rating system (1-5 stars)
- Easy management of saved movies

### 6. Movie Discovery
- Trending movies section
- Search functionality to find specific movies
- Detailed movie information pages
- YouTube trailer integration

### 7. Analytics Dashboard
- Mood distribution visualization
- Recent mood history tracking
- Usage statistics and patterns

## Tech Stack

### Frontend
- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Animations**: Framer Motion (planned)

### Backend
- **Framework**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM (with mock implementation for development)
- **Authentication**: JWT tokens
- **APIs**: TMDb API for movie data
- **AI/ML**: Custom sentiment analysis implementation

### APIs & Services
- **Movie Data**: TMDb API
- **Authentication**: JWT
- **Database**: MongoDB Atlas (production) / MockDB (development)

## Project Structure

```
cinisence/
├── frontend/              # Next.js frontend application
│   ├── app/               # App router pages
│   │   ├── auth/          # Authentication pages (login, register)
│   │   ├── dashboard/     # User dashboard
│   │   ├── movies/        # Movie discovery and details
│   │   ├── watchlist/     # User watchlist
│   │   ├── analytics/     # Analytics dashboard
│   │   ├── landing/       # Landing page
│   │   └── ...            # Other pages
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── lib/               # Utility functions and API services
│   └── public/            # Static assets
├── backend/               # Node.js/Express backend API
│   ├── controllers/       # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Helper functions
│   └── server.ts          # Entry point
└── documentation/         # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Movies
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/search?q=:query` - Search movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/recommend` - Get personalized recommendations
- `GET /api/movies/mood?mood=:mood` - Get mood-based recommendations

### User
- `GET /api/user/watchlist` - Get user watchlist
- `POST /api/user/watchlist` - Add movie to watchlist
- `DELETE /api/user/watchlist/:id` - Remove movie from watchlist
- `POST /api/user/ratings` - Rate a movie
- `POST /api/user/mood` - Log user mood
- `GET /api/user/mood-history` - Get user mood history

### Mood
- `POST /api/mood/detect` - Detect mood from text
- `GET /api/mood/history` - Get mood history

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (for production)
- TMDb API key

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

#### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
```

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```
4. Set up environment variables in both directories
5. Run the development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Development Workflow

### Running the Application
1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend server: `cd frontend && npm run dev`
3. Access the application at `http://localhost:3000`

### Building for Production
1. Build the backend: `cd backend && npm run build`
2. Build the frontend: `cd frontend && npm run build`

## Core Components

### Frontend Components
- **MoodSelector**: Interactive mood selection interface
- **MoodDetector**: AI-powered text sentiment analysis
- **MovieCard**: Reusable movie display component
- **Header**: Navigation and user authentication
- **ProtectedRoute**: Route protection for authenticated pages
- **GenreSelector**: Genre preference management
- **FeedbackForm**: User feedback collection

### Backend Modules
- **AuthController**: User authentication and profile management
- **MovieController**: Movie data fetching and recommendations
- **UserController**: Watchlist and user preference management
- **MoodController**: Mood detection and history tracking
- **Sentiment Utility**: Text-based mood analysis
- **Recommendations Utility**: Hybrid recommendation algorithms
- **TMDB Utility**: Integration with TMDb API
- **MockDB Utility**: Development database implementation

## Future Enhancements

1. **Advanced AI Features**
   - Facial emotion detection via webcam
   - Voice-based interaction
   - Multilingual interface
   - Chatbot for personalized recommendations

2. **Social Features**
   - Friends system
   - Movie discussion forums
   - Shared watchlists
   - Social sharing

3. **Enhanced Recommendations**
   - Deep learning models
   - Real-time collaborative filtering
   - Context-aware recommendations (time, location, weather)

4. **Mobile Application**
   - Native mobile app
   - Offline watchlist
   - Push notifications

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Backend (Render)
1. Create a new web service on Render
2. Connect GitHub repository
3. Set environment variables
4. Set build command: `npm install`
5. Set start command: `npm start`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.