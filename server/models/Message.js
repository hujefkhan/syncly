import mongoose from 'mongoose';
const msgSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  sender:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:         { type: String, default: '' },
  image:        { type: String, default: '' },
  video:        { type: String, default: '' },
  sharedPost: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Post',
  default: null
},
  replyTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Message',
  default: null
},
  seenBy:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
export default mongoose.model('Message', msgSchema);
