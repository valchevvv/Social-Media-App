import mongoose, { Schema } from 'mongoose';

export interface IConversation extends mongoose.Document {
    createdAt: Date;
    participants: mongoose.Types.ObjectId[];
    lastMessage: mongoose.Types.ObjectId;
}

const ConversationSchema: Schema = new Schema({
    createdAt: { type: Date, default: Date.now },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
});

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);