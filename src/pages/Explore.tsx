import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Search } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useUsers } from '@/hooks/useUsers';
import { PostCard } from '@/components/PostCard';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const Explore = () => {
  const { posts, likePost, loading: postsLoading } = usePosts();
  const { users, loading: usersLoading } = useUsers();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));
  
  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loading = postsLoading || usersLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-4">Explore</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search writers, posts, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-lg"
            />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Loading explore content...</p>
          </div>
        )}

        {!loading && !searchQuery && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSearchQuery(tag)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {!loading && searchQuery && filteredUsers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Writers</h2>
            <div className="grid gap-4">
              {filteredUsers.map(writer => (
                <Link key={writer.id} to={`/profile/${writer.id}`}>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={writer.profilePicture} alt={writer.name} />
                        <AvatarFallback>{writer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{writer.name}</p>
                        <p className="text-sm text-muted-foreground">{writer.bio}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!loading && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {searchQuery ? 'Search Results' : 'Trending Posts'}
            </h2>
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => user && likePost(post.id, user.id)}
                  onComment={() => {}}
                />
              ))}
              {filteredPosts.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  No results found
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;