import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile } from '../../backend';

interface UserAvatarProps {
  profile: UserProfile | null | undefined;
  principal: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({ profile, principal, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const avatarUrl = profile?.avatar?.getDirectURL();
  const initials = profile?.displayName
    ? profile.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : principal.slice(0, 2).toUpperCase();

  return (
    <Avatar className={sizeClasses[size]}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={profile?.displayName || 'User'} />}
      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
