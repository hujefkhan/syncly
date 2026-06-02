import mongoose from 'mongoose';

const convSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
      },
    ],

    isGroup: {
      type: Boolean,
      default: false,
    },

    groupName: {
      type: String,
      default: '',
    },

    groupAvatar: {
      type: String,
      default: '',
    },

   admins: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Conversation', convSchema);