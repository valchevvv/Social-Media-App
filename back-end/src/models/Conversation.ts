import mongoose, { Schema } from 'mongoose';

export interface Conversation extends mongoose.Document {
    createdAt: Date;
    participants: mongoose.Types.ObjectId[];
}

const ConversationSchema: Schema = new Schema({
    createdAt: { type: Date, default: Date.now },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }]
});

export default mongoose.model<Conversation>('Conversation', ConversationSchema);
