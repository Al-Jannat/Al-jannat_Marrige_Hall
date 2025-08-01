const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const dishRoutes = require('./routes/dish');
const posterRoutes = require('./routes/posters'); // Added posters route
const categoryRoutes = require('./routes/category');
const imageRoutes = require('./routes/images');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use('/api', apiRoutes); // Handles /api/services, /api/gallery, /api/pricing, /api/contact
app.use('/api/auth', authRoutes); // Handles /api/auth/register, /api/auth/verify-otp, /api/auth/login
app.use('/api/menu', menuRoutes); // Handles /api/menu/add, /api/menu/list, /api/menu/edit/:id, /api/menu/delete/:id
app.use('/api/dishes', dishRoutes); // Handles /api/dishes/add, /api/dishes, /api/dishes/:id
app.use('/api/categories', categoryRoutes); // Handles /api/categories, /api/categories/add, /api/categories/:id
app.use('/api/posters', posterRoutes); // Mount posters route
app.use('/api/images', imageRoutes);
connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});