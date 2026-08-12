const connectDB = require('./config/db');
const app = require('./app');

// Ensure MongoDB connects on every serverless invocation/cold start
let isConnected = false;
async function ensureDbConnected() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

// Middleware to lazily connect DB per request on Vercel
app.use(async (req, res, next) => {
  try {
    await ensureDbConnected();
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Start the server if running in a non-serverless environment (like Render or local dev)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  ensureDbConnected()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to database on startup:', err);
      process.exit(1);
    });
}

// CRITICAL FOR VERCEL: Export the Express app
module.exports = app;