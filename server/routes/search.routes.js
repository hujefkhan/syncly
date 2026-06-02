import { Router } from 'express';
import * as c from '../controllers/search.controller.js';
const r = Router();
r.get('/', c.searchAll);
r.get('/users', c.searchUsers);
r.get('/trending', c.trending);
export default r;
