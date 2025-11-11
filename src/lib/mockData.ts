import { User, Post } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Emily Dickinson',
    email: 'emily@writerhub.com',
    bio: 'Poet & writer exploring life, death, and immortality through verse.',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    followers: ['2', '3'],
    following: ['2'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Pablo Neruda',
    email: 'pablo@writerhub.com',
    bio: 'Love, politics, and everything in between. Nobel Prize winner.',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pablo',
    followers: ['1', '3'],
    following: ['1', '3'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Maya Angelou',
    email: 'maya@writerhub.com',
    bio: 'Civil rights activist, poet, and author. Still I rise.',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    followers: ['1', '2'],
    following: ['1', '2'],
    createdAt: new Date().toISOString(),
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    authorId: '1',
    title: 'Hope is the thing with feathers',
    content: `"Hope" is the thing with feathers -
That perches in the soul -
And sings the tune without the words -
And never stops - at all -

And sweetest - in the Gale - is heard -
And sore must be the storm -
That could abash the little Bird
That kept so many warm -`,
    tags: ['poetry', 'hope', 'nature'],
    likes: ['2', '3'],
    comments: [
      {
        id: 'c1',
        userId: '2',
        content: 'Beautiful metaphor! This resonates deeply.',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    authorId: '2',
    title: 'Tonight I Can Write',
    content: `Tonight I can write the saddest lines.
Write, for example, 'The night is starry
and the stars are blue and shiver in the distance.'

The night wind revolves in the sky and sings.
Tonight I can write the saddest lines.
I loved her, and sometimes she loved me too.`,
    tags: ['poetry', 'love', 'melancholy'],
    likes: ['1', '3'],
    comments: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    authorId: '3',
    title: 'Still I Rise',
    content: `You may write me down in history
With your bitter, twisted lies,
You may trod me in the very dirt
But still, like dust, I'll rise.

Does my sassiness upset you?
Why are you beset with gloom?
'Cause I walk like I've got oil wells
Pumping in my living room.`,
    tags: ['poetry', 'empowerment', 'resilience'],
    likes: ['1', '2'],
    comments: [
      {
        id: 'c2',
        userId: '1',
        content: 'Powerful and inspiring words!',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem('currentUser');
  return stored ? JSON.parse(stored) : mockUsers[0];
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};