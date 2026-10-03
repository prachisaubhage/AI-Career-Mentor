const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables (.env if present, otherwise defaults)
dotenv.config();

// Database connection
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const projectRoutes = require('./routes/projectRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const codingRoutes = require('./routes/codingRoutes');
const aptitudeRoutes = require('./routes/aptitudeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
// ML Prediction route (connects existing trained model to the API)
const predictionRoutes = require('./routes/predictionRoutes');
// Gemini AI — Career Roadmap
const roadmapRoutes    = require('./routes/roadmapRoutes');

// Error middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware: Helmet with relaxed cross-origin resource policy for uploaded assets
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://ai-career-mentor-ebon.vercel.app',
  'http://localhost:5173',
  'http://localhost:5001'
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiting: relaxed for local development, enforced in production
const isDev = process.env.NODE_ENV !== 'production';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 200,
  skip: () => isDev,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Career Mentor backend is running',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/prediction', predictionRoutes); // ML placement readiness prediction
app.use('/api/roadmap', roadmapRoutes);        // Gemini AI career roadmap


// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Only listen if this file is run directly (supports test runner / supertest if needed)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
