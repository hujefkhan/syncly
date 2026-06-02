import { verifyAccess } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';

export const protect = (req, _res, next) => {
  try {
    const bearer = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.slice(7);
    const token = bearer || req.cookies?.accessToken;
    if (!token) throw new ApiError(401, 'Not authenticated');
    req.user = verifyAccess(token);
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};
