import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share2, ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, likePost, addComment, deletePost } = usePosts();
  const { getUserById, loading: usersLoading } = useUsers();
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');

  const post = posts.find(p => p.id === id);
  const author = post ? getUserById(post.authorId) : null;
  const isLiked = user && post && post.likes.includes(user.id);
  const isAuthor = user && post && post.authorId === user.id;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl py-8">
          <p className="text-center text-muted-foreground">Post not found</p>
        </div>
      </div>
    );
  }

  if (usersLoading || !author) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl py-8">
          <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground py-24">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Loading post details...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleComment = () => {
    if (!user) {
      toast({ title: 'Please sign in to comment' });
      return;
    }

    if (!commentText.trim()) {
      toast({ title: 'Comment cannot be empty', variant: 'destructive' });
      return;
    }

    addComment(post.id, user.id, commentText.trim());
    setCommentText('');
    toast({ title: 'Comment added!' });
  };

  const handleDelete = () => {
    if (!isAuthor) return;
    deletePost(post.id);
    toast({ title: 'Post deleted' });
    navigate('/');
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + '...',
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({ title: 'Link copied to clipboard!' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <div className="flex items-start space-x-4 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src={author.profilePicture} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{author.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
            {isAuthor && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <h1 className="text-4xl font-serif font-bold mb-4">{post.title}</h1>

          <div
            className="prose prose-sm sm:prose lg:prose-lg max-w-none mb-6 font-serif text-foreground/90"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center space-x-6 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => user && likePost(post.id, user.id)}
              className={isLiked ? 'text-accent' : ''}
            >
              <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-5 w-5 mr-2" />
              {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>
        </Card>

        <div className="mt-8">
          <h2 className="text-2xl font-serif font-bold mb-4">
            Comments ({post.comments.length})
          </h2>

          {user && (
            <Card className="p-4 mb-6">
              <div className="flex space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button onClick={handleComment}>Post Comment</Button>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-4">
            {post.comments.map(comment => {
              const commenter = getUserById(comment.userId);
              if (!commenter) return null;

              return (
                <Card key={comment.id} className="p-4">
                  <div className="flex space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={commenter.profilePicture} alt={commenter.name} />
                      <AvatarFallback>{commenter.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold">{commenter.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <p className="text-foreground/90">{comment.content}</p>
                    </div>
                  </div>
                </Card>
              );
            })}

            {post.comments.length === 0 && !user && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No comments yet. Be the first to comment!
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;