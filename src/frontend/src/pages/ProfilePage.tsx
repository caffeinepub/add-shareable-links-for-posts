import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetFeed } from '../hooks/useQueries';
import PostCard from '../components/posts/PostCard';
import LoadingState from '../components/state/LoadingState';
import EmptyState from '../components/state/EmptyState';
import UserAvatar from '../components/profile/UserAvatar';
import ProfileEditor from '../components/profile/ProfileEditor';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: allPosts, isLoading: postsLoading } = useGetFeed();

  const myPosts = allPosts?.filter((post) => post.author.toString() === identity?.getPrincipal().toString()) || [];

  if (profileLoading || postsLoading) {
    return <LoadingState count={3} type="post" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Profile
      </h1>

      <Card className="border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <UserAvatar profile={profile} principal={identity?.getPrincipal().toString() || ''} size="lg" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile?.displayName || 'Anonymous User'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {identity?.getPrincipal().toString().slice(0, 20)}...
              </p>
            </div>
          </div>

          <ProfileEditor />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Posts ({myPosts.length})</h2>

        {myPosts.length === 0 ? (
          <EmptyState
            icon={<User className="w-8 h-8" />}
            title="No posts yet"
            description="You haven't created any posts yet. Share something with the community!"
          />
        ) : (
          <div className="space-y-4">
            {myPosts.map((post, index) => (
              <PostCard key={index} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
