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

const socketIoWorker = SocketIoWorker.getInstance();
socketIoWorker.setupConnection(server, io); // Pass server and io instance to setup connection

connectDB();

app.use(cors());

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

loadRoutes(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.listen(5001, () => {
    console.log(`Socket.IO server is running on port ${5001}`);
});

export { io }; // Export io instance from server.ts
