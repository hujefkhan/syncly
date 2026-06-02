import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
  email:    { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true, select: false },
  fullName: { type: String, default: '' },
  bio:      { type: String, default: '', maxlength: 200 },
  avatar:   { type: String, default: '' },
  cover:    { type: String, default: '' },
  socialLinks: {
    website: String, twitter: String, instagram: String, github: String,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
},

isBanned: {
  type: Boolean,
  default: false
},

banReason: {
  type: String,
  default: ''
},
  blockedUsers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
],
  savedPosts:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

  lastUsernameChange: {
  type: Date,
  default: null
},

usernameChangeCount: {
  type: Number,
  default: 0
},
  isOnline:  { type: Boolean, default: false },
  lastActive:{ type: Date, default: Date.now },
 resetToken: String,
resetTokenExp: Date,

isVerified: {
  type: Boolean,
  default: false
},

verificationToken: String,
verificationTokenExp: Date,
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function(p) { return bcrypt.compare(p, this.password); };

export default mongoose.model('User', userSchema);
