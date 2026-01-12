const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const projectRoutes = require('./routes/projectRoutes');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://nrt-portphoilo.vercel.app",
        "https://next-revolution-tech.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/estimate', require('./routes/estimateRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));


// --- Static File Serving ---
// The frontend is deployed separately on Vercel.
// We do not serve static files from here in production.
// const frontendPath = path.join(__dirname, '../NRT FRONTEND/dist');
// app.use(express.static(frontendPath));

// API Routes
app.get('/api/health', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ status: 'OK', time: result.rows[0].now });
    } catch (err) {
        console.error('Database connection error', err);
        res.status(500).json({ status: 'Error', error: err.message });
    }
});

// --- Catch-All Route ---
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(frontendPath, 'index.html'));
// });

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
