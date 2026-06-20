'use client';

import { useState, useEffect, useRef } from 'react';
import { List } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getLists, getListById } from '@/lib/supabase/store';
import type { CustomListRow } from '@/lib/types';
import { ListCard } from '@/components/lists/list-card';

interface ListWithCount extends CustomListRow {
  filmCount: number;
}

interface ListsTabProps {
  userId: string;
}

export function ListsTab({ userId }: ListsTabProps) {
  const supabase = useRef(createClient()).current;
  const [lists, setLists] = useState<ListWithCount[]>([]);

  useEffect(() => {
    async function loadLists() {
      try {
        const allLists = await getLists(supabase, userId);
        const withCounts: ListWithCount[] = await Promise.all(
          allLists.map(async (list) => {
            const entry = await getListById(supabase, list.id);
            return {
              ...list,
              filmCount: entry?.films.length ?? 0,
            };
          }),
        );
        setLists(withCounts);
      } catch (err) {
        console.error('[lists-tab] load lists:', err);
      }
    }
    loadLists();
  }, [supabase, userId]);

  if (lists.length === 0) {
    return (
      <div className="py-16 text-center">
        <List className="mx-auto mb-3 size-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">
          Todavía no creaste ninguna lista. Agregá películas desde la página de
          cada film para armar tus listas.
        </p>
        <Link
          href="/search"
          className="mt-3 inline-block text-sm text-cinema-gold hover:text-cinema-amber transition-colors"
        >
          Explorar películas
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {lists.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  );
}
