import { storage } from './storage.js';
import bcrypt from 'bcrypt';

async function seedDemoData() {
  console.log('🌱 Starting to seed demo data...');

  try {
    // Create demo users
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    const user1 = await storage.createUser({
      email: 'john.doe@example.com',
      password: hashedPassword,
      name: 'John Doe'
    });
    console.log('✓ Created user: John Doe');

    const user2 = await storage.createUser({
      email: 'jane.smith@example.com',
      password: hashedPassword,
      name: 'Jane Smith'
    });
    console.log('✓ Created user: Jane Smith');

    const user3 = await storage.createUser({
      email: 'mike.wilson@example.com',
      password: hashedPassword,
      name: 'Mike Wilson'
    });
    console.log('✓ Created user: Mike Wilson');

    // Update users with favorite genres
    await storage.updateUser(user1.id, {
      favoriteGenres: ['28', '12', '878'] // Action, Adventure, Sci-Fi
    });

    await storage.updateUser(user2.id, {
      favoriteGenres: ['10749', '35', '18'] // Romance, Comedy, Drama
    });

    await storage.updateUser(user3.id, {
      favoriteGenres: ['27', '53', '80'] // Horror, Thriller, Crime
    });
    console.log('✓ Updated user preferences');

    // Add moods for users
    const moods = ['Happy', 'Sad', 'Romantic', 'Adventurous', 'Angry', 'Relaxed'];
    
    for (let i = 0; i < 5; i++) {
      await storage.addMood(user1.id, moods[i % moods.length]);
      await storage.addMood(user2.id, moods[(i + 1) % moods.length]);
      await storage.addMood(user3.id, moods[(i + 2) % moods.length]);
    }
    console.log('✓ Added mood history');

    // Add watchlist items (popular movie IDs from TMDB)
    const popularMovies = [
      550, // Fight Club
      278, // The Shawshank Redemption
      238, // The Godfather
      680, // Pulp Fiction
      122, // The Lord of the Rings: The Return of the King
      155, // The Dark Knight
      13, // Forrest Gump
      769, // Goodfellas
      19995, // Avatar
      157336 // Interstellar
    ];

    // John's watchlist
    await storage.addToWatchlist(user1.id, popularMovies[0]);
    await storage.addToWatchlist(user1.id, popularMovies[1]);
    await storage.addToWatchlist(user1.id, popularMovies[9]);

    // Jane's watchlist
    await storage.addToWatchlist(user2.id, popularMovies[2]);
    await storage.addToWatchlist(user2.id, popularMovies[5]);
    await storage.addToWatchlist(user2.id, popularMovies[6]);

    // Mike's watchlist
    await storage.addToWatchlist(user3.id, popularMovies[3]);
    await storage.addToWatchlist(user3.id, popularMovies[4]);
    await storage.addToWatchlist(user3.id, popularMovies[7]);
    console.log('✓ Added watchlist items');

    // Add ratings
    await storage.addRating(user1.id, popularMovies[0], 5);
    await storage.addRating(user1.id, popularMovies[1], 5);
    await storage.addRating(user1.id, popularMovies[2], 4);

    await storage.addRating(user2.id, popularMovies[3], 5);
    await storage.addRating(user2.id, popularMovies[4], 4);
    await storage.addRating(user2.id, popularMovies[5], 5);

    await storage.addRating(user3.id, popularMovies[6], 4);
    await storage.addRating(user3.id, popularMovies[7], 5);
    await storage.addRating(user3.id, popularMovies[8], 3);
    console.log('✓ Added movie ratings');

    console.log('\n✅ Demo data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - 3 users created (password: demo123)');
    console.log('   - 15 mood entries added');
    console.log('   - 9 watchlist items added');
    console.log('   - 9 movie ratings added');
    console.log('\n👥 Demo Users:');
    console.log('   1. john.doe@example.com');
    console.log('   2. jane.smith@example.com');
    console.log('   3. mike.wilson@example.com');
    console.log('\n🔑 Password for all demo users: demo123\n');

  } catch (error: any) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedDemoData();
