import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  type: 'like' | 'comment' | 'follow';
  referenceId: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, index: true },
  type: { type: String, enum: ['like', 'comment', 'follow'], required: true },
  referenceId: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);


