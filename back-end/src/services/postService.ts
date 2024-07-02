import { Post, IPost } from '../models/Post';
import { ObjectId } from 'mongoose';

// Assuming IPost is defined somewhere with all necessary fields
interface IPostWithLikesCount extends Omit<IPost, 'likes'> {
    likesCount: number;
    // If there are other fields that you modify or add, declare them here as well
}

export class PostService {
    static async createPost(postData: IPost): Promise<IPost> {
        const post = new Post(postData);
        await post.save();
        return post;
    }

    static async getPostById(postId: string): Promise<IPost | null> {
        return Post.findById(postId).exec();
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
            .select('content image likes')
            .lean() // Lean to get plain JavaScript objects
            .exec();

        // Transforming posts to include likesCount and exclude likes
        const postsWithLikesCount: IPostWithLikesCount[] = posts.map(post => ({
            ...post,
            likesCount: post.likes.length, // Counting the likes array
            // Do not include likes in the output
        }));

        return postsWithLikesCount;
    }
}
