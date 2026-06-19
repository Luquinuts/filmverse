# Tasks: Custom User Lists

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~380–440 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Types + CRUD + components + pages + wiring | PR 1 | Single PR; all changes depend on `local-store.ts` types |

## Phase 1: Data Layer — `src/lib/local-store.ts`

- [ ] 1.1 Add `UserCustomList` and `UserListFilm` interfaces after existing `WatchlistEntry` block — `id`, `name`, `description`, `createdAt` / `updatedAt` (ISO strings) for lists; `listId`, `filmId`, `filmTitle`, `filmPoster`, `filmYear`, `addedAt` for films
- [ ] 1.2 Add `CUSTOM_LISTS_KEY = 'filmverse_custom_lists'` constant alongside existing `WATCHLIST_KEY`
- [ ] 1.3 Implement `getLists(): UserCustomList[]` — reads from localStorage, returns sorted by `createdAt` desc
- [ ] 1.4 Implement `getListById(id: string): { list: UserCustomList; films: UserListFilm[] } | null` — returns combined entry or null
- [ ] 1.5 Implement `createList(name: string, description?: string): UserCustomList` — generates `crypto.randomUUID()`, ISO timestamps, writes store, returns the new list
- [ ] 1.6 Implement `deleteList(id: string): void` — removes entry + cascade deletes all films under that key
- [ ] 1.7 Implement `renameList(id: string, name: string): void` — updates name + `updatedAt`
- [ ] 1.8 Implement `addFilmToList(listId: string, film: Omit<UserListFilm, 'listId' | 'addedAt'>): void` — idempotent: skip if `filmId` already in that list's films array
- [ ] 1.9 Implement `removeFilmFromList(listId: string, filmId: number): void` — filters entry.films, writes store
- [ ] 1.10 Implement `getListFilms(listId: string): UserListFilm[]` — returns films array or `[]`
- [ ] 1.11 Implement `isFilmInList(listId: string, filmId: number): boolean` — checks if filmId exists in entry.films
- [ ] 1.12 Update `getUserStats()` — add `listsCount` field via `Object.keys(getItem(CUSTOM_LISTS_KEY, {})).length`

## Phase 2: Shared Components (`src/components/lists/`)

- [ ] 2.1 Create `src/components/lists/list-card.tsx` — card component that receives `list: UserCustomList & { filmCount: number }`. Shows gradient placeholder (no single poster), name, film count; wraps in `<Link href="/lists/[id]">`
- [ ] 2.2 Create `src/components/lists/lists-tab.tsx` — profile tab content: calls `getLists()`, renders responsive grid (2→3→4 cols) of `ListCard` components. Empty state: icon + "Todavía no creaste ninguna lista"
- [ ] 2.3 Create `src/components/lists/add-to-list-dialog.tsx` — base-ui `<Dialog.Popup>` with checkboxes for each existing list (checked = `isFilmInList`), toggle calls `addFilmToList`/`removeFilmFromList` directly. Bottom section: text input + "Crear lista nueva" button (disabled if empty/whitespace). On create: calls `createList(name)` then `addFilmToList(id, film)`. Props: `open`, `onClose`, `film: { filmId, filmTitle, filmPoster, filmYear }`

## Phase 3: Page Wiring

- [ ] 3.1 `src/app/profile/page.tsx` — add `'lists'` to `ProfileTab` union type; add third tab button "Mis Listas" in tab bar; render `ListsTab` when `tab === 'lists'`; import `ListsTab` and `getLists` from local-store; update stats grid to show `listsCount` as fourth stat card
- [ ] 3.2 `src/app/film/[id]/page.tsx` — import `AddToListDialog`; import `getLists`; add `listDialogOpen` state + `toggle` handler; render "Agregar a lista..." button below the watchlist button (gated behind `userId &&`); render `<AddToListDialog open={listDialogOpen} onClose={() => setListDialogOpen(false)} film={...} />`

## Phase 4: New Route — `/lists/[listId]`

- [ ] 4.1 Create `src/app/lists/[listId]/page.tsx` — `'use client'`, reads `params.listId`, calls `getListById()`. If null → `notFound()`. Renders glass header (name, description, film count, "Eliminar lista" button). Grid of film posters (same 2→3→4 col pattern). Each poster has "Quitar de la lista" overlay. Empty state if no films. Delete with confirm → redirect to `/profile`. Not found: "Lista no encontrada"

## Phase 5: Testing / Verification

- [ ] 5.1 Test CRUD cycle in browser: create list → add film from detail → verify in profile tab → open list detail → remove film → verify empty state → delete list
- [ ] 5.2 Test edge cases: duplicate film add (idempotent), empty list card gradient, whitespace-only name disabled, invalid listId redirect
- [ ] 5.3 Verify `getUserStats()` shows correct `listsCount` in profile header
- [ ] 5.4 Verify dialog checkboxes reflect current membership on re-open
