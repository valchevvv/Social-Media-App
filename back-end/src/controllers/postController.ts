import { Request, Response } from 'express';
import { PostService } from '../services/postService';
import { Post, IPost } from '../models/Post';
import { ObjectId } from 'mongodb';

export class PostController {
    static async createPost(req: Request, res: Response) {
        try {
            if (!req.body.content) throw new Error('Content is required');
            const post = await PostService.createPost(new Post({
                author: req.user?._id,
                content: req.body.content,
                image: req.body.image || undefined,
            }));
            res.status(201).json(post);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async likePost(req: Request, res: Response) {
        try {
            const post = await PostService.likePost(req.body.postId, new ObjectId(req.user?._id), req.body.liked);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.status(200).json(post);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async getPost(req: Request, res: Response) {
        try {
            const post = await PostService.getPostById(req.params.id);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.status(200).json(post);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async updatePost(req: Request, res: Response) {
        try {
            const post = await PostService.updatePost(req.params.id, req.body);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.status(200).json(post);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async deletePost(req: Request, res: Response) {
        try {
            const post = await PostService.deletePost(req.params.id);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }

    static async getAllPosts(req: Request, res: Response) {
        try {
            const posts = await PostService.getAllPosts();
            res.status(200).json(posts);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : error });
        }
    }
}
