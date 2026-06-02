import { body } from 'express-validator';
export const registerRules = [
  body('username').trim().isLength({ min: 3, max: 20 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Invalid username'),
  body('email').trim().isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('fullName').optional().isLength({ max: 50 }),
];
export const loginRules = [
  body('identifier').notEmpty().withMessage('Email or username required'),
  body('password').notEmpty(),
];
