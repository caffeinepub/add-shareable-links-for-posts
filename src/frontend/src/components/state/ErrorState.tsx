import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { normalizeError } from '../../utils/errors';

interface ErrorStateProps {
  error: unknown;
  title?: string;
}

export default function ErrorState({ error, title = 'Error' }: ErrorStateProps) {
  const message = normalizeError(error);

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
