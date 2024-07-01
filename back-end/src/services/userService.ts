import { User, IUser } from '../models/User';

export class UserService {
    static async createUser(userData: IUser): Promise<IUser> {
        const user = new User(userData);
        await user.save();
        return user;
    }

    static async getUserById(userId: string): Promise<IUser | null> {
        return User.findById(userId).exec();
    }

    // Add other user-related service methods
}
