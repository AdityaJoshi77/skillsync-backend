

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes.js'); 
const skillRoutes = require('./routes/skillRoutes.js')
const roadmapRoutes = require('./routes/roadmapRoutes.js')

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // your Next.js frontend URL
  credentials: true, // allow sending cookies
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/skill', skillRoutes);
app.use('/api/roadmap', roadmapRoutes);

// Routes placeholder
app.get('/', (req,res) => {
    res.send('API is running');
});

// DB Connection + Server Start
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('DB Connection successful');
    app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`))
    })
.catch((err) => console.log('DB connection failed:', err))