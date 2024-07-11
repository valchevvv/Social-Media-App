import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    conversation: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content: string;
    image?: string;
    date: Date;
    isDeleted: boolean;
}

const MessageSchema: Schema = new Schema({
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    image: { type: String },
    date: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
