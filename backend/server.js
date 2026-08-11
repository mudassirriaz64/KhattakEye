const connectDB = require('./config/db');
const app = require('./app');
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Explicitly connect to the database first
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (err) {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  }
}

startServer();

