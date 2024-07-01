import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './db';
import loadRoutes from './routeLoader';
import cors from 'cors';

const app = express();

connectDB();

app.use(express.json());

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

loadRoutes(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});