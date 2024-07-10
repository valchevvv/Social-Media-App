import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    isDeleted?: boolean;
}

export interface ICommentDetailed extends Document {
    author: {
        _id: string;
        username: string;
        profilePicture: string;
    };
}

const CommentSchema: Schema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
});

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
