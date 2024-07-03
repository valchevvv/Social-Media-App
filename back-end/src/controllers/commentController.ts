import { Request, Response } from 'express';
import { CommentService } from '../services/commentService';
import { ObjectId } from 'mongodb';

export class CommentController {
    static async createComment(req: Request, res: Response) {
        try {
            const { postId, content } = req.body;
            if(!content || !postId) return res.status(400).json({ error: 'Missing required fields' });
            const comment = await CommentService.createComment(new ObjectId(req.user?._id), postId, content);
            res.status(201).json(comment);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async getComment(req: Request, res: Response) {
        try {
            const comment = await CommentService.getCommentById(req.params.id);
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            res.status(200).json(comment);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async updateComment(req: Request, res: Response) {
        try {
            const comment = await CommentService.updateComment(req.params.id, req.body);
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            res.status(200).json(comment);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async deleteComment(req: Request, res: Response) {
        try {
            const comment = await CommentService.deleteComment(req.params.id);
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async getCommentsByPost(req: Request, res: Response) {
        try {
            const comments = await CommentService.getCommentsByPostId(req.params.postId);
            res.status(200).json(comments);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }
}
