# Custom User Lists — Especificación

## Propósito

Usuarios DEBEN poder crear listas con nombre, agregar/remover películas, y navegar cada lista en una ruta dedicada. Los datos persisten en `public.custom_lists` y `public.list_films` con RLS.

## Datos

| Concepto | Detalle |
|----------|---------|
| Tablas | `public.custom_lists`, `public.list_films` |
| IDs | UUID generados por `gen_random_uuid()` |
| `is_public` | `boolean`, default `false` |
| RLS | Solo dueño ve y modifica listas |
| CASCADE | `DELETE list` elimina `list_films` asociados |
| Store | Asíncrono via `src/lib/supabase/store.ts` |

## Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `getLists(client, userId)` | `SupabaseClient, string` | `CustomListRow[]` |
| `getListById(client, listId)` | `SupabaseClient, string` | `{ list: CustomListRow; films: ListFilmRow[] } \| null` |
| `createList(client, userId, name, description?)` | `SupabaseClient, string, string, string?` | `CustomListRow` |
| `deleteList(client, listId)` | `SupabaseClient, string` | `void` |
| `addFilmToList(client, film)` | `SupabaseClient, ListFilmInsert` | `void` |
| `removeFilmFromList(client, listId, filmId)` | `SupabaseClient, string, number` | `void` |
| `isFilmInList(client, listId, filmId)` | `SupabaseClient, string, number` | `boolean` |
| `getFilmLists(client, userId, filmId)` | `SupabaseClient, string, number` | `(CustomListRow & { list_films: ListFilmRow[] })[]` |
| `getListFilmCounts(client, userId)` | `SupabaseClient, string` | `Record<string, number>` |

## UI Components

### Perfil — Pestaña "Mis Listas"

El perfil DEBE tener un tab "Mis Listas". El contador de stats DEBE totalizar también la cantidad de listas.

#### Escenario: Grilla de listas
- GIVEN el usuario tiene 3 listas
- WHEN selecciona "Mis Listas"
- THEN ve grilla responsive (2/3/4 cols) con cards
- AND cada card muestra collage ≤4 posters, nombre y film count

#### Escenario: Sin listas
- GIVEN el usuario no creó ninguna lista
- WHEN ve "Mis Listas"
- THEN ve "Todavía no creaste ninguna lista"

### Detalle de Película — Agregar a Lista

`/film/[id]` DEBE mostrar "Agregar a lista..." que abre un Dialog con checkboxes por lista y un campo para crear lista nueva.

#### Escenario: Checkbox refleja pertenencia
- GIVEN dialog abierto para una película
- THEN cada lista aparece con checkbox
- AND si el film ya está en la lista, el checkbox aparece marcado
- WHEN se desmarca → `removeFilmFromList` se ejecuta

#### Escenario: Crear desde dialog
- GIVEN dialog abierto
- WHEN usuario escribe nombre y hace clic en "Crear lista nueva"
- THEN se crea la lista Y el film actual se agrega automáticamente
- WHEN input vacío o solo espacios → botón DEBE estar deshabilitado

### Página `/lists/[listId]`

DEBE mostrar header (nombre, descripción, film count, "Eliminar lista") y grilla responsive de posters.

#### Escenario: Lista con películas
- GIVEN lista con 4 films
- WHEN navega a `/lists/{id}`
- THEN header muestra nombre, descripción, "4 films", botón "Eliminar lista"
- AND grilla de posters (mismo estilo que Guardadas)

#### Escenario: Quitar película
- GIVEN detail page de lista
- WHEN clic en "Quitar de la lista"
- THEN UI se actualiza sin recargar
- AND la lista sigue existiendo si queda vacía

#### Escenario: Lista vacía
- GIVEN lista sin películas
- THEN ve "Esta lista está vacía. Agregá películas desde la página de cada film."

#### Escenario: Lista inexistente
- GIVEN `listId` inválido
- THEN ve "Lista no encontrada" o redirect a perfil

## Textos UI (español rioplatense)

| Contexto | Texto |
|----------|-------|
| Botón film detail | "Agregar a lista..." |
| Tab perfil | "Mis Listas" |
| Placeholder input | "Nombre de la lista" |
| Crear en dialog | "Crear lista nueva" |
| Eliminar lista | "Eliminar lista" |
| Quitar film | "Quitar de la lista" |
| Empty state lista | "Esta lista está vacía. Agregá películas desde la página de cada film." |
| Empty state perfil | "Todavía no creaste ninguna lista" |
| No encontrada | "Lista no encontrada" |

## Scenarios de verificación

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Ciclo de vida completo | CRUD funciona contra `public.custom_lists` + `public.list_films` |
| 2 | CASCADE al borrar lista | DELETE elimina `list_films` asociados |
| 3 | RLS propietario | Usuario B intenta acceder lista de A → 0 filas |
| 4 | Nombres duplicados | Dos listas con mismo `name` se distinguen por `id` |
| 5 | Lista vacía | Empty state sin errores |
