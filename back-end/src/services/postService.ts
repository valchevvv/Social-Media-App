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
                path: 'comments',
                select: 'content createdAt author', // Assuming you want the text, creation date, and author of each comment
                options: { sort: { 'createdAt': -1 } }, // Sorting comments by createdAt in descending order
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

    static async getRandomPosts(limit: number): Promise<IPostWithLikesCount[]> {
        const count = await Post.countDocuments().exec();
        if (limit > count) {
            limit = count;
        }
        const random = Math.floor(Math.random() * count);
        const posts = await Post.find()
            /*.skip(random)*/
            .limit(limit)
            .populate({
                path: 'author',
                select: 'username profilePicture _id'
            })
            .populate({
                path: 'comments',
                select: 'content createdAt author',
                options: { sort: { 'createdAt': -1 } },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            })
            .select('content image likes comments createdAt')
            .lean()
            .exec();

        const postsWithLikesCount: IPostWithLikesCount[] = posts.map(post => ({
            ...post,
            likesCount: post.likes.length,
            commentsCount: post.comments.length
        }));

        return postsWithLikesCount;
    }
}
