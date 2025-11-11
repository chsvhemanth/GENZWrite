import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Post } from '@/types';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { apiFetch } from '@/lib/api';
import { normalizeUser } from '@/lib/mapper';
import { User } from '@/types';

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onComment: () => void;
}

export const PostCard = ({ post, onLike, onComment }: PostCardProps) => {
  const { user } = useAuth();
  const [author, setAuthor] = useState<User | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await apiFetch(`/api/users/${post.authorId}`);
        if (alive) setAuthor(normalizeUser(data.user));
      } catch {
        setAuthor(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [post.authorId]);
  const isLiked = user && post.likes.includes(user.id);

  if (!author) return null;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.profilePicture} alt={author.name} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div>
            <Link
              to={`/profile/${author.id}`}
              className="font-semibold hover:text-primary transition-colors"
            >
              {author.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>

          <Link to={`/post/${post.id}`} className="block space-y-2">
            <h2 className="text-2xl font-serif font-semibold">{post.title}</h2>
            <div 
              className="text-foreground/90 line-clamp-6 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Link>

          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center space-x-6 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={isLiked ? 'text-accent' : ''}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {post.likes.length}
            </Button>
            <Button variant="ghost" size="sm" onClick={onComment}>
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments.length}
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};