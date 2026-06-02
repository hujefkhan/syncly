import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cookieOpts } from '../utils/cookies.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyRefresh, signAccess, signRefresh } from '../utils/jwt.js';
import * as authSvc from '../services/auth.service.js';
import {
  sendResetEmail,
  sendVerificationEmail
} from '../services/email.service.js';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);
export const register = asyncHandler(async (req, res) => {

  const out = await authSvc.registerUser(req.body);

  const raw = crypto
    .randomBytes(32)
    .toString('hex');

  const user = await User.findById(
    out.user._id
  );

  user.verificationToken = crypto
    .createHash('sha256')
    .update(raw)
    .digest('hex');

  user.verificationTokenExp =
    Date.now() + 24 * 60 * 60 * 1000;

  await user.save();

  await sendVerificationEmail(
    user.email,
    `${process.env.CLIENT_URL}/verify-email?token=${raw}`
  );

  res.status(201).json({
    success: true,
    message:
      'Account created. Please verify your email.'
  });

});

export const login = asyncHandler(async (req, res) => {

  const user = await User.findOne({
    email: req.body.email
  });

  if (user?.isBanned) {

    throw new ApiError(
      403,
      'Your account has been permanently suspended'
    );

  }

  const out = await authSvc.loginUser(
    req.body
  );
  res.cookie('refreshToken', out.refreshToken, cookieOpts);
  res.json({ success: true, ...out });
});

export const googleAuth = asyncHandler(async (req, res) => {

  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(
      400,
      'Google credential missing'
    );
  }

  const ticket =
    await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

  const payload = ticket.getPayload();

  const out = await authSvc.googleLogin({
    email: payload.email,
    fullName: payload.name,
    avatar: payload.picture
  });

  res.cookie(
    'refreshToken',
    out.refreshToken,
    cookieOpts
  );

  res.json({
    success: true,
    ...out
  });

});

export const logout = asyncHandler(async (req, res) => {
  if (req.user?.id) await User.findByIdAndUpdate(req.user.id, { isOnline: false, lastActive: new Date() });
  res.clearCookie('refreshToken', cookieOpts);
  res.json({ success: true });
});
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(401, 'No refresh token');
  }

  const decoded = verifyRefresh(token);

  const user = await User.findById(decoded.id);

  if (!user || user.isBanned) {
    throw new ApiError(401, 'Unauthorized');
  }

  const accessToken = signAccess({
    id: user._id,
    username: user.username,
    role: user.role
  });

  res.json({
    success: true,
    accessToken
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: true }); // don't leak
  const raw = crypto.randomBytes(32).toString('hex');
  user.resetToken = crypto.createHash('sha256').update(raw).digest('hex');
  user.resetTokenExp = Date.now() + 60*60*1000;
  await user.save();
  await sendResetEmail(email, `${process.env.CLIENT_URL}/reset-password?token=${raw}`);
  res.json({ success: true });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetToken: hashed, resetTokenExp: { $gt: Date.now() } });
  if (!user) throw new ApiError(400, 'Invalid or expired token');
  user.password = password; user.resetToken = undefined; user.resetTokenExp = undefined;
  await user.save();
  res.json({ success: true });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

 const hashed = crypto
  .createHash('sha256')
  .update(token)
  .digest('hex');

console.log('RAW TOKEN:', token);
console.log('HASHED TOKEN:', hashed);

const user = await User.findOne({
  verificationToken: hashed,
  verificationTokenExp: { $gt: Date.now() }
});

console.log('FOUND USER:', user);

  if (!user) {
    throw new ApiError(
      400,
      'Invalid or expired verification link'
    );
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExp = undefined;

  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ success: true });
  }

  if (user.isVerified) {
    throw new ApiError(
      400,
      'Email already verified'
    );
  }

  const raw = crypto
    .randomBytes(32)
    .toString('hex');

  user.verificationToken = crypto
    .createHash('sha256')
    .update(raw)
    .digest('hex');

  user.verificationTokenExp =
    Date.now() + 24 * 60 * 60 * 1000;

  await user.save();

  await sendVerificationEmail(
    user.email,
    `${process.env.CLIENT_URL}/verify-email?token=${raw}`
  );

  res.json({
    success: true,
    message: 'Verification email sent'
  });
});