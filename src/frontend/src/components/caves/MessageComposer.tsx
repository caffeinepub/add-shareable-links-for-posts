import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSendMessage } from '../../hooks/useQueries';
import { Send } from 'lucide-react';

interface MessageComposerProps {
  caveId: string;
}

export default function MessageComposer({ caveId }: MessageComposerProps) {
  const [content, setContent] = useState('');
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      await sendMessage.mutateAsync({ caveId, content: content.trim() });
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        rows={1}
        className="resize-none border-purple-200 dark:border-purple-800 focus:ring-purple-500"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button
        type="submit"
        disabled={!content.trim() || sendMessage.isPending}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
