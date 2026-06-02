import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/index.js';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
initSocket(server);

connectDB().then(() => {
  server.listen(PORT, () => console.log(`🚀 Syncly API on :${PORT}`));
});
