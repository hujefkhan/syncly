import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import Story from '../models/Story.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { createNotification } from '../services/notification.service.js';
export const getProfile = asyncHandler(async (req, res) => {

  const user = await User.findOne({
    username: req.params.username
  })
    .populate('followers', 'username avatar')
    .populate('following', 'username avatar')
    .populate('blockedUsers');
if (!user) {
  throw new ApiError(
    404,
    'User not found'
  );
}

if (
  user.isBanned &&
  req.user?.role !== 'admin'
) {
  throw new ApiError(
    404,
    'User not found'
  );
}

  const isBlocked = req.user
    ? user.blockedUsers.some(
        u => String(u._id) === req.user.id
      )
    : false;

  res.json({
    success: true,
    user,
    isBlocked
  });

});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['fullName','bio','avatar','cover','socialLinks'];
  const patch = {};
  for (const k of allowed) if (k in req.body) patch[k] = req.body[k];
  const user = await User.findByIdAndUpdate(req.user.id, patch, { new: true });
  res.json({ success: true, user });
});

export const changeUsername = asyncHandler(async (req, res) => {

  const { username } = req.body;

  if (!username) {
    throw new ApiError(400, 'Username required');
  }

  const cleanUsername = username
    .trim()
    .toLowerCase();

  if (cleanUsername.length < 3) {
    throw new ApiError(400, 'Username too short');
  }

  const existing = await User.findOne({
    username: cleanUsername,
    _id: { $ne: req.user.id }
  });

  if (existing) {
    throw new ApiError(400, 'Username already taken');
  }

  const user = await User.findById(req.user.id);

  // first change allowed instantly
  if (user.usernameChangeCount > 0) {

    const FIFTEEN_DAYS =
      15 * 24 * 60 * 60 * 1000;

    const lastChange =
      new Date(user.lastUsernameChange).getTime();

    const now = Date.now();

    const diff = now - lastChange;

    if (diff < FIFTEEN_DAYS) {

      const remaining =
        Math.ceil(
          (FIFTEEN_DAYS - diff) /
          (1000 * 60 * 60 * 24)
        );

      throw new ApiError(
        400,
        `You can change username again in ${remaining} days`
      );

    }

  }

  user.username = cleanUsername;

  user.lastUsernameChange = new Date();

  user.usernameChangeCount += 1;

  await user.save();

  res.json({
    success: true,
    user,
    message: 'Username updated'
  });

});


export const deleteAccount = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  // delete own content

  await Post.deleteMany({
    author: userId
  });

  await Comment.deleteMany({
    author: userId
  });

  await Story.deleteMany({
    author: userId
  });

  await Notification.deleteMany({
    $or: [
      { recipient: userId },
      { sender: userId }
    ]
  });

  await Message.deleteMany({
    sender: userId
  });

  // remove user from conversations

  await Conversation.updateMany(
    {
      participants: userId
    },
    {
      $pull: {
        participants: userId
      }
    }
  );

  // delete empty conversations

  await Conversation.deleteMany({
    participants: { $size: 0 }
  });

  // remove user from other users

  await User.updateMany(
    {},
    {
      $pull: {
        followers: userId,
        following: userId,
      }
    }
  );

  // remove user from posts/comments

  await Post.updateMany(
    {},
    {
      $pull: {
        likes: userId,
        savedBy: userId,
        taggedUsers: userId
      }
    }
  );

  await Comment.updateMany(
    {},
    {
      $pull: {
        likes: userId
      }
    }
  );

  // finally delete user

  await User.findByIdAndDelete(userId);

  res.json({
    success: true,
    message: 'Account deleted'
  });

});



export const followUser = asyncHandler(async (req, res) => {
  
  if (req.params.id === req.user.id) throw new ApiError(400, 'Cannot follow yourself');
  const target = await User.findById(req.params.id);
  const me = await User.findById(req.user.id);
 
  if (!target) throw new ApiError(404, 'User not found');
  const already = me.following.includes(target._id);
  if (
  !already &&
  me.blockedUsers.includes(target._id)
) {
  throw new ApiError(
    400,
    'Unblock user first'
  );
}

if (
  !already &&
  target.blockedUsers.includes(me._id)
) {
  throw new ApiError(
    403,
    'You are blocked'
  );
}
  if (already) {
    me.following.pull(target._id); target.followers.pull(me._id);
  } else {
    me.following.push(target._id); target.followers.push(me._id);
    await createNotification({ recipient: target._id, sender: me._id, type: 'follow' });
  }
  await me.save(); await target.save();
  res.json({ success: true, following: !already });
});

export const toggleBlockUser =
  asyncHandler(async (req, res) => {

    if (req.params.id === req.user.id) {
      throw new ApiError(
        400,
        'Cannot block yourself'
      );
    }

    const me = await User.findById(
      req.user.id
    );

    const target = await User.findById(
      req.params.id
    );

    if (!target) {
      throw new ApiError(
        404,
        'User not found'
      );
    }

    const alreadyBlocked =
      me.blockedUsers.includes(target._id);

    if (alreadyBlocked) {

      me.blockedUsers.pull(target._id);

    } else {

      me.blockedUsers.push(target._id);

      // remove follow relationship

      me.following.pull(target._id);

      me.followers.pull(target._id);

      target.following.pull(me._id);

      target.followers.pull(me._id);


    }

    await me.save();
    await target.save();

    res.json({
      success: true,
      blocked: !alreadyBlocked
    });

});
export const suggestedUsers = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user.id);
  const users = await User.find({
  _id: {
    $nin: [...me.following, me._id]
  },
  isBanned: false
})
    .select('username avatar fullName bio').limit(8);
  res.json({ success: true, users });
});

export const savePost = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user.id);
  const i = me.savedPosts.findIndex(p => String(p) === req.params.postId);
  if (i >= 0) me.savedPosts.splice(i, 1); else me.savedPosts.push(req.params.postId);
  await me.save();
  res.json({ success: true, saved: i < 0 });
});

export const getSavedPosts = asyncHandler(async (req, res) => {

  // private route
  if (req.user.id !== req.params.id) {

    throw new ApiError(
      403,
      'Private'
    );

  }

  const user = await User.findById(
    req.params.id
  ).populate({
    path: 'savedPosts',
    populate: {
      path: 'author',
      select: 'username avatar fullName'
    }
  });

  res.json({
    success: true,
    posts: user.savedPosts
  });

});

export const getTaggedPosts = asyncHandler(async (req, res) => {

  const posts = await Post.find({
    taggedUsers: req.params.id
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

export const explorePeople =
  asyncHandler(async (req, res) => {

  const users = await User.find({
  _id: { $ne: req.user.id },
  isBanned: false
})
      .select(
        'username fullName avatar bio followers'
      )
      .sort('-followers')
      .limit(20);

    res.json({
      success: true,
      users
    });

});
export const getMutualFollowers =
  asyncHandler(async (req, res) => {

    const me = await User.findById(req.user.id)
      .populate(
        'following',
        'username fullName avatar followers'
      );

    const users = me.following.filter(
      user =>
        user.followers.some(
          f => String(f) === req.user.id
        )
    );

    res.json({
      success: true,
      users
    });

});
export const banUser =
  asyncHandler(async (req, res) => {

    const user = await User.findById(
      req.params.id
    );

    if (!user) {

      throw new ApiError(
        404,
        'User not found'
      );

    }
user.isBanned = true;

user.banReason =
  req.body.reason || '';

// remove all follow relationships

await User.updateMany(
  {},
  {
    $pull: {
      followers: user._id,
      following: user._id
    }
  }
);

user.followers = [];
user.following = [];

await user.save();

    res.json({
      success: true,
      message: 'User banned'
    });

});

export const unbanUser =
  asyncHandler(async (req, res) => {

    const user = await User.findById(
      req.params.id
    );

    if (!user) {

      throw new ApiError(
        404,
        'User not found'
      );

    }

    user.isBanned = false;

    user.banReason = '';

    await user.save();

    res.json({
      success: true,
      message: 'User unbanned'
    });

});