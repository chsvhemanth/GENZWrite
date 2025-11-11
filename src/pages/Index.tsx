import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/PostCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenSquare } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/RichTextEditor';

const Index = () => {
  const { posts, createPost, likePost } = usePosts();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleCreatePost = () => {
    if (!user) {
      toast({ title: 'Please sign in to create a post' });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({ title: 'Title and content are required', variant: 'destructive' });
      return;
    }

    createPost({
      authorId: user.id,
      title: title.trim(),
      content: content.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      likes: [],
      comments: [],
    });

    setTitle('');
    setContent('');
    setTags('');
    setIsCreateOpen(false);
    toast({ title: 'Post created successfully!' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Your Feed</h1>
            <p className="text-muted-foreground">Discover stories, poems, and writings</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <PenSquare className="h-5 w-5 mr-2" />
                Write
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">Share Your Writing</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Give your work a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Write your poem, story, or thoughts..."
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="poetry, love, nature"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreatePost} size="lg" className="w-full">
                  Publish
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => user && likePost(post.id, user.id)}
              onComment={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;