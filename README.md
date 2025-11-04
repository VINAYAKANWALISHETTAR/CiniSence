# CineSense Platform

An AI-powered movie recommendation system that detects user mood and suggests films accordingly.

## 🎬 Overview

CineSense Platform is a full-stack web application that revolutionizes movie discovery by using artificial intelligence to match films with your current emotional state. Simply describe how you're feeling, and our system will recommend movies that perfectly align with your mood.

## 🚀 Key Features

### AI Mood Detection
- Advanced sentiment analysis using Google Gemini AI
- Real-time emotion detection from text input
- Personalized movie recommendations based on detected mood

### Smart Movie Discovery
- Comprehensive movie database powered by TMDB
- Intelligent search with typo tolerance
- Genre-based filtering and sorting

### Personalized Experience
- User authentication and profile management
- Watchlist functionality to save movies for later
- Movie rating system with analytics tracking

### Real-time Analytics
- Mood history tracking and visualization
- Movie rating statistics
- Personalized insights based on viewing habits

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Shadcn UI** components
- **React Query** for data fetching and caching
- **Wouter** for client-side routing

### Backend
- **Express.js** with TypeScript
- **Node.js** runtime environment
- **PostgreSQL** database with Drizzle ORM
- **JWT** for secure authentication
- **bcrypt** for password hashing

### APIs & Services
- **TMDB API** for movie data
- **Google Gemini API** for AI mood detection
- **Node-fetch** for HTTP requests

### Development Tools
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality
- **dotenv** for environment management

## 📁 Project Structure

```
CineSensePlatform/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-level pages
│   │   ├── lib/         # Utility functions and API clients
│   │   └── hooks/       # Custom React hooks
├── server/              # Backend Express server
│   ├── lib/             # External API integrations
│   ├── middleware/      # Authentication middleware
│   └── routes.ts        # API route definitions
├── shared/              # Shared types and schemas
└── config files         # Environment, build, and styling configs
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- TMDB API key
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/CineSense.git
cd CineSense
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
TMDB_API_KEY=your_tmdb_api_key
GEMINI_API_KEY=your_gemini_api_key
SESSION_SECRET=your_session_secret
DATABASE_URL=postgresql://username:password@localhost:5432/cinesense
PORT=5000
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser to `http://localhost:5000`

### Building for Production

```bash
npm run build
npm start
```

## 📱 Features in Detail

### Mood-Based Recommendations
The core feature of CineSense Platform uses Google Gemini AI to analyze user input and detect emotional states. Based on the detected mood, the system recommends movies that match the user's feelings.

### Watchlist Management
Users can save movies to their personal watchlist for later viewing. The watchlist is synchronized across sessions and devices.

### Movie Rating System
Users can rate movies on a 5-star scale. These ratings contribute to personalized analytics and help refine future recommendations.

### Analytics Dashboard
The analytics dashboard provides insights into user viewing habits, including mood history and movie rating patterns.

### Comprehensive Movie Details
Each movie page includes detailed information such as trailers, cast and crew details, synopsis, ratings, and financial data (displayed in Indian Rupees).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- [Google Gemini](https://ai.google.dev/) for the AI capabilities
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful UI components
- All the open-source libraries and tools that made this project possible

## 📞 Contact

For any questions or feedback, please open an issue on GitHub.