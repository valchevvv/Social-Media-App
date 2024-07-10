import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
    author: mongoose.Types.ObjectId;
    content: string;
    image?: string;
    likes: mongoose.Types.ObjectId[];
    comments: mongoose.Types.ObjectId[];
    createdAt: Date;
    isDeleted?: boolean;
}

const PostSchema: Schema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    image: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
});

export const Post = mongoose.model<IPost>('Post', PostSchema);
