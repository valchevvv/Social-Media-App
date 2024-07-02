// src/types/custom.d.ts
import { Request } from 'express';
import { ObjectId } from 'mongodb';

type UserType = {
    _id: ObjectId;
    username: string;
    email: string;
    followers: any[]; // Consider specifying a more detailed type instead of any if possible
    following: any[]; // Consider specifying a more detailed type instead of any if possible
    createdAt: Date;
    __v: number;
};

declare global {
    namespace Express {
        interface Request {
            user?: UserType; // Now the Request object can have a user property of UserType
        }
    }
}