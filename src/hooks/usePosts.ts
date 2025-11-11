import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { mockPosts } from '@/lib/mockData';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage or use mock data
    const stored = localStorage.getItem('posts');
    const loadedPosts = stored ? JSON.parse(stored) : mockPosts;
    setPosts(loadedPosts);
    setLoading(false);
  }, []);

  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
  };

  const createPost = (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    savePosts([newPost, ...posts]);
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    const updated = posts.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    savePosts(updated);
  };

  const deletePost = (id: string) => {
    savePosts(posts.filter(p => p.id !== id));
  };

  const likePost = (postId: string, userId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const likes = post.likes.includes(userId)
      ? post.likes.filter(id => id !== userId)
      : [...post.likes, userId];

    updatePost(postId, { likes });
  };

  const addComment = (postId: string, userId: string, content: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newComment = {
      id: Date.now().toString(),
      userId,
      content,
      createdAt: new Date().toISOString(),
    };

    updatePost(postId, { comments: [...post.comments, newComment] });
  };

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
  };
};