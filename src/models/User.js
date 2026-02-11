import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String 
  },
  role: { 
    type: String, 
    default: 'user' 
  }
}, { timestamps: true });

// Method untuk mengecek password saat login
userSchema.methods.isValidPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

export default User;
