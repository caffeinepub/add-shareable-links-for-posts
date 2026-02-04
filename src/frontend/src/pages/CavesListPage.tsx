import { Link } from '@tanstack/react-router';
import { useGetCaves } from '../hooks/useQueries';
import CreateCaveDialog from '../components/caves/CreateCaveDialog';
import LoadingState from '../components/state/LoadingState';
import EmptyState from '../components/state/EmptyState';
import ErrorState from '../components/state/ErrorState';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Users } from 'lucide-react';

export default function CavesListPage() {
  const { data: caves, isLoading, error } = useGetCaves();

  if (isLoading) {
    return <LoadingState count={3} type="cave" />;
  }

  if (error) {
    return <ErrorState error={error} title="Failed to load caves" />;
  }

  if (!caves || caves.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Caves
          </h1>
          <CreateCaveDialog />
        </div>
        <EmptyState
          icon={<MessageCircle className="w-8 h-8" />}
          title="No caves yet"
          description="Create a cave to start private conversations with your friends!"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Caves
        </h1>
        <CreateCaveDialog />
      </div>

      <div className="grid gap-4">
        {caves.map((cave) => (
          <Link key={cave.id} to="/caves/$caveId" params={{ caveId: cave.id }}>
            <Card className="border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{cave.id}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cave.messages.length} message{cave.messages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">{cave.members.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
