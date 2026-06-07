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
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border border-gray-700 bg-gray-900/80 py-2.5 pl-10 pr-4',
          'text-sm text-gray-100 placeholder:text-gray-500',
          'transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/40',
        )}
      />
    </div>
  );
}
