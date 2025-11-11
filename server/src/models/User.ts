import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  passwordHash?: string;
  googleId?: string;
  followers: string[];
  following: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  passwordHash: String,
  googleId: String,
  followers: { type: [String], default: [] },
  following: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema);


