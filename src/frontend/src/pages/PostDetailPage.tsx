import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetFeed, useGetUserProfile } from '../hooks/useQueries';
import MediaRenderer from '../components/media/MediaRenderer';
import UserAvatar from '../components/profile/UserAvatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { formatTimestamp } from '../utils/time';

export default function PostDetailPage() {
  const { postIndex } = useParams({ from: '/post/$postIndex' });
  const { data: posts } = useGetFeed();
  const navigate = useNavigate();

  const post = posts?.[parseInt(postIndex)];
  const authorPrincipal = post?.author.toString() || '';
  
  // Always call the hook, but with empty string if no post
  const { data: profile } = useGetUserProfile(authorPrincipal);

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Post not found</p>
        <Button onClick={() => navigate({ to: '/' })} className="mt-4">
          Back to Feed
        </Button>
      </div>
    );
  }

  const displayName = profile?.displayName || `User ${post.author.toString().slice(0, 8)}...`;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Feed
      </Button>

      <Card className="border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3 mb-6">
            <UserAvatar profile={profile} principal={post.author.toString()} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white">{displayName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimestamp(post.timestamp)}</p>
            </div>
          </div>

          {post.content && (
            <p className="text-gray-800 dark:text-gray-200 mb-6 whitespace-pre-wrap break-words text-lg">
              {post.content}
            </p>
          )}

          {post.media && <MediaRenderer media={post.media} />}
        </CardContent>
      </Card>
    </div>
  );
}
