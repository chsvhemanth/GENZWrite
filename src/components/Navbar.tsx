import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Bell, Search, Home, Compass, User, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNotifications } from '@/context/NotificationsContext';

export const Navbar = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Zenz Write" className="h-6 w-6" />
          <span className="font-serif text-xl font-bold">Zenz Write</span>
        </Link>

        <div className="flex flex-1 items-center justify-center px-8 max-w-2xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts, writers, tags..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        <nav className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/explore">
              <Compass className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-[10px] leading-4 text-primary-foreground text-center">
                  {Math.min(unreadCount, 9)}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <ThemeToggle />
          {user ? (
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/profile/${user.id}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};