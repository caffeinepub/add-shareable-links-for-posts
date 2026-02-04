import { Link } from '@tanstack/react-router';
import type { Post } from '../../backend';
import { useGetUserProfile } from '../../hooks/useQueries';
import { formatTimestamp } from '../../utils/time';
import MediaRenderer from '../media/MediaRenderer';
import UserAvatar from '../profile/UserAvatar';
import { Card, CardContent } from '@/components/ui/card';

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  const { data: profile } = useGetUserProfile(post.author.toString());
  const displayName = profile?.displayName || `User ${post.author.toString().slice(0, 8)}...`;

  return (
    <Card className="border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3 mb-4">
          <UserAvatar profile={profile} principal={post.author.toString()} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimestamp(post.timestamp)}</p>
          </div>
        </div>

        {post.content && (
          <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap break-words">
            {post.content}
          </p>
        )}

        {post.media && (
          <Link to="/post/$postIndex" params={{ postIndex: index.toString() }}>
            <MediaRenderer media={post.media} className="cursor-pointer hover:opacity-90 transition-opacity" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
