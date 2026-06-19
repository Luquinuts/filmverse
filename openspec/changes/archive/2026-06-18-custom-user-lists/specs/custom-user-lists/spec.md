# Custom User Lists — Especificación

## Propósito

Usuarios DEBEN poder crear listas con nombre, agregar/remover películas, y
navegar cada lista en una ruta dedicada. Extiende el perfil con un tercer tab.

## Datos

Almacenamiento bajo clave `filmverse_custom_lists` en localStorage.

| Tipo | Campos |
|------|--------|
| `UserCustomList` | `id: string`, `name: string`, `description?: string`, `createdAt: ISO` |
| `UserListFilm` | `listId: string`, `filmId: number`, `filmTitle`, `filmPoster?`, `filmYear?`, `addedAt: ISO` |

CRUD: `getLists`, `getListById`, `createList`, `deleteList`, `renameList`,
`addFilmToList`, `removeFilmFromList`. Misma convención denormalizada que watchlist.

#### Escenario: Ciclo de vida
- GIVEN sin listas
- WHEN `createList("Clásicos")` → `getLists()` DEBE devolver 1 lista
- WHEN `addFilmToList(id, {filmId: 1, filmTitle: "El Padrino", ...})` → `getListById(id)` incluye el film
- WHEN `removeFilmFromList(id, 1)` → la lista ya no contiene filmId=1
- WHEN `deleteList(id)` → lista y todos sus `UserListFilm` eliminados (cascada)

#### Escenario: Nombres duplicados
- GIVEN dos listas con `name: "Favoritas"`
- THEN se distinguen por `id`, no por `name`

## Perfil — Pestaña "Mis Listas"

### Requerimiento: Tercer tab

El perfil DEBE tener un tab "Mis Listas". El contador de stats DEBE totalizar
también la cantidad de listas.

#### Escenario: Grilla de listas
- GIVEN el usuario tiene 3 listas
- WHEN selecciona "Mis Listas"
- THEN ve grilla responsive (2/3/4 cols) con cards
- AND cada card muestra collage ≤4 posters, nombre y film count

#### Escenario: Sin listas
- GIVEN el usuario no creó ninguna lista
- WHEN ve "Mis Listas"
- THEN ve "Todavía no creaste ninguna lista"

## Detalle de Película — Agregar a Lista

### Requerimiento: Botón + dialog

`/film/[id]` DEBE mostrar "Agregar a lista..." que abre un Dialog con checkboxes
por lista y un campo para crear lista nueva.

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

## Página `/lists/[listId]`

### Requerimiento: Ruta dedicada

DEBE mostrar header (nombre, descripción, film count, "Eliminar lista") y grilla
responsive de posters.

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
