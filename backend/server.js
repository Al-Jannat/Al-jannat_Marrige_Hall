const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const dishRoutes = require('./routes/dish');
const posterRoutes = require('./routes/posters');
const categoryRoutes = require('./routes/category');
const imageRoutes = require('./routes/images');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Use CORS_ORIGIN from .env, with fallback for local development
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'https://al-jannat-marrige-hall-czgy-4niwvuy8e-al-jannats-projects.vercel.app', // Add frontend origin
  'http://localhost:3000' // For local development
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/posters', posterRoutes);
app.use('/api/images', imageRoutes);

connectDB();

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.get('/', (req, res) => {
  res.send('Welcome to Al-Jannat Marriage Hall API');
});



// Global error handler to prevent crashes
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;