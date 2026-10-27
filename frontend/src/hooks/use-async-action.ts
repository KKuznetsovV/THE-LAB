import { useState } from 'react';

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) return error.message;
  return 'Unknown error';
}

export default function useAsyncAction(action?: () => Promise<void>): {
  run: () => Promise<void>;
  status: AsyncStatus;
  error: string | null;
} {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  async function run(): Promise<void> {
    if (!action) return;
    setStatus('pending');
    setError(null);
    try {
      await action();
      setStatus('success');
    } catch (caught: unknown) {
      setStatus('error');
      setError(toErrorMessage(caught));
    }
  }

  return { run, status, error };
}
