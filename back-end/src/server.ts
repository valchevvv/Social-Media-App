import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import connectDB from './db';
import loadRoutes from './routeLoader';
import cors from 'cors';
import { SocketIoWorker } from './socketIoWorker';

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

loadRoutes(app);

const PORT = process.env.PORT || 5000;

const socketIoWorker = new SocketIoWorker(server);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
server.listen(5001, () => {
    console.log(`Socket.IO server is running on port ${5001}`);
});