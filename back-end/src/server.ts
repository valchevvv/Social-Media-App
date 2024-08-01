// server.ts

import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import connectDB from './db';
import loadRoutes from './routeLoader';
import cors from 'cors';
import { Server } from 'socket.io'; // Import Socket.IO Server
import { SocketIoWorker } from './socketIoWorker'; // Adjust path as per your project structure

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust according to your needs
        methods: ['GET', 'POST'],
    },
});

const socketIoWorker = SocketIoWorker.getInstance(io);
socketIoWorker.setupConnection(server, io); // Pass server and io instance to setup connection

connectDB();

const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

loadRoutes(app);

const PORT = process.env.PORT || 5000;
const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.listen(SOCKET_IO_PORT, () => {
    console.log(`Socket.IO server is running on port ${SOCKET_IO_PORT}`);
});

export { io }; // Export io instance from server.ts
