import { useNavigate } from '@tanstack/react-router';
import { useGetFeed } from '../hooks/useQueries';
import PostCard from '../components/posts/PostCard';
import LoadingState from '../components/state/LoadingState';
import EmptyState from '../components/state/EmptyState';
import ErrorState from '../components/state/ErrorState';
import { Button } from '@/components/ui/button';
import { PenSquare, Rss } from 'lucide-react';

export default function FeedPage() {
  const { data: posts, isLoading, error } = useGetFeed();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingState count={3} type="post" />;
  }

  if (error) {
    return <ErrorState error={error} title="Failed to load feed" />;
  }

  if (!posts || posts.length === 0) {
    return (
      <EmptyState
        icon={<Rss className="w-8 h-8" />}
        title="No posts yet"
        description="Be the first to share something with the TAZ community!"
        action={{
          label: 'Create Post',
          onClick: () => navigate({ to: '/compose' }),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Feed
        </h1>
        <Button
          onClick={() => navigate({ to: '/compose' })}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <PenSquare className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <PostCard key={index} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
