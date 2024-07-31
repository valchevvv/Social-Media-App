// jwtHelper.ts
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || ''; // Replace 'defaultSecret' with your actual default secret key

export const generateToken = (user: any) => {
    return jwt.sign(user, secretKey, { expiresIn: '1h' });
};