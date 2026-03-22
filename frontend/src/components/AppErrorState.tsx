import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export default function AppErrorState({ error }: { error: Error | unknown }) {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

  const getUserFriendlyMessage = (msg: string) => {
    if (msg.includes('Unauthorized')) {
      return 'You do not have permission to perform this action.';
    }
    if (msg.includes('not found')) {
      return 'The requested item could not be found.';
    }
    if (msg.includes('Actor not available')) {
      return 'Connection to the server is not available. Please try again.';
    }
    return msg;
  };

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{getUserFriendlyMessage(errorMessage)}</AlertDescription>
    </Alert>
  );
}
