import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { generateToken } from '../jwtHelper'; // Import generateToken

export class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            if(!req.body.username || !req.body.email || !req.body.password) throw new Error('Missing required fields');

            const user = await UserService.createUser(req.body);
            const { password, ...userWithoutPassword } = user.toObject();

            const token = generateToken(userWithoutPassword); // Use generateToken here

            res.status(201).json({ token: token });
        } catch (error) {
            console.log("Here")
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async loginUser(req: Request, res: Response) {
        try {
            const { username, password } = req.query;
            if(!username || !password) throw new Error('Missing required fields');
            
            const user = await UserService.loginUser(username.toString(), password.toString());

            if (!user) throw new Error('Invalid username or password');

            const { password: _, ...userWithoutPassword } = user.toObject();
            const token = generateToken(userWithoutPassword); // Use generateToken here as well, if needed

            res.status(201).json({ token: token });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async getUser(req: Request, res: Response) {
        try {
            const user = await UserService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }
}