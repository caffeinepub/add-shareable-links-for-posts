import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateInvite } from '../../hooks/useQueries';
import { buildInviteLink, copyToClipboard } from '../../utils/inviteLinks';
import { Copy, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CaveInvitesPanelProps {
  caveId: string;
}

export default function CaveInvitesPanel({ caveId }: CaveInvitesPanelProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [token, setToken] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const createInvite = useCreateInvite();

  const handleCreateInvite = async () => {
    const inviteToken = token.trim() || `cave-${Date.now()}`;
    await createInvite.mutateAsync({ caveId, token: inviteToken });
    const link = buildInviteLink(inviteToken);
    setGeneratedLink(link);
    setToken('');
  };

  const handleCopyLink = async () => {
    if (generatedLink) {
      try {
        await copyToClipboard(generatedLink);
        toast.success('Invite link copied to clipboard');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="text-lg">Invite Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!showCreate && !generatedLink && (
          <Button
            onClick={() => setShowCreate(true)}
            variant="outline"
            className="w-full border-purple-200 dark:border-purple-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Invite Link
          </Button>
        )}

        {showCreate && !generatedLink && (
          <div className="space-y-3">
            <Input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Custom token (optional)"
              className="border-purple-200 dark:border-purple-800"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateInvite}
                disabled={createInvite.isPending}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {createInvite.isPending ? 'Creating...' : 'Create'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {generatedLink && (
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Invite Link:</p>
              <p className="text-sm font-mono break-all text-purple-700 dark:text-purple-300">
                {generatedLink}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopyLink} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" onClick={() => setGeneratedLink(null)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
