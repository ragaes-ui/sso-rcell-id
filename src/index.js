// src/index.js
require('dotenv').config(); // Load .env di baris paling atas
const express = require('express');
const mongoose = require('mongoose');
const { Provider } = require('oidc-provider');
const path = require('path');

// --- IMPORT FILE LOKAL ---
// Pastikan kedua file ini sudah Anda buat dari langkah sebelumnya
const configuration = require('./config/configuration');
const interactionRoutes = require('./routes/interaction');

const app = express();
const PORT = 3000;

// ==========================================
// 1. BAGIAN DATABASE (MONGODB)
// ==========================================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ FATAL ERROR: MONGO_URI tidak ditemukan di .env');
  process.exit(1);
}

// Opsi agar koneksi stabil
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Kita bungkus start server dalam fungsi async agar rapi
// Server hanya jalan kalau DB sudah connect
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, mongooseOptions);
    console.log('✅ Terhubung ke MongoDB Atlas');

    // ==========================================
    // 2. SETUP EXPRESS & VIEW ENGINE
    // ==========================================
    
    // Memberitahu Express lokasi folder 'views' untuk file .ejs
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    // Middleware untuk membaca data dari Form HTML (PENTING untuk Login)
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // ==========================================
    // 3. SETUP OIDC PROVIDER
    // ==========================================
    
    // Inisialisasi Provider dengan URL Issuer & Konfigurasi
    // 'proxy: true' berguna jika nanti di-deploy di belakang Nginx/Cloudflare
    const oidc = new Provider(`http://localhost:${PORT}`, {
      ...configuration, // Load settingan dari file config/configuration.js
      
      // Jika Anda deploy ke production (HTTPS), set ini ke true
      // Karena di localhost (HTTP), cookies butuh secure: false
      cookies: {
        keys: ['kunci-rahasia-cookie-acak-1234567890'],
        short: { secure: false }, // Ubah true jika sudah pakai HTTPS
        long: { secure: false },  // Ubah true jika sudah pakai HTTPS
      },
    });

    // PENTING: Fix untuk error "proxy trust" jika di belakang reverse proxy
    oidc.proxy = true;

    // ==========================================
    // 4. ROUTING (JALUR URL)
    // ==========================================

    // A. Route Interaksi (Halaman Login UI)
    // Route ini WAJIB dipasang SEBELUM oidc.callback()
    // Kita kirim variable 'oidc' ke dalam router agar bisa dipakai
    app.use('/interaction', interactionRoutes(oidc));

    // B. Route Utama OIDC (/oidc/auth, /oidc/token, dll)
    app.use('/oidc', oidc.callback());

    // C. Halaman Home Sederhana (Opsional)
    app.get('/', (req, res) => {
      res.send('<h1>SSO Server Berjalan!</h1><a href="/oidc/.well-known/openid-configuration">Cek Discovery</a>');
    });

    // ==========================================
    // 5. JALANKAN SERVER
    // ==========================================
    app.listen(PORT, () => {
      console.log(`🚀 SSO Server berjalan di http://localhost:${PORT}`);
      console.log(`🔗 Issuer URL: http://localhost:${PORT}/oidc`);
      console.log(`🛠  Discovery: http://localhost:${PORT}/oidc/.well-known/openid-configuration`);
    });

  } catch (err) {
    console.error('❌ Gagal menjalankan server:', err);
    process.exit(1);
  }
}

startServer();