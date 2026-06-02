import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const adminOnly = async (
  req,
  res,
  next
) => {

  const user = await User.findById(
    req.user.id
  );

  if (user.role !== 'admin') {

    return next(
      new ApiError(
        403,
        'Admin access only'
      )
    );

  }

  next();

};