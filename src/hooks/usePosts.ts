import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { apiFetch } from '@/lib/api';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch('/api/posts');
        const mapped = (data.posts || []).map((p: any) => ({
          id: p.id || p._id,
          authorId: p.authorId,
          title: p.title,
          content: p.content,
          tags: p.tags || [],
          likes: p.likes || [],
          comments: (p.comments || []).map((c: any) => ({
            id: c.id || c._id,
            userId: c.userId,
            content: c.content,
            createdAt: c.createdAt,
          })),
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })) as Post[];
        setPosts(mapped);
      } catch (e) {
        console.error('[usePosts] fetch failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const createPost = (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    return apiFetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        tags: post.tags,
        attachments: [],
      }),
    }).then((data) => {
      const p = data.post;
      const mapped: Post = {
        id: p.id || p._id,
        authorId: p.authorId,
        title: p.title,
        content: p.content,
        tags: p.tags || [],
        likes: p.likes || [],
        comments: [],
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
      setPosts((cur) => [mapped, ...cur]);
      return mapped;
    });
  };

  const updatePost = (_id: string, _updates: Partial<Post>) => {};

  const deletePost = (_id: string) => {};

  const likePost = (postId: string, userId: string) => {
    setPosts((cur) =>
      cur.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: p.likes.includes(userId)
                ? p.likes.filter((i) => i !== userId)
                : [...p.likes, userId],
            }
          : p
      )
    );
  };

  const addComment = (postId: string, userId: string, content: string) => {
    const newComment = { id: Date.now().toString(), userId, content, createdAt: new Date().toISOString() };
    setPosts((cur) =>
      cur.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
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