'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  getLists,
  createList,
  addFilmToList,
  removeFilmFromList,
  isFilmInList,
  type UserCustomList,
} from '@/lib/local-store';

interface AddToListDialogProps {
  open: boolean;
  onClose: () => void;
  film: {
    filmId: number;
    filmTitle: string;
    filmPoster: string;
    filmYear: number;
  };
}

export function AddToListDialog({ open, onClose, film }: AddToListDialogProps) {
  const [lists, setLists] = useState<UserCustomList[]>([]);
  const [newListName, setNewListName] = useState('');

  // Refresh lists from localStorage when dialog opens
  useEffect(() => {
    if (open) {
      setLists(getLists());
      setNewListName('');
    }
  }, [open]);

  const filmEntry = {
    filmId: film.filmId,
    filmTitle: film.filmTitle,
    filmPoster: film.filmPoster || null,
    filmYear: film.filmYear || null,
  };

  const handleToggle = (listId: string) => {
    if (isFilmInList(listId, film.filmId)) {
      removeFilmFromList(listId, film.filmId);
    } else {
      addFilmToList(listId, filmEntry);
    }
    // Re-read from localStorage to reflect changes
    setLists(getLists());
  };

  const handleCreateList = () => {
    const name = newListName.trim();
    if (!name) return;
    const newList = createList(name);
    addFilmToList(newList.id, filmEntry);
    setNewListName('');
    setLists(getLists());
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
                    checked={isFilmInList(list.id, film.filmId)}
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
