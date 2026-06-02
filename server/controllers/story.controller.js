import Story from '../models/Story.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const createStory = asyncHandler(async (req, res) => {

  if (!req.file) {
    throw new ApiError(400, 'Story image required');
  }

  const story = await Story.create({

    author: req.user.id,

    media: {
      url: req.file.path,
      publicId: req.file.filename
    }

  });

  await story.populate(
    'author',
    'username avatar fullName'
  );

  res.status(201).json({
    success: true,
    story
  });

});

export const getStories = asyncHandler(async (req, res) => {

  const me = await User.findById(req.user.id);

  const users = [
    ...me.following,
    me._id
  ];

  const stories = await Story.find({
    author: { $in: users }
  })
    .sort('-createdAt')
    .populate(
      'author',
      'username avatar fullName'
    );

  res.json({
    success: true,
    stories
  });

});

export const viewStory = asyncHandler(async (req, res) => {

  const story = await Story.findById(req.params.id);

  if (!story) {
    throw new ApiError(404, 'Story not found');
  }

  const alreadyViewed = story.viewers.some(
    v => String(v) === req.user.id
  );

  if (!alreadyViewed) {

    story.viewers.push(req.user.id);

    await story.save();

  }

  res.json({
    success: true
  });

});
export const deleteStory = asyncHandler(async (req, res) => {

  const story = await Story.findById(
    req.params.id
  );

  if (!story) {

    throw new ApiError(
      404,
      'Story not found'
    );

  }

  if (
    String(story.author) !== req.user.id
  ) {

    throw new ApiError(
      403,
      'Unauthorized'
    );

  }

  await story.deleteOne();

  res.json({
    success: true
  });

});