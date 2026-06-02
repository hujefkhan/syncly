import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { emitToUser } from '../sockets/index.js';
export const myConversations = asyncHandler(async (req, res) => {

  const convs = await Conversation.find({
    participants: req.user.id
  })
    .sort('-updatedAt')
    .populate(
      'participants',
      'username avatar fullName isOnline lastActive'
    )
    .populate('lastMessage');

  const conversations = await Promise.all(

    convs.map(async (c) => {

      const unreadCount =
        await Message.countDocuments({

          conversation: c._id,

          sender: { $ne: req.user.id },

          seenBy: { $ne: req.user.id }

        });

      return {
        ...c.toObject(),
        unreadCount
      };

    })

  );

  res.json({
    success: true,
    conversations
  });

});

export const openConversation = asyncHandler(async (req, res) => {
  const other = req.params.userId;
  let conv = await Conversation.findOne({ participants: { $all: [req.user.id, other], $size: 2 } });
  if (!conv) conv = await Conversation.create({ participants: [req.user.id, other] });
  await conv.populate('participants', 'username avatar fullName isOnline');
  res.json({ success: true, conversation: conv });
});

export const createGroup = asyncHandler(async (req, res) => {
  const { name, members } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Group name is required'
    });
  }

  const me = await User.findById(req.user.id);

  const allowed = [];

  for (const userId of members) {

    const isFollowing =
      me.following.some(
        f => String(f) === String(userId)
      );

    const isFollower =
      me.followers.some(
        f => String(f) === String(userId)
      );

    if (isFollowing && isFollower) {
      allowed.push(userId);
    }
  }

  const group = await Conversation.create({
    participants: [
      req.user.id,
      ...allowed
    ],
    isGroup: true,
    groupName: name,
    admins: [req.user.id]
  });

  await group.populate(
    'participants',
    'username avatar fullName isOnline'
  );

  res.status(201).json({
    success: true,
    conversation: group
  });
});
export const listMessages = asyncHandler(async (req, res) => {

  await Message.updateMany(
    {
      conversation: req.params.id,
      sender: { $ne: req.user.id },
      seenBy: { $ne: req.user.id }
    },
    {
      $push: {
        seenBy: req.user.id
      }
    }
  );
  const messages = await Message.find({
  conversation: req.params.id
})
.populate(
  'sender',
  'username fullName avatar'
)
  .populate('replyTo', 'text')

  .populate({
    path: 'sharedPost',
    populate: {
      path: 'author',
      select: 'username avatar fullName'
    }
  })

  .sort('createdAt');
  
  res.json({
    success: true,
    messages
  });

});

export const sendMessage = asyncHandler(async (req, res) => {
  const { text, image, video, replyTo, sharedPost } = req.body;

  const conv = await Conversation.findById(req.params.id);
  const users = await User.find({
  _id: { $in: conv.participants }
});

const sender = users.find(
  u => String(u._id) === req.user.id
);

const other = users.find(
  u => String(u._id) !== req.user.id
);

if (
  sender.blockedUsers.includes(other._id)
) {
  return res.status(403).json({
    success: false,
    message: 'User is blocked'
  });
}

if (
  other.blockedUsers.includes(sender._id)
) {
  return res.status(403).json({
    success: false,
    message: 'You can no longer message this user'
  });
}

  if (!conv)
    return res.status(404).json({
      success: false,
      message: 'Conversation not found'
    });
    

  const msg = await Message.create({
    conversation: conv._id,
    sender: req.user.id,
    text,
    image,
    video,
    sharedPost: sharedPost || null,
    replyTo: replyTo || null
  });
  const populatedMsg = await Message.findById(msg._id)

.populate(
  'sender',
  'username fullName avatar'
)
  .populate('replyTo', 'text')

  .populate({
    path: 'sharedPost',
    populate: {
      path: 'author',
      select: 'username avatar fullName'
    }
  });
  conv.lastMessage = msg._id;

  await conv.save();

  conv.participants
    .filter(p => String(p) !== req.user.id)
    .forEach(p =>
      emitToUser(String(p), 'message:new', populatedMsg)
    );

  res.status(201).json({
    success: true,
    message: populatedMsg
  });
});

export const getUnreadCount = asyncHandler(async (req, res) => {

  const count = await Message.countDocuments({
    sender: { $ne: req.user.id },
    seenBy: { $ne: req.user.id }
  });

  res.json({
    success: true,
    count
  });

});

export const deleteMessage = asyncHandler(async (req, res) => {

  const message = await Message.findById(
    req.params.id
  );

  if (!message) {

    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });

  }

  if (String(message.sender) !== req.user.id) {

    return res.status(403).json({
      success: false,
      message: 'Unauthorized'
    });

  }

  await message.deleteOne();

  res.json({
    success: true
  });

});

export const addGroupMember = asyncHandler(async (req, res) => {
  const group = await Conversation.findById(req.params.id);

  if (!group?.isGroup) {
    return res.status(404).json({
      success: false,
      message: 'Group not found'
    });
  }

  if (
    !group.admins.some(
      a => String(a) === req.user.id
    )
  ) {
    return res.status(403).json({
      success: false,
      message: 'Admins only'
    });
  }

  if (
    !group.participants.some(
  p => String(p) === req.params.userId
)
  ) {
   group.participants.push(req.params.userId);
    await group.save();
  }

  res.json({
    success: true,
    conversation: group
  });
});

export const removeGroupMember = asyncHandler(async (req, res) => {
  const group = await Conversation.findById(req.params.id);

  if (
    !group.admins.some(
      a => String(a) === req.user.id
    )
  ) {
    return res.status(403).json({
      success: false
    });
  }

  group.participants =
    group.participants.filter(
      p => String(p) !== req.params.userId
    );

  group.admins =
    group.admins.filter(
      a => String(a) !== req.params.userId
    );

  await group.save();

  res.json({
    success: true
  });
});

export const promoteAdmin = asyncHandler(async (req, res) => {
  const group = await Conversation.findById(req.params.id);

  if (
    !group.admins.some(
      a => String(a) === req.user.id
    )
  ) {
    return res.status(403).json({
      success: false
    });
  }

  if (
    !group.admins.includes(req.params.userId)
  ) {
    group.admins.push(req.params.userId);
    await group.save();
  }

  res.json({
    success: true
  });
});

export const leaveGroup = asyncHandler(async (req, res) => {
  const group = await Conversation.findById(req.params.id);

  group.participants =
    group.participants.filter(
      p => String(p) !== req.user.id
    );

  group.admins =
    group.admins.filter(
      a => String(a) !== req.user.id
    );

  if (
    group.admins.length === 0 &&
    group.participants.length > 0
  ) {
    group.admins.push(
      group.participants[0]
    );
  }

  await group.save();

  res.json({
    success: true
  });
});

export const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Conversation.findById(req.params.id);

  if (
    !group.admins.some(
      a => String(a) === req.user.id
    )
  ) {
    return res.status(403).json({
      success: false
    });
  }

  await Message.deleteMany({
    conversation: group._id
  });

  await group.deleteOne();

  res.json({
    success: true
  });
});

export const renameGroup = asyncHandler(
  async (req, res) => {

    const { name } = req.body;

    const group =
      await Conversation.findById(
        req.params.id
      );

    if (!group?.isGroup) {

      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });

    }

    if (
      !group.admins.some(
        a => String(a) === req.user.id
      )
    ) {

      return res.status(403).json({
        success: false,
        message: 'Admins only'
      });

    }

    group.groupName = name;

    await group.save();

    res.json({
      success: true,
      conversation: group
    });

  }
);


export const changeGroupAvatar =
  asyncHandler(async (req, res) => {

    const { avatar } = req.body;

    const group =
      await Conversation.findById(
        req.params.id
      );

    if (!group?.isGroup) {

      return res.status(404).json({
        success: false
      });

    }

    if (
      !group.admins.some(
        a => String(a) === req.user.id
      )
    ) {

      return res.status(403).json({
        success: false
      });

    }

    group.groupAvatar = avatar;

    await group.save();

    res.json({
      success: true,
      conversation: group
    });

  });

  export const demoteAdmin = asyncHandler(
  async (req, res) => {

    const group =
      await Conversation.findById(
        req.params.id
      );

    if (!group?.isGroup)
      return res.status(404).json({
        success: false
      });

    const isAdmin =
      group.admins.some(
        a =>
          String(a) ===
          String(req.user.id)
      );

    if (!isAdmin)
      return res.status(403).json({
        success: false
      });

    group.admins =
      group.admins.filter(
        a =>
          String(a) !==
          String(req.params.userId)
      );

    await group.save();

    res.json({
      success: true,
      conversation: group
    });

  }
);