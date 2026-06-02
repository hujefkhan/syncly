import { asyncHandler } from '../utils/asyncHandler.js';
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
  res.json({ success: true, url: req.file.path, publicId: req.file.filename });
});
