'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import {
  getLists,
  createList,
  addFilmToList,
  removeFilmFromList,
  isFilmInList,
} from '@/lib/supabase/store';
import type { CustomListRow } from '@/lib/types';

interface AddToListDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  film: {
    filmId: number;
    filmTitle: string;
    filmPoster: string;
    filmYear: number;
  };
}

export function AddToListDialog({ open, onClose, userId, film }: AddToListDialogProps) {
  const supabase = useRef(createClient()).current;
  const [lists, setLists] = useState<CustomListRow[]>([]);
  const [newListName, setNewListName] = useState('');
  const [filmInListIds, setFilmInListIds] = useState<Set<string>>(new Set());

  // Refresh lists from Supabase when dialog opens
  useEffect(() => {
    if (!open) return;

    async function load() {
      try {
        const allLists = await getLists(supabase, userId);
        setLists(allLists);
        setNewListName('');

        // Check which lists contain this film
        const checks = await Promise.all(
          allLists.map(async (list) => {
            const exists = await isFilmInList(supabase, list.id, film.filmId);
            return exists ? list.id : null;
          }),
        );
        setFilmInListIds(new Set(checks.filter(Boolean) as string[]));
      } catch (err) {
        console.error('[add-to-list] load lists:', err);
      }
    }
    load();
  }, [open, supabase, userId, film.filmId]);

  const handleToggle = async (listId: string) => {
    try {
      if (filmInListIds.has(listId)) {
        await removeFilmFromList(supabase, listId, film.filmId);
        setFilmInListIds((prev) => {
          const next = new Set(prev);
          next.delete(listId);
          return next;
        });
      } else {
        await addFilmToList(supabase, {
          list_id: listId,
          film_id: film.filmId,
          film_title: film.filmTitle,
          film_poster: film.filmPoster || null,
          film_year: film.filmYear || null,
        });
        setFilmInListIds((prev) => {
          const next = new Set(prev);
          next.add(listId);
          return next;
        });
      }
    } catch (err) {
      console.error('[add-to-list] toggle:', err);
    }
  };

  const handleCreateList = async () => {
    const name = newListName.trim();
    if (!name) return;
    try {
      const newList = await createList(supabase, userId, name);
      await addFilmToList(supabase, {
        list_id: newList.id,
        film_id: film.filmId,
        film_title: film.filmTitle,
        film_poster: film.filmPoster || null,
        film_year: film.filmYear || null,
      });
      setNewListName('');
      // Refresh lists
      const allLists = await getLists(supabase, userId);
      setLists(allLists);
      setFilmInListIds((prev) => new Set([...prev, newList.id]));
    } catch (err) {
      console.error('[add-to-list] create list:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newListName.trim()) {
      handleCreateList();
    }
  };

  const isCreateDisabled = !newListName.trim();

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 glass rounded-xl p-6 shadow-xl">
          <Dialog.Title className="mb-4 text-lg font-bold text-white">
            Agregar a lista
          </Dialog.Title>

          {/* Existing lists */}
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {lists.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Todavía no tenés listas. Creá una abajo.
              </p>
            ) : (
              lists.map((list) => (
                <label
                  key={list.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 p-3 transition-colors hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    checked={filmInListIds.has(list.id)}
                    onChange={() => handleToggle(list.id)}
                    className="size-4 accent-cinema-gold"
                  />
                  <span className="text-sm text-white">{list.name}</span>
                </label>
              ))
            )}
          </div>

          {/* Create new list */}
          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="mb-2 text-sm font-medium text-white">
              Crear lista nueva
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Nombre de la lista"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleCreateList}
                disabled={isCreateDisabled}
              >
                <Plus className="size-4" />
                Crear
              </Button>
            </div>
          </div>

          {/* Close */}
          <div className="mt-4 flex justify-end">
            <Dialog.Close className="text-sm text-muted-foreground transition-colors hover:text-white">
              Cerrar
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
