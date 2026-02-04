import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Home, PenSquare, MessageCircle, User, LogOut, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { copyAppShareLink } from '../../utils/appShareLink';

export default function AppNav() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    toast.success('Signed out successfully');
  };

  const handleShare = async () => {
    try {
      await copyAppShareLink();
      toast.success('App link copied');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-purple-200 dark:border-purple-800 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 max-w-4xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/assets/generated/taz-app-icon.dim_512x512.png" 
              alt="TAZ" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TAZ
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <Link to="/">
                <Home className="w-5 h-5" />
                <span className="ml-2 hidden sm:inline">Feed</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <Link to="/compose">
                <PenSquare className="w-5 h-5" />
                <span className="ml-2 hidden sm:inline">Post</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <Link to="/caves">
                <MessageCircle className="w-5 h-5" />
                <span className="ml-2 hidden sm:inline">Caves</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <Link to="/profile">
                <User className="w-5 h-5" />
                <span className="ml-2 hidden sm:inline">Profile</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <Share2 className="w-5 h-5" />
              <span className="ml-2 hidden sm:inline">Share</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
