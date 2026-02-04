import { useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useJoinCave } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function JoinCavePage() {
  const { token } = useParams({ from: '/join/$token' });
  const joinCave = useJoinCave();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      joinCave.mutate(token);
    }
  }, [token]);

  const handleGoToCaves = () => {
    navigate({ to: '/caves' });
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="text-center">Join Cave</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {joinCave.isPending && (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
              <p className="text-gray-600 dark:text-gray-400">Joining cave...</p>
            </>
          )}

          {joinCave.isSuccess && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
              <p className="text-gray-900 dark:text-white font-semibold">Successfully joined cave!</p>
              <Button
                onClick={handleGoToCaves}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Go to Caves
              </Button>
            </>
          )}

          {joinCave.isError && (
            <>
              <XCircle className="w-12 h-12 mx-auto text-red-600" />
              <p className="text-gray-900 dark:text-white font-semibold">Failed to join cave</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {joinCave.error instanceof Error ? joinCave.error.message : 'Invalid or expired invite link'}
              </p>
              <Button
                onClick={handleGoToCaves}
                variant="outline"
                className="w-full"
              >
                Go to Caves
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
