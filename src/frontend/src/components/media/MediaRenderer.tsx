import { isImageType, isVideoType } from '../../constants/media';
import type { ExternalBlob } from '../../backend';

interface MediaRendererProps {
  media: ExternalBlob;
  className?: string;
}

export default function MediaRenderer({ media, className = '' }: MediaRendererProps) {
  const url = media.getDirectURL();
  
  // Determine type from URL or assume image
  const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');

  if (isVideo) {
    return (
      <video
        src={url}
        controls
        className={`w-full rounded-lg ${className}`}
        preload="metadata"
      />
    );
  }

  return (
    <img
      src={url}
      alt="Media content"
      className={`w-full rounded-lg object-cover ${className}`}
      loading="lazy"
    />
  );
}
