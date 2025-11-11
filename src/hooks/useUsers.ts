import { useState, useEffect } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/lib/mockData';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('users');
    const loadedUsers = stored ? JSON.parse(stored) : mockUsers;
    setUsers(loadedUsers);
  }, []);

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  const getUserById = (id: string) => users.find(u => u.id === id);

  const followUser = (currentUserId: string, targetUserId: string) => {
    const updated = users.map(user => {
      if (user.id === currentUserId) {
        return {
          ...user,
          following: user.following.includes(targetUserId)
            ? user.following.filter(id => id !== targetUserId)
            : [...user.following, targetUserId],
        };
      }
      if (user.id === targetUserId) {
        return {
          ...user,
          followers: user.followers.includes(currentUserId)
            ? user.followers.filter(id => id !== currentUserId)
            : [...user.followers, currentUserId],
        };
      }
      return user;
    });
    saveUsers(updated);
  };

  return { users, getUserById, followUser };
};