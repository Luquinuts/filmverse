# Proposal: Custom User Lists

## Intent

Users need to organize movies beyond a single flat watchlist — e.g., "Best of 2025", "To watch with friends", "Favorites". This feature lets them create named lists, add/remove films, view all lists on profile, and browse each list's contents on a dedicated page.

## Scope

### In Scope
- `UserCustomList` + `UserListFilm` types and full CRUD in `src/lib/local-store.ts`
- Third profile tab "Mis Listas" with list cards (name, film count, cover)
- "Agregar a lista..." button on film detail → dialog with checkboxes + create new list
- New route `/lists/[listId]` showing all films in that list
- `ListCard` and `AddToListDialog` components
- Spanish (rioplatense) UI, dark theme with amber accents

### Out of Scope
- Public/private list toggle
- Sharing lists with other users
- Reordering films within a list
- Drag-and-drop

## Capabilities

### New Capabilities
- `custom-user-lists`: user-created named film lists with per-list browsing

### Modified Capabilities
None — no existing spec declares list behavior.

## Approach

1. Add types `UserCustomList` and `UserListFilm` to local-store.ts. Store under single key `filmverse_custom_lists`. CRUD: `getLists`, `createList`, `deleteList`, `renameList`, `addFilmToList`, `removeFilmFromList`, `getListById`.
2. Same denormalized pattern as watchlist (filmTitle, filmPoster, filmYear stored per entry).
3. Profile page: add third tab "Mis Listas" + stats counter.
4. Film detail: add "Agregar a lista..." button that opens a `Dialog` (base-ui). Show existing lists with checkboxes, plus a text input to create-and-add.
5. `AddToListDialog` manages its own optimistic state.
6. `/lists/[listId]` route reads from local-store, shows grid of films + list name header.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/local-store.ts` | Modified | Add list types + CRUD functions |
| `src/app/profile/page.tsx` | Modified | Add "Mis Listas" tab + cover grid |
| `src/app/film/[id]/page.tsx` | Modified | Add "Agregar a lista..." button |
| `src/components/lists/add-to-list-dialog.tsx` | New | Dialog with checkboxes + create input |
| `src/components/lists/list-card.tsx` | New | Card showing cover, name, film count |
| `src/app/lists/[listId]/page.tsx` | New | List detail page with film grid |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `filmverse_custom_lists` key gets large | Low | Same pattern as existing stores; no perf issue at expected scale |
| User deletes list with films | Low | Cascade delete — entry removed, no orphan data |
| No base-ui Dialog installed | Med | Use `@base-ui/react/dialog` — add if missing; fallback to modal with backdrop |

## Rollback Plan

- Revert proposal commit: `git revert HEAD`
- If deployed, remove `filmverse_custom_lists` key from localStorage via devtools
- Undo profile tab changes, remove new components and route

## Dependencies

- `@base-ui/react/dialog` (add if not in `package.json`)
- `lucide-react` (already present)

## Success Criteria

- [ ] User can create a named list, add films from film detail page
- [ ] Profile shows "Mis Listas" tab with correct count and cards
- [ ] List detail page renders all films in that list
- [ ] Removing a film from a list updates UI immediately
- [ ] Deleting a list removes it from profile and frees its films
