export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
  followers: string[];
  following: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow';
  referenceId: string;
  isRead: boolean;
  createdAt: string;
}