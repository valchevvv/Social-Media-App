import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    name: string;
    bio?: string;
    profilePicture?: string;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    createdAt: Date;
    isAdmin: boolean; // Added isAdmin field
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    bio: { type: String },
    profilePicture: { type: String },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false }, // Added isAdmin field with default value false
});

export const User = mongoose.model<IUser>('User', UserSchema);