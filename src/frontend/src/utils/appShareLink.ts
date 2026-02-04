import { copyToClipboard } from './inviteLinks';

/**
 * Builds the shareable URL for the app's main entry point
 * Uses hash-based routing convention
 */
export function buildAppShareLink(): string {
  return `${window.location.origin}/#/`;
}

/**
 * Copies the app share link to clipboard
 * Reuses existing clipboard fallback implementation
 */
export async function copyAppShareLink(): Promise<void> {
  const shareUrl = buildAppShareLink();
  return copyToClipboard(shareUrl);
}
