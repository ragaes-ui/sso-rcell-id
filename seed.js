// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User'); 

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(async () => {
    console.log('🌱 Sedang membersihkan dan menanam data user...');
    
    // Hapus data lama biar bersih
    await User.deleteMany({ email: 'admin@contoh.com' });

    // Buat password baru: password123
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = new User({
        email: 'admin@contoh.com',
        password: hashedPassword,
        name: 'Raga Esa P', // Menggunakan nama profil kamu
        role: 'admin'
    });
    
    await user.save();
    console.log('✅ BERHASIL! User sudah siap di MongoDB Atlas.');
    console.log('📧 Email: admin@contoh.com');
    console.log('🔑 Pass: password123');
    process.exit();
  })
  .catch((err) => {
    console.error('❌ Gagal menanam user:', err);
    process.exit(1);
  });