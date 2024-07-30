// userService.ts

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

interface IUserSimpleInfo {
    _id: ObjectId;
    profilePicture?: string;
    name: string;
    username: string;
}

export class UserService {

    static async createUser(userData: IUser): Promise<IUser> {
        try {
            // console.log('Attempting to create user:', userData);

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
            // console.log('User created successfully:', user);

            return user;
        } catch (error) {
            console.error('Error creating user:', { error, userData });
            throw error;
        }
    }

    static async updateUser(userId: ObjectId, updatedData: Partial<IUser>): Promise<IUser> {
        try {
            // console.log('Attempting to update user:', { userId, updatedData });

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
            if (hasContent(updatedData.name)) user.set("name", updatedData.name);
            if (hasContent(updatedData.username)) user.set("username", updatedData.username);
            if (hasContent(updatedData.email)) user.set("email", updatedData.email);
            if (hasContent(updatedData.bio)) user.set("bio", updatedData.bio);

            await user.save();
            // console.log('User updated successfully:', user);

            return user;
        } catch (error) {
            console.error('Error updating user:', { error, userId, updatedData });
            throw error;
        }
    }

    static async getContacts(userId: ObjectId): Promise<IUserSimpleInfo[]> {
        try {
            const user = await User.findById(userId).exec();
    
            if (!user) {
                throw new Error('User not found');
            }
    
            const following = user.following;
            const followers = user.followers;
    
            // Find mutual followers
            const mutualContacts = following.filter((value) => followers.includes(value));
    
            // Fetch details of mutual contacts
            const contactsUsers = await User.find({ _id: { $in: mutualContacts } }).exec();
    
            // Map to IUserSimpleInfo
            const contactsInfo: IUserSimpleInfo[] = contactsUsers.map(user => ({
                _id: user._id as ObjectId,
                profilePicture: user.profilePicture,
                username: user.username,
                name: user.name,
            }));
    
            return contactsInfo;
        } catch (error) {
            console.error('Error fetching contacts:', { error, userId });
            throw error;
        }
    }

    static async loginUser(username: string, password: string): Promise<IUser | null> {
        try {
            // console.log('Attempting to log in user:', { username });

            const user = await User.findOne({ username: username }).exec();
            if (user && await bcrypt.compare(password, user.password)) {
                // console.log('User logged in successfully:', user);
                return user;
            }
            // console.log('Invalid username or password for user:', { username });
            return null;
        } catch (error) {
            console.error('Error logging in user:', { error, username });
            throw error;
        }
    }

    static async unfollowUser(userId: ObjectId, followId: ObjectId, type: string): Promise<void> {
        try {
            // Fetch both users from the database
            const user = await User.findById(userId).exec();
            const follow = await User.findById(followId).exec();

            // Check if both users exist
            if (!user || !follow) {
                throw new Error('User not found');
            }

            // Create update operations based on current follow status
            if(type === 'unfollow') {
                // Remove followId from user’s following list
                user.following = user.following.filter(followingId => followingId.toString() !== followId.toString());
                // Remove userId from follow’s followers list
                follow.followers = follow.followers.filter(followerId => followerId.toString() !== userId.toString());
            } else if (type === 'remove') {
                // Remove userId from follow’s followers list
                follow.following = follow.following.filter(followingId => followingId.toString() !== userId.toString());
                // Remove followId from user’s following list
                user.followers = user.followers.filter(followerId => followerId.toString() !== followId.toString());
            }

            // Apply updates to both users
            await user.save();
            await follow.save();
        } catch (error) {
            console.error('Error unfollowing user:', { error, userId, followId });
            throw error;
        }
    }

    static async getPeopleYouKnow(userId: ObjectId): Promise<IUserSimpleInfo[]> {
        try {
            const user = await User.findById(userId).exec();
            if (!user) {
                throw new Error('User not found');
            }

            // Users not followed by the given user and exclude the user themselves
            const notFollowedUsers = await User.find({ _id: { $nin: user.following.concat(userId) } }).exec();

            // Users that follow the given user and exclude the user themselves
            const followers = await User.find({ following: userId, _id: { $nin: user.following.concat(userId) } }).exec();

            // Users that follow users followed by the given user and exclude the user themselves
            const following = await User.find({ following: { $in: user.following }, _id: { $nin: user.following.concat(userId) } }).exec();

            // Users that are followed by the user's followers and exclude the user themselves
            const followersFollowings = await User.find({ followers: { $in: user.followers }, _id: { $nin: user.following.concat(userId) } }).exec();

            // Combine all the results and remove duplicates
            const peopleYouMayKnowSet = new Set([...notFollowedUsers, ...followers, ...following, ...followersFollowings]);

            // Convert Set to array and extract required fields
            const peopleYouMayKnow: IUserSimpleInfo[] = Array.from(peopleYouMayKnowSet)
                .map(user => ({
                    _id: user._id as ObjectId,
                    profilePicture: user.profilePicture,
                    name: user.name,
                    username: user.username
                }))
                .slice(0, 5);

            return peopleYouMayKnow;
        } catch (error) {
            console.error('Error getting people you may know:', { error, userId });
            throw error;
        }
    }


    static async getFollowers(userId: ObjectId): Promise<IUserSimpleInfo[]> {
        try {
            const user = await User.findById(userId)
                .populate({
                    path: 'followers',
                    select: 'username _id profilePicture name'
                })
                .exec();
    
            if (!user) {
                throw new Error('User not found');
            }
    
            const followers: IUserSimpleInfo[] = user.followers.map((follower: any) => ({
                _id: follower._id,
                username: follower.username,
                profilePicture: follower.profilePicture,
                name: follower.name
            }));
    
            return followers;
        } catch (error) {
            console.error('Error fetching followers:', { error, userId });
            throw error;
        }
    }

    static async getFollowing(userId: ObjectId): Promise<IUserSimpleInfo[]> {
        try {
            const user = await User.findById(userId)
                .populate({
                    path: 'following',
                    select: 'username _id profilePicture name'
                })
                .exec();
    
            if (!user) {
                throw new Error('User not found');
            }
    
            const following: IUserSimpleInfo[] = user.following.map((followedUser: any) => ({
                _id: followedUser._id,
                username: followedUser.username,
                profilePicture: followedUser.profilePicture,
                name: followedUser.name
            }));
    
            return following;
        } catch (error) {
            console.error('Error fetching following users:', { error, userId });
            throw error;
        }
    }


    static async followUser(userId: ObjectId, followId: ObjectId): Promise<{
        follow: boolean,
        followed: boolean,
        sender: {
            id: string,
            username: string,
        },
        receiver: {
            id: string,
            username: string,
        }
    }> {
        try {
            // Fetch both users from the database
            const user = await User.findById(userId).exec();
            const follow = await User.findById(followId).exec();

            // Check if both users exist
            if (!user || !follow) {
                throw new Error('User not found');
            }

            // Determine if the user is currently following the other user
            const isFollowing = user.following.includes(followId);

            // Create update operations based on current follow status
            const userUpdate = isFollowing
                ? { $pull: { following: followId } } // Remove followId from user’s following list
                : { $addToSet: { following: followId } }; // Add followId to user’s following list
            const followUpdate = isFollowing
                ? { $pull: { followers: userId } } // Remove userId from follow’s followers list
                : { $addToSet: { followers: userId } }; // Add userId to follow’s followers list

            // Apply updates to both users
            await User.findByIdAndUpdate(userId, userUpdate, { new: true }).exec();
            await User.findByIdAndUpdate(followId, followUpdate, { new: true }).exec();

            // Determine the new follow and followed status
            const newFollowStatus = !isFollowing; // If was not following, now following
            const newFollowedStatus = follow.following.includes(userId); // Check if follow now follows back

            return {
                follow: newFollowStatus, // True if user is now following the other user
                followed: newFollowedStatus, // True if the follow user is now following the user
                sender: {
                    id: userId.toString(),
                    username: user.username
                },
                receiver: {
                    id: followId.toString(),
                    username: follow.username
                }
            };
        } catch (error) {
            console.error('Error following/unfollowing user:', { error, userId, followId });
            throw error;
        }
    }

    static async getSimpleUserById(userId: string): Promise<string | null> {
        try {
            const user = await User.findById(userId).exec();

            if (!user) return null;

            return user.username;
        } catch (error) {
            throw error;
        }
    }

    static async getUserByUsername(username: string) {
        try {
            // console.log('Attempting to get user by username:', { username });

            const user = await User.findOne({ username: username }).exec();

            if (!user) {
                // console.log('User not found for username:', { username });
                return null;
            }

            const posts = await Post.find({ author: user.id }).exec();

            const userWithPosts = {
                ...user.toObject(),
                posts: posts,
            };

            // console.log('User with posts retrieved successfully:', { username, userWithPosts });

            return userWithPosts;
        } catch (error) {
            console.error('Error getting user by username:', { error, username });
            throw error;
        }
    }
}
