import { Comment } from '../models';
import { Post, IPost } from '../models/Post';
import { ObjectId } from 'mongodb';
import { CommentService } from '../services/commentService'

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

    static async likePost(postId: string, userId: ObjectId, liked: boolean): Promise<IPost | null> {
        if (!liked) {
            return Post.findByIdAndUpdate(postId, {
                $pull: { likes: userId }
            }, { new: true }).exec();
        }
        return Post.findByIdAndUpdate(postId, {
            $addToSet: { likes: userId }
        }, { new: true }).exec();
    }

    static async getPostById(postId: string): Promise<IPost | null> {
        return Post.findById(postId)
                .populate({
                    path: 'author',
                    select: 'username profilePicture nickname' // Including nickname and profilePicture
                })
                .populate({
                    path: 'comments',
                    select: 'content createdAt author', // Assuming you want the text, creation date, and author of each comment
                    populate: {
                        path: 'author',
                        select: 'username profilePicture' // Assuming you also want to include the author's username and profilePicture for each comment
                    }
                })
                .populate({ // Adding this populate for likes
                    path: 'likes',
                    select: 'username profilePicture' // Assuming likes is an array of ObjectId references to user documents
                })
                .select('content image likes comments createdAt') // Including createdAt
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
            .select('content image likes comments')
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .lean() // Lean to get plain JavaScript objects
            .exec();

        // Transforming posts to include likesCount and exclude likes
        const postsWithLikesCount: IPostWithLikesCount[] = posts.map(post => ({
            ...post,
            likesCount: post.likes.length, // Counting the likes array
            commentsCount: post.comments.length
            // Do not include likes in the output
        }));
        
        return postsWithLikesCount;
    }
}
