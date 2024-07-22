import { ObjectId } from 'mongodb';
import { Comment, IComment, ICommentDetailed } from '../models/Comment';
import { IPost, Post } from '../models';

export class CommentService {
    static async createComment(userId: ObjectId, postId: ObjectId, content: string): Promise<{
        postAuthor: ObjectId;
        comment: IComment;
    }> {
        const comment = new Comment({
            author: userId,
            post: postId,
            content,
        });
        const post = await Post.findById(postId).exec();
        if (!post) {
            throw new Error('Post not found');
        }
        post.comments.push(new ObjectId((comment._id as string).toString()));
        await post.save();
        await comment.save();
        return {
            postAuthor: post.author,
            comment
        };
    }

    static async fetchPostWithComments(postId: string): Promise<IPost | null> {
        try {
            const postWithComments = await Post.findById(postId)
                .populate('comments') // This populates the comments array with Comment documents
                .exec();

            return postWithComments;
        } catch (error) {
            console.error('Error fetching post with comments:', error);
            throw error; // Rethrow or handle error as needed
        }
    }

    static async getCommentById(commentId: string): Promise<IComment | null> {
        return Comment.findById(commentId).exec();
    }

    static async updateComment(commentId: string, updateData: Partial<IComment>): Promise<IComment | null> {
        return Comment.findByIdAndUpdate(commentId, updateData, { new: true }).exec();
    }

    static async deleteComment(commentId: string): Promise<IComment | null> {
        return Comment.findByIdAndDelete(commentId).exec();
    }

    static async getCommentsByPostId(postId: string): Promise<ICommentDetailed[]> {
        const comments = await Comment.find({ post: postId })
            .populate('author', '_id username profilePicture') // Populate the author field
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order (latest first
            .exec();
        return comments as unknown as ICommentDetailed[];
    }
}
