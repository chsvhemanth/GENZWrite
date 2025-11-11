import { useState, useEffect } from 'react';
import { User } from '@/types';
import { apiFetch } from '@/lib/api';
import { normalizeUser } from '@/lib/mapper';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await apiFetch('/api/users');
      const mapped = (data.users || []).map((u: any) => normalizeUser(u));
      setUsers(mapped);
    } catch (error) {
      console.error('[useUsers] fetch failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getUserById = (id: string) => users.find(u => u.id === id);

  const followUser = (_currentUserId: string, targetUserId: string) => {
    return apiFetch(`/api/users/${targetUserId}/follow`, { method: 'POST' })
      .then((data) => {
        if (!data?.current || !data?.target) return;
        const current = normalizeUser(data.current);
        const target = normalizeUser(data.target);
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === current.id) return current;
            if (u.id === target.id) return target;
            return u;
          })
        );
      })
      .catch((error) => console.error('[useUsers] follow failed', error));
  };

  const refresh = () => {
    setLoading(true);
    fetchUsers();
  };

  return { users, loading, getUserById, followUser, refresh };
};