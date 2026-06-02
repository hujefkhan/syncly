import User from '../models/User.js';
import Post from '../models/Post.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const searchAll = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json({ success: true, users: [], posts: [] });
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const [users, posts] = await Promise.all([
    User.find({ $or: [{ username: rx }, { fullName: rx }] }).select('username avatar fullName bio').limit(10),
    Post.find({ $or: [{ content: rx }, { hashtags: q.toLowerCase().replace('#','') }] })
      .sort('-createdAt').limit(20).populate('author','username avatar fullName'),
  ]);
  res.json({ success: true, users, posts });
});

export const searchUsers = asyncHandler(async (req, res) => {

  const q = (req.query.q || '')
    .replace('@', '')
    .trim();

  if (!q) {

    return res.json({
      success: true,
      users: []
    });

  }

  const rx = new RegExp(
    q.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    ),
    'i'
  );

  const users = await User.find({

    $or: [
      { username: rx },
      { fullName: rx }
    ]

  })
    .select(
      'username avatar fullName'
    )
    .limit(8);

  res.json({
    success: true,
    users
  });

});

export const trending = asyncHandler(async (_req, res) => {
  const since = new Date(Date.now() - 7*24*3600*1000);
  const agg = await Post.aggregate([
    { $match: { createdAt: { $gte: since }, hashtags: { $exists: true, $ne: [] } } },
    { $unwind: '$hashtags' },
    { $group: { _id: '$hashtags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }, { $limit: 10 },
  ]);
  res.json({ success: true, trending: agg.map(a => ({ tag: a._id, count: a.count })) });
});
