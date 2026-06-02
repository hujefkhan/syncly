import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  media: {
    url: String,
    publicId: String
  },

  viewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400
  }

});

export default mongoose.model('Story', storySchema);