# Design: Custom User Lists (FilmVerse)

## Technical Approach

Extend `local-store.ts` with custom list types + CRUD, mirroring the existing watchlist pattern (denormalized film data stored per entry, single-key storage). Add a "Mis Listas" tab to the profile, an `AddToListDialog` on film detail pages, and a new `/lists/[listId]` dynamic route.

## Architecture Decisions

| Decision | Options | Chosen | Rationale |
|----------|---------|--------|-----------|
| Storage shape | Two arrays (lists + films) vs `Record<string, {list, films}>` single key | Single key per proposal | Atomic per-list reads/writes; no join logic needed |
| Dialog | HTML `<dialog>` vs `@base-ui/react/dialog` | base-ui Dialog | Already in deps; consistent with Button/Input wrapping pattern |
| Film data in entries | Store only filmId vs denormalized (title, poster, year) | Denormalized (watchlist pattern) | No extra fetch needed to render list cards or grid |

## Data Layer — `src/lib/local-store.ts`

Types follow existing `WatchlistEntry` / `ReviewEntry` conventions:

| Type | Fields |
|------|--------|
| `UserCustomList` | `id: string`, `name: string`, `description: string`, `createdAt`, `updatedAt` (both ISO) |
| `UserListFilm` | `filmId: number`, `filmTitle`, `filmPoster`, `filmYear`, `addedAt: string` |

Key: `filmverse_custom_lists`. Shape: `Record<string, { list: UserCustomList; films: UserListFilm[] }>`.

| Function | Behavior |
|----------|----------|
| `getLists()` | Returns `UserCustomList[]` sorted by createdAt desc |
| `getListById(id)` | Returns `{ list, films } \| null` |
| `createList(name)` | Generates ID + timestamps; returns `UserCustomList` |
| `deleteList(id)` | Removes entry from store (cascade) |
| `renameList(id, name)` | Updates name + updatedAt |
| `addFilmToList(id, film)` | Idempotent — skips if `filmId` already present |
| `removeFilmFromList(listId, filmId)` | Filters entry.films |

**`getUserStats()`** gains `listsCount: Object.keys(getItem(CUSTOM_LISTS_KEY, {})).length`.

## Component Tree

```
ProfilePage
├── ProfileTabs (reviews | watchlist | lists)  ← 'lists' added to ProfileTab union
│   └── ListsTab
│       ├── ListCard × N  (Link to /lists/[id]; cover or gradient; name; count)
│       └── EmptyState    (icon + "No creaste ninguna lista todavía")

FilmDetailPage
├── AddToListButton  ("Agregar a lista..." — hidden if !userId)
└── AddToListDialog   (base-ui Dialog)
    ├── ListCheckbox × N  (checked if film is already in that list)
    └── CreateListInput   (text input + create button)

ListDetailPage  (/lists/[listId])
├── ListHeader    (name, description, film count, delete button)
├── FilmGrid      (same 2→3→4 col grid as profile watchlist)
│   └── FilmCard × N  (with remove button overlay)
└── EmptyState    (icon + "Esta lista está vacía")
```

## AddToListDialog State Machine

States: `closed → selecting → creating-new → closed`. Opening shows checkboxes for each existing list. Toggling a checkbox immediately writes to localStorage (optimistic, no undo — matches watchlist toggle). Clicking "Crear nueva" reveals a text input; on Enter, `createList(name)` + `addFilmToList(id, film)` run, the new list auto-checks. Dialog closes on overlay click or close button.

## Route Design — `/app/lists/[listId]/page.tsx`

- `'use client'` — reads async `params.listId`, calls `getListById()`
- If null, `notFound()` from `next/navigation`
- Glass header + responsive film grid + delete with confirm → redirect to `/profile`

## Edge Cases

| Case | Mitigation |
|------|-----------|
| Multiple tabs | Re-reads localStorage on mount (no stale state) |
| Not logged in | Button hidden behind `{userId && ...}` — same as watchlist |
| Duplicate film | `addFilmToList` skips if `filmId` already in list |
| Empty list | Gradient placeholder on `ListCard`; empty state on detail page |
| Invalid listId | Calls `notFound()` — uses existing layout |

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/lib/local-store.ts` | Modify | Add types + CRUD functions + `listsCount` in `getUserStats()` |
| `src/app/profile/page.tsx` | Modify | Add `'lists'` to `ProfileTab`, third tab button, `ListsTab` render block |
| `src/app/film/[id]/page.tsx` | Modify | Import `AddToListDialog`, render button + dialog below watchlist button |
| `src/components/lists/add-to-list-dialog.tsx` | Create | base-ui Dialog with checkboxes + create input |
| `src/components/lists/list-card.tsx` | Create | Card: poster/gradient, name, film count; wraps `<Link href="/lists/[id]">` |
| `src/components/lists/lists-tab.tsx` | Create | Profile tab content: grid of `ListCard` or empty state |
| `src/app/lists/[listId]/page.tsx` | Create | List detail: header + film grid + delete + empty state |

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Unit | `local-store.ts` CRUD functions | Vitest: create → add film → read → delete cycle, verify idempotency |
| Manual | All flows | `npm run dev`: create list from film detail → check profile tab → open list detail → remove film → delete list |

## Migration / Rollout

No migration required. New key `filmverse_custom_lists` is read on first access, empty object if missing.

## Open Questions

- [ ] Should `createList` also accept an optional `description` field now, or add later? (Proposal omits it — keep MVP lean.)
