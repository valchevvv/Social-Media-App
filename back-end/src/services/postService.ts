import { ObjectId } from 'mongodb';
import { Post, IPost } from '../models/Post';
import { Comment } from '../models/Comment';
import { User, IUser } from '../models/User';

// Assuming IPost is defined somewhere with all necessary fields
interface IPostWithLikesCount extends Omit<IPost, 'likes'> {
    likesCount: number;
    commentsCount: number;
    // If there are other fields that you modify or add, declare them here as well
}

export class PostService {
    static async createPost(postData: IPost): Promise<IPost> {
        const post = new Post(postData);
        await post.save();
        return post;
    }

    static async likePost(postId: ObjectId, userId: ObjectId): Promise<{
        likeStatus: boolean,
        author: ObjectId
    }> {
        const post = await Post.findById(postId).select('author likes').exec();

        let update;
        let liked = false;

        if (post && post.likes.includes(userId)) {
            // If userId is already in likes, pull it to unlike
            update = { $pull: { likes: userId } };
        } else {
            // If userId is not in likes, add it to like
            update = { $addToSet: { likes: userId } };
            liked = true;
        }

        await Post.findByIdAndUpdate(postId, update, { new: true }).exec();

        return {
            likeStatus: liked,
            author: post!.author
        };
    }

    static async getPostById(postId: string): Promise<IPost | null> {
        return Post.findById(postId)
            .populate({
                path: 'author',
                select: 'username profilePicture nickname' // Including nickname and profilePicture
            })
            .populate({
                path: 'likes',
                select: 'username _id profilePicture' // Including username, id, and profilePicture
            })
            .select('content image likes createdAt') // Including createdAt, removing comments
            .exec();
    }

    static async updatePost(postId: string, updateData: Partial<IPost>): Promise<IPost | null> {
        return Post.findByIdAndUpdate(postId, updateData, { new: true }).exec();
    }

    static async deletePost(postId: string): Promise<IPost | null> {
        return Post.findByIdAndDelete(postId).exec();
    }

    static async getAllPosts(): Promise<IPostWithLikesCount[]> {
        const posts = await Post.find()
            .populate({
                path: 'author',
                select: 'username profilePicture _id' // Selecting username and profilePicture, excluding _id
            })
            .select('content image likes createdAt')
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .lean() // Lean to get plain JavaScript objects
            .exec();

        const postsWithLikesCount: IPostWithLikesCount[] = await Promise.all(
            posts.map(async (post) => {
                const commentsCount = await Comment.countDocuments({ post: post._id }).exec();
                return {
                    ...post,
                    likesCount: post.likes.length, // Counting the likes array
                    commentsCount: commentsCount // Getting the comments count
                };
            })
        );

        return postsWithLikesCount;
    }

    static async getRandomPosts(limit: number): Promise<IPostWithLikesCount[]> {
        const count = await Post.countDocuments().exec();
        if (limit > count) {
            limit = count;
        }
        const random = Math.floor(Math.random() * count);
        const posts = await Post.find()
            //.skip(random)  // If you want to implement random selection, you can use aggregation with $sample
            .limit(limit)
            .populate({
                path: 'author',
                select: 'username profilePicture _id'
            })
            .select('content image likes createdAt')
            .lean()
            .exec();

        const postsWithLikesCount: IPostWithLikesCount[] = await Promise.all(
            posts.map(async (post) => {
                const commentsCount = await Comment.countDocuments({ post: post._id }).exec();
                return {
                    ...post,
                    likesCount: post.likes.length,
                    commentsCount: commentsCount
                };
            })
        );

        return postsWithLikesCount;
    }
}
