import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, UserMinus } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/context/AuthContext';
import { PostCard } from '@/components/PostCard';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { getUserById, followUser, users } = useUsers();
  const { posts, likePost } = usePosts();
  
  const profileUser = getUserById(id!);
  const userPosts = posts.filter(p => p.authorId === id);
  const isOwnProfile = user?.id === id;
  const isFollowing = user && profileUser?.followers.includes(user.id);

  if (!profileUser) {
    return <div className="container py-8">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 space-y-8">
        <Card className="p-8">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileUser.profilePicture} alt={profileUser.name} />
              <AvatarFallback className="text-2xl">{profileUser.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-serif font-bold">{profileUser.name}</h1>
                <p className="text-muted-foreground">{profileUser.email}</p>
              </div>

              {profileUser.bio && (
                <p className="text-foreground/90">{profileUser.bio}</p>
              )}

              <div className="flex items-center space-x-6 text-sm">
                <div>
                  <span className="font-semibold">{userPosts.length}</span>
                  <span className="text-muted-foreground ml-1">Posts</span>
                </div>
                <div>
                  <span className="font-semibold">{profileUser.followers.length}</span>
                  <span className="text-muted-foreground ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-semibold">{profileUser.following.length}</span>
                  <span className="text-muted-foreground ml-1">Following</span>
                </div>
              </div>

              {!isOwnProfile && user && (
                <Button
                  onClick={() => followUser(user.id, profileUser.id)}
                  variant={isFollowing ? 'outline' : 'default'}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6 mt-6">
            {userPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => user && likePost(post.id, user.id)}
                onComment={() => {}}
              />
            ))}
            {userPosts.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No posts yet</p>
            )}
          </TabsContent>

          <TabsContent value="followers" className="mt-6">
            <div className="grid gap-4">
              {profileUser.followers.map(followerId => {
                const follower = getUserById(followerId);
                return follower ? (
                  <Card key={followerId} className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={follower.profilePicture} alt={follower.name} />
                        <AvatarFallback>{follower.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{follower.name}</p>
                        <p className="text-sm text-muted-foreground">{follower.bio}</p>
                      </div>
                    </div>
                  </Card>
                ) : null;
              })}
            </div>
          </TabsContent>

          <TabsContent value="following" className="mt-6">
            <div className="grid gap-4">
              {profileUser.following.map(followingId => {
                const following = getUserById(followingId);
                return following ? (
                  <Card key={followingId} className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={following.profilePicture} alt={following.name} />
                        <AvatarFallback>{following.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{following.name}</p>
                        <p className="text-sm text-muted-foreground">{following.bio}</p>
                      </div>
                    </div>
                  </Card>
                ) : null;
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;