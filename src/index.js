import express from 'express';
import { Provider } from 'oidc-provider';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import file lokal wajib pakai ekstensi .js di ESM
import configuration from './config/configuration.js';
import interactionRoutes from './routes/interaction.js';

// Setup __dirname untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    // Gunakan MONGO_URI dari Environment Variables Vercel
    cachedDb = await mongoose.connect(process.env.MONGO_URI);
    return cachedDb;
}

// Middleware koneksi DB
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
// Issuer otomatis menggunakan domain Vercel jika tersedia
const ISSUER = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : `http://localhost:${process.env.PORT || 3000}`;

const oidc = new Provider(ISSUER, {
    ...configuration,
    cookies: {
        ...configuration.cookies,
        short: { secure: true },
        long: { secure: true },
    }
});

// Route untuk Login Interaction (Pastikan interaction.js juga sudah pakai export default)
app.use('/interaction', interactionRoutes(oidc));

// Pasang OIDC Provider di path /oidc
app.use('/oidc', oidc.callback());

// Halaman utama
app.get('/', (req, res) => {
    res.send('🚀 RCell SSO Server is Online (ESM Mode)!');
});

// EKSPOR UNTUK VERCEL
export default app;
