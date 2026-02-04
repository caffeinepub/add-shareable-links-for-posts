import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetCaves, useGetUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import MessageComposer from '../components/caves/MessageComposer';
import CaveInvitesPanel from '../components/caves/CaveInvitesPanel';
import LoadingState from '../components/state/LoadingState';
import EmptyState from '../components/state/EmptyState';
import UserAvatar from '../components/profile/UserAvatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { formatMessageTime } from '../utils/time';
import { useEffect, useRef, useMemo } from 'react';

function MessageItem({ message }: { message: { author: any; content: string; timestamp: bigint } }) {
  const { data: profile } = useGetUserProfile(message.author.toString());
  const displayName = profile?.displayName || `User ${message.author.toString().slice(0, 8)}...`;

  return (
    <div className="flex items-start space-x-3">
      <UserAvatar profile={profile} principal={message.author.toString()} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">{displayName}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatMessageTime(message.timestamp)}
          </span>
        </div>
        <p className="text-gray-800 dark:text-gray-200 mt-1 break-words">{message.content}</p>
      </div>
    </div>
  );
}

function MemberItem({ member }: { member: any }) {
  const { data: profile } = useGetUserProfile(member.toString());
  const displayName = profile?.displayName || `User ${member.toString().slice(0, 8)}...`;

  return (
    <div className="flex items-center space-x-2">
      <UserAvatar profile={profile} principal={member.toString()} size="sm" />
      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{displayName}</span>
    </div>
  );
}

export default function CaveChatPage() {
  const { caveId } = useParams({ from: '/caves/$caveId' });
  const { data: caves } = useGetCaves();
  const cave = useMemo(() => caves?.find((c) => c.id === caveId), [caves, caveId]);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [cave?.messages]);

  if (!cave) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/caves' })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Caves
        </Button>
        <LoadingState count={5} type="message" />
      </div>
    );
  }

  const isMember = identity && cave.members.some((m) => m.toString() === identity.getPrincipal().toString());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/caves' })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {cave.id}
        </h1>
        <div className="w-20" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="h-96 overflow-y-auto space-y-4 mb-4">
                {cave.messages.length === 0 ? (
                  <EmptyState
                    icon={<MessageCircle className="w-8 h-8" />}
                    title="No messages yet"
                    description="Start the conversation by sending the first message!"
                  />
                ) : (
                  <>
                    {cave.messages.map((message, index) => (
                      <MessageItem key={index} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {isMember && <MessageComposer caveId={caveId} />}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {isMember && <CaveInvitesPanel caveId={caveId} />}

          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Members ({cave.members.length})</h3>
              <div className="space-y-2">
                {cave.members.map((member) => (
                  <MemberItem key={member.toString()} member={member} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
