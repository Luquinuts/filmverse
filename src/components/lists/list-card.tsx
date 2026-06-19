'use client';

import Link from 'next/link';
import { List } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserCustomList } from '@/lib/local-store';

interface ListCardProps {
  list: UserCustomList & { filmCount: number };
}

const gradients = [
  'from-purple-600/40 to-pink-600/40',
  'from-blue-600/40 to-teal-600/40',
  'from-orange-600/40 to-red-600/40',
  'from-green-600/40 to-emerald-600/40',
  'from-indigo-600/40 to-violet-600/40',
  'from-amber-600/40 to-yellow-600/40',
];

export function ListCard({ list }: ListCardProps) {
  const gradientIndex =
    list.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    gradients.length;

  return (
    <Link
      href={`/lists/${list.id}`}
      className="group block"
    >
      <div
        className={cn(
          'glass relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-xl p-6',
          'transition-all duration-200',
          'hover:border-cinema-gold/40 hover:shadow-[0_0_20px_oklch(0.72_0.15_75/30%)]',
        )}
      >
        {/* Gradient cover */}
        <div
          className={cn(
            'absolute inset-0 rounded-xl bg-gradient-to-br opacity-60 transition-opacity group-hover:opacity-80',
            gradients[gradientIndex],
          )}
        />

        {/* Icon */}
        <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-white/10">
          <List className="size-6 text-cinema-gold" />
        </div>

        {/* Name */}
        <h3 className="relative z-10 text-center text-sm font-semibold text-white group-hover:text-cinema-gold transition-colors line-clamp-2">
          {list.name}
        </h3>

        {/* Film count */}
        <p className="relative z-10 text-xs text-muted-foreground">
          {list.filmCount === 1
            ? '1 película'
            : `${list.filmCount} películas`}
        </p>
      </div>
    </Link>
  );
}
