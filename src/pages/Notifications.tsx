import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/context/NotificationsContext';
import { Bell, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { API_URL } from '@/lib/api';
import { useEffect } from 'react';

const Notifications = () => {
  const { notifications, markAllRead } = useNotifications();
  useEffect(() => {
    const sse = new EventSource(`${API_URL}/api/notifications/stream`, { withCredentials: true } as any);
    return () => { sse.close(); };
  }, []);
  const iconFor = (type: 'like' | 'comment' | 'follow') => {
    if (type === 'like') return <Heart className="h-4 w-4 text-rose-500" />;
    if (type === 'comment') return <MessageCircle className="h-4 w-4 text-blue-500" />;
    return <UserPlus className="h-4 w-4 text-emerald-500" />;
  };
  const textFor = (type: 'like' | 'comment' | 'follow') => {
    if (type === 'like') return 'liked your post';
    if (type === 'comment') return 'commented on your post';
    return 'started following you';
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-serif font-bold">Notifications</h1>
          <Button variant="secondary" onClick={markAllRead}>Mark all read</Button>
        </div>
        {notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              No notifications yet
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              When someone likes, comments, or follows you, you'll see it here
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <Card key={n.id} className={`p-4 flex items-center gap-3 ${!n.isRead ? 'bg-accent/30' : ''}`}>
                {iconFor(n.type)}
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-medium">Someone</span> {textFor(n.type)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;