import mongoose, { Schema } from 'mongoose';

export interface Message extends mongoose.Document {
    conversationId: mongoose.Types.ObjectId | string;
    sender: mongoose.Types.ObjectId;
    content: string;
    image?: string;
    date: Date;
    isDeleted: boolean;
}

const MessageSchema: Schema = new Schema({
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    image: { type: String },
    date: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
});

export default mongoose.model<Message>('Message', MessageSchema);
