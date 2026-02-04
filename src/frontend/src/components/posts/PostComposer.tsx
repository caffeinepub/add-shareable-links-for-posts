import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MediaPicker from '../media/MediaPicker';
import { useCreatePost } from '../../hooks/useQueries';
import { ExternalBlob } from '../../backend';
import { Loader2 } from 'lucide-react';

export default function PostComposer() {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const createPost = useCreatePost();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && !selectedFile) {
      return;
    }

    try {
      let mediaBlob: ExternalBlob | null = null;

      if (selectedFile) {
        setUploading(true);
        const arrayBuffer = await selectedFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        mediaBlob = ExternalBlob.fromBytes(uint8Array);
      }

      await createPost.mutateAsync({ content, media: mediaBlob });
      setContent('');
      setSelectedFile(null);
      navigate({ to: '/' });
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setUploading(false);
    }
  };

  const isSubmitting = createPost.isPending || uploading;

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Create a Post
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={6}
            className="resize-none border-purple-200 dark:border-purple-800 focus:ring-purple-500"
          />

          <MediaPicker
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            onClear={() => setSelectedFile(null)}
          />

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/' })}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={(!content.trim() && !selectedFile) || isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {uploading ? 'Uploading...' : 'Posting...'}
                </>
              ) : (
                'Post'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
