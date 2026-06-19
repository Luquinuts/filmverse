'use client';

import { useState, useEffect } from 'react';
import { List } from 'lucide-react';
import Link from 'next/link';
import { getLists, getListFilms, type UserCustomList } from '@/lib/local-store';
import { ListCard } from '@/components/lists/list-card';

interface ListWithCount extends UserCustomList {
  filmCount: number;
}

export function ListsTab() {
  const [lists, setLists] = useState<ListWithCount[]>([]);

  useEffect(() => {
    const allLists = getLists();
    const withCounts: ListWithCount[] = allLists.map((list) => ({
      ...list,
      filmCount: getListFilms(list.id).length,
    }));
    setLists(withCounts);
  }, []);

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
