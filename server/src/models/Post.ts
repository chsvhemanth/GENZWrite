import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  userId: string;
  content: string;
  createdAt: Date;
}

export interface IPost extends Document {
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  likes: string[];
  comments: IComment[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new Schema<IPost>({
  authorId: { type: String, index: true },
  title: String,
  content: String,
  tags: { type: [String], default: [] },
  likes: { type: [String], default: [] },
  comments: { type: [CommentSchema], default: [] },
  attachments: { type: [String], default: [] },
}, { timestamps: true });

export const Post = mongoose.model<IPost>('Post', PostSchema);


