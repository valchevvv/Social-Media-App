import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';

export class UserService {
    static async createUser(userData: IUser): Promise<IUser> {
        const existingUser = await User.findOne({ username: userData.username }).exec();
        if (existingUser) {
            throw new Error('User with the given username already exists');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        const user = new User({
            ...userData,
            password: hashedPassword,
        });

        await user.save();
        return user;
    }

    static async loginUser(username: string, password: string): Promise<IUser | null> {
        const user = await User.findOne({ username: username }).exec();
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    static async getUserById(userId: string): Promise<IUser | null> {
        return User.findById(userId).exec();
    }
}