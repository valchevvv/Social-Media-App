import { ObjectId } from 'mongodb';
import { Post } from '../models';
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: "djrpo8a5y",
    api_key: "226867473259655",
    api_secret: "XsdlYaMnKDS5A5pAyShdDPW9Sw4",
});

const hasContent = (str: string | null | undefined): boolean => {
    return str != null && str.trim().length > 0;
}

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

    static async updateUser(userId: ObjectId, updatedData: Partial<IUser>): Promise<IUser> {
        const user = await User.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }

        if (hasContent(updatedData.password)) {
            const saltRounds = 10;
            const hashed = await bcrypt.hash(updatedData.password!.toString(), saltRounds);
            user.set("password", hashed);
        }
        if (hasContent(updatedData.profilePicture)) {
            const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${updatedData.profilePicture}`);
            user.set("profilePicture", uploadResponse.secure_url);
        }
        if(hasContent(updatedData.name)) user.set("name", updatedData.name);
        if(hasContent(updatedData.username)) user.set("username", updatedData.username);
        if(hasContent(updatedData.email)) user.set("email", updatedData.email);
        if(hasContent(updatedData.bio)) user.set("bio", updatedData.bio);
        
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

    static async getUserByUsername(username: string) {
        const user = await User.findOne({ username: username }).exec();

        if (!user) {
            return null;
        }

        const posts = await Post.find({ author: user.id }).exec();

        const userWithPosts = {
            ...user.toObject(),
            posts: posts,
        };

        return userWithPosts;
    }
}