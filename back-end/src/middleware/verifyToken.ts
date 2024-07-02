import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserType } from '../types/custom';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(token, "daniel2k24");
        req.user = decoded as UserType;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }

    return next();
};

export default verifyToken;