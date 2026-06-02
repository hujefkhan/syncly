import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  content: {
    type: String,
    default: '',
    maxlength: 2000
  },

  images: [{
    url: String,
    publicId: String
  }],

  type: {
  type: String,
  enum: [
    'post',
    'reel',
    'audio',
    'art'
  ],
  default: 'post'
},

  hashtags: [{
    type: String,
    index: true
  }],

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  taggedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  shareCount: {
    type: Number,
    default: 0
  },

}, { timestamps: true });

postSchema.index({ createdAt: -1 });

export default mongoose.model('Post', postSchema);