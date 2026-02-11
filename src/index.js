const express = require('express');
const { Provider } = require('oidc-provider');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Memuat variabel lingkungan
dotenv.config();

const app = express();

// Konfigurasi Penting untuk Vercel (Proxy Trust)
app.set('trust proxy', true);

// Setup View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware untuk memproses data form
app.use(express.urlencoded({ extended: true }));

// --- KONEKSI MONGODB (SERVERLESS OPTIMIZED) ---
let cachedDb = null;
async function connectToDatabase() {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }
    console.log('🔄 Menghubungkan ke MongoDB Atlas...');
    cachedDb = await mongoose.connect(process.env.MONGO_URI);
    return cachedDb;
}

// Middleware untuk memastikan koneksi DB sebelum request diproses
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        console.error('❌ Database Connection Error:', err);
        res.status(500).send('Database connection failed');
    }
});

// --- OIDC PROVIDER SETUP ---
const configuration = require('./config/configuration');
// URL Issuer otomatis menyesuaikan domain Vercel (HTTPS)
const ISSUER = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT || 3000}`;

const oidc = new Provider(ISSUER, {
    ...configuration,
    // Pastikan cookies aman di lingkungan HTTPS Vercel
    cookies: {
        ...configuration.cookies,
        short: { secure: true },
        long: { secure: true },
    }
});

// Route untuk Login Interaction
const interactionRoutes = require('./routes/interaction')(oidc);
app.use('/interaction', interactionRoutes);

// Pasang OIDC Provider di path /oidc
app.use('/oidc', oidc.callback());

// Halaman utama (Opsional)
app.get('/', (req, res) => {
    res.send('🚀 RCell SSO Server is Online!');
});

// EKSPOR UNTUK VERCEL (Jangan gunakan app.listen)
module.exports = app;
