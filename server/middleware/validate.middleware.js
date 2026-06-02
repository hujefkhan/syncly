import { validationResult } from 'express-validator';
export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next({ status: 400, message: errors.array().map(e => e.msg).join(', ') });
  next();
};
