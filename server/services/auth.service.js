import crypto from 'crypto';
import User from '../models/User.js';
import { signAccess, signRefresh } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';

export const registerUser = async ({ username, email, password, fullName }) => {
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) throw new ApiError(409, 'Username or email already taken');
  const user = await User.create({ username, email, password, fullName });
  return tokensFor(user);
};

export const loginUser = async ({ identifier, password }) => {
  const user = await User.findOne({ $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }] }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid credentials');
  // if (user.isVerified === false) {
//   throw new ApiError(
//     403,
//     'Please verify your email before logging in'
//   );
// }
  if (user.isBanned) {
  throw new ApiError(
    403,
    'Your account has been banned'
  );
}
  user.isOnline = true; user.lastActive = new Date(); await user.save();
  return tokensFor(user);
};
export const googleLogin = async ({
  email,
  fullName,
  avatar
}) => {

  let user = await User.findOne({ email });

  if (!user) {

    const baseUsername = email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    const username =
      `${baseUsername}${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    const randomPassword =
      crypto.randomBytes(32).toString('hex');

    user = await User.create({
      username,
      email,
      password: randomPassword,
      fullName,
      avatar,
      isVerified: true
    });

  }

  if (user.isBanned) {
    throw new ApiError(
      403,
      'Your account has been banned'
    );
  }

  user.isOnline = true;
  user.lastActive = new Date();

  await user.save();

  return tokensFor(user);

};
const tokensFor = (user) => {
 const payload = {
  id: user._id,
  username: user.username,
  role: user.role
};
  return {
    accessToken: signAccess(payload),
    refreshToken: signRefresh(payload),
   user: {
  _id: user._id,
  username: user.username,
  email: user.email,
  fullName: user.fullName,
  avatar: user.avatar,
  bio: user.bio,
  role: user.role,
  isBanned: user.isBanned
},
  };
};
