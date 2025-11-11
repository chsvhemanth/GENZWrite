import { User } from '@/types';

export function normalizeUser(u: any): User {
  return {
    id: u.id || u._id || '',
    name: u.name || '',
    email: u.email || '',
    bio: u.bio || '',
    profilePicture: u.profilePicture || u.avatarUrl || '',
    followers: u.followers || [],
    following: u.following || [],
    createdAt: u.createdAt || new Date().toISOString(),
  };
}


