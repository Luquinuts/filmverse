'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface OAuthButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  provider?: 'google' | 'github';
}

const providerLabels: Record<string, string> = {
  google: 'Iniciar con Google',
  github: 'Iniciar con GitHub',
};

export function OAuthButton({
  onClick,
  isLoading = false,
  disabled = false,
  provider = 'google',
}: OAuthButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2.5a10.5 10.5 0 1 0 0 21c2.762 0 5.256-1.095 7.076-3.141l-3.049-2.48c-0.955 0.728-2.127 1.163-3.521 1.163a3.987 3.987 0 0 1-3.853-2.762l-0.108-0.297z" fill="currentColor"/>
        </svg>
      )}
      {providerLabels[provider] ?? providerLabels.google}
    </Button>
  );
}
