import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Video, X } from 'lucide-react';
import { validateMediaFile, isImageType, isVideoType } from '../../constants/media';
import { toast } from 'sonner';

interface MediaPickerProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  selectedFile: File | null;
}

export default function MediaPicker({ onFileSelect, onClear, selectedFile }: MediaPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateMediaFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    onFileSelect(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {!selectedFile ? (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30"
          >
            <Image className="w-4 h-4 mr-2" />
            Add Photo
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30"
          >
            <Video className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-purple-200 dark:border-purple-800">
          {preview && isImageType(selectedFile.type) && (
            <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          )}
          {preview && isVideoType(selectedFile.type) && (
            <video src={preview} className="w-full h-48 object-cover" controls />
          )}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleClear}
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
