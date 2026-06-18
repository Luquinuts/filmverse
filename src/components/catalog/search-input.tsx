'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Buscá películas...',
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border border-white/10 bg-glass-bg py-2.5 pl-10 pr-4 backdrop-blur-[12px]',
          'text-sm text-foreground placeholder:text-muted-foreground',
          'transition-colors focus:border-cinema-gold/50 focus:outline-none focus:ring-1 focus:ring-cinema-gold/40',
        )}
      />
    </div>
  );
}
