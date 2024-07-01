// jwtHelper.ts
import jwt from 'jsonwebtoken';

const secretKey = 'daniel2k24'; // Replace with your actual secret key

export const generateToken = (user: any) => {
    return jwt.sign(user, secretKey, { expiresIn: '1h' });
};