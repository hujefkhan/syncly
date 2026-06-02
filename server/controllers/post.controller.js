import Notification from '../models/Notification.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { createNotification } from '../services/notification.service.js';

const extractHashtags = (text='') => [...text.matchAll(/#(\w+)/g)].map(m => m[1].toLowerCase());
const extractMentions = (text='') =>
  [...text.matchAll(/@(\w+)/g)]
    .map(m => m[1].toLowerCase());
export const createPost = asyncHandler(async (req, res) => {

  const images = (req.files || []).map(f => ({
    url: f.path,
    publicId: f.filename
  }));

  // frontend sends:
  // taggedUsers = ["userid1","userid2"]
  let taggedUsers = [];

  try {

    taggedUsers = JSON.parse(
      req.body.taggedUsers || '[]'
    );

  } catch {

    taggedUsers = [];

  }
       
  console.log(taggedUsers);
  const post = await Post.create({

    author: req.user.id,

    content: req.body.content || '',

    images,

    hashtags: extractHashtags(
      req.body.content
    ),

    taggedUsers ,
    type: req.body.type || 'post',

  });

  await post.populate(
    'author',
    'username avatar fullName'
  );

  const mentions = extractMentions(
    post.content
  );

  const mentionedUsers = await User.find({
    username: { $in: mentions }
  });

  // mention notifications
  for (const user of mentionedUsers) {

    await createNotification({

      recipient: user._id,

      sender: req.user.id,

      type: 'mention',

      post: post._id

    });

  }

  // tagged notifications
  for (const taggedUserId of taggedUsers) {

    // avoid duplicate notification
    if (
      String(taggedUserId) ===
      String(req.user.id)
    ) continue;

    await createNotification({

      recipient: taggedUserId,

      sender: req.user.id,

      type: 'tag',

      post: post._id

    });

  }

  res.status(201).json({
    success: true,
    post
  });

});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');
  if (String(post.author) !== req.user.id) throw new ApiError(403, 'Forbidden');
  post.content = req.body.content ?? post.content;
  post.hashtags = extractHashtags(post.content);
  await post.save();
  res.json({ success: true, post });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');
  if (String(post.author) !== req.user.id) throw new ApiError(403, 'Forbidden');
await Notification.deleteMany({
  post: post._id
});

await post.deleteOne();
  res.json({ success: true });
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username avatar fullName');
  if (!post) throw new ApiError(404, 'Post not found');
  res.json({ success: true, post });
});
export const followingFeed = asyncHandler(async (req, res) => {

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;

  const me = await User.findById(req.user.id);

  const authors = [
  ...me.following,
  me._id
].filter(
  id => !me.blockedUsers.includes(id)
);

  const bannedUsers = await User.find({
  isBanned: true
}).select('_id');

const bannedIds =
  bannedUsers.map(u => u._id);

const posts = await Post.find({
  author: {
    $in: authors,
    $nin: bannedIds
  }
})
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('author', 'username avatar fullName');

  res.json({
    success: true,
    posts,
    page
  });

});
export const forYouFeed = asyncHandler(async (req, res) => {

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;

  const me = await User.findById(req.user.id);

const usersWhoBlockedMe =
  await User.find({
    blockedUsers: req.user.id
  }).select('_id');

const blockedIds = [
  ...me.blockedUsers,
  ...usersWhoBlockedMe.map(u => u._id)
];
const bannedUsers = await User.find({
  isBanned: true
}).select('_id');

const bannedIds =
  bannedUsers.map(u => u._id);

const posts = await Post.find({
  author: {
    $nin: [
      ...blockedIds,
      ...bannedIds
    ]
  }
})
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit)
    .populate(
      'author',
      'username avatar fullName'
    );

  res.json({
    success: true,
    posts,
    page
  });

});
export const explore = asyncHandler(async (req, res) => {

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 12;

  const category = req.query.category || 'Trending';

  let filter = {};
  const me = await User.findById(req.user.id);

const usersWhoBlockedMe =
  await User.find({
    blockedUsers: req.user.id
  }).select('_id');

const blockedIds = [
  ...me.blockedUsers,
  ...usersWhoBlockedMe.map(u => u._id)
];
const bannedUsers = await User.find({
  isBanned: true
}).select('_id');

const bannedIds =
  bannedUsers.map(u => u._id);

filter.author = {
  $nin: [
    ...blockedIds,
    ...bannedIds
  ]
};

  if (category === 'Reels') {

    filter.type = 'reel';

  }

  if (category === 'Audio') {

    filter.type = 'audio';

  }

  if (category === 'Art') {

    filter.type = 'art';

  }

  const sortBy =
  req.query.sortBy || 'latest';

let sort = { createdAt: -1 };

if (sortBy === 'likes') {

  sort = { likes: -1 };

}

if (sortBy === 'shares') {

  sort = { shareCount: -1 };

}

  if (
  category === 'Trending' ||
  sortBy === 'trending'
) {

    sort = {
      shareCount: -1,
      createdAt: -1
    };

  }

  const posts = await Post.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate(
      'author',
      'username avatar fullName'
    );

    let finalPosts = posts;

if (category === 'Trending') {

  finalPosts = posts.map(post => {

    const likes =
      post.likes?.length || 0;

    const comments =
      post.commentCount || 0;

    const shares =
      post.shareCount || 0;

    const trendScore =
      likes * 3 +
      comments * 5 +
      shares * 8;

    return {
      ...post.toObject(),
      trendScore
    };

  });

  finalPosts.sort(
    (a, b) =>
      b.trendScore - a.trendScore
  );

}

res.json({
  success: true,
  posts: finalPosts,
  page
});

});

export const toggleLike = asyncHandler(async (req, res) => {

  const post = await Post.findById(
    req.params.id
  );

  if (!post)
    throw new ApiError(404, 'Not found');

  const i = post.likes.findIndex(
    u => String(u) === req.user.id
  );

  if (i >= 0) {

    post.likes.splice(i, 1);

  } else {

    post.likes.push(req.user.id);

    await createNotification({

      recipient: post.author,

      sender: req.user.id,

      type: 'like',

      post: post._id

    });

  }

  await post.save();

  res.json({
    success: true,
    liked: i < 0,
    likeCount: post.likes.length
  });

});

export const sharePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { shareCount: 1 } }, { new: true });
  res.json({ success: true, shareCount: post.shareCount });
});
export const userPosts = asyncHandler(async (req, res) => {

  const me = await User.findById(
    req.user.id
  );

  const isOwnProfile =
    String(me._id) ===
    String(req.params.userId);

  const blockedUser =
    !isOwnProfile &&
    me.blockedUsers.some(
      id =>
        String(id) ===
        String(req.params.userId)
    );

  if (blockedUser) {

    return res.json({
      success: true,
      posts: []
    });

  }

  const posts = await Post.find({
    author: req.params.userId
  })
    .sort('-createdAt')
    .populate(
      'author',
      'username avatar fullName'
    );

  res.json({
    success: true,
    posts
  });

});