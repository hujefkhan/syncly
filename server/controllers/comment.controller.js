import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { createNotification } from '../services/notification.service.js';

export const addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw new ApiError(404, 'Post not found');
  const c = await Comment.create({
    post: post._id, author: req.user.id, text: req.body.text, parent: req.body.parent || null,
  });
  await c.populate('author', 'username avatar fullName');
 await createNotification({
  recipient: post.author,
  sender: req.user.id,
  type: 'comment',
  post: post._id,
  commentText: c.text
});
  res.status(201).json({ success: true, comment: c });
});

export const listComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId, parent: null })
    .sort('-createdAt').populate('author', 'username avatar fullName');
  res.json({ success: true, comments });
});

export const listReplies = asyncHandler(async (req, res) => {
  const replies = await Comment.find({ parent: req.params.commentId })
    .sort('createdAt').populate('author', 'username avatar fullName');
  res.json({ success: true, replies });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) throw new ApiError(404, 'Not found');
  if (String(c.author) !== req.user.id) throw new ApiError(403, 'Forbidden');
  await c.deleteOne();
  res.json({ success: true });
});

export const toggleLikeComment = asyncHandler(async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) throw new ApiError(404, 'Not found');
  const i = c.likes.findIndex(u => String(u) === req.user.id);
  if (i >= 0) c.likes.splice(i, 1); else c.likes.push(req.user.id);
  await c.save();
  res.json({ success: true, liked: i < 0, likeCount: c.likes.length });
});
