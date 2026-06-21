# User Profiles — Especificación

## Propósito

Perfiles de usuario vinculados a `auth.users`. Se crean automáticamente vía trigger `on_auth_user_created` y se almacenan en `public.profiles`.

## Datos

| Concepto | Detalle |
|----------|---------|
| Tabla | `public.profiles` |
| Trigger | `on_auth_user_created` — inserta perfil al registrarse |
| RLS | SELECT público, INSERT/UPDATE solo `auth.uid() = id` |
| Username | Único garantizado por el trigger (auto-incrementa si existe conflicto) |
| Perfil inicial | `id = auth.uid()`, `username` (de `raw_user_meta_data` o email), `avatar_url = null` |

## Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `getProfile(client, userId)` | `SupabaseClient, string` | `ProfileRow \| null` |
| `updateProfile(client, userId, data)` | `SupabaseClient, string, { username?, avatar_url? }` | `void` |

## Scenarios de verificación

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Registro con username único | Trigger crea profile con ese username |
| 2 | Registro con username duplicado | Trigger auto-incrementa (ej: `user` → `user1`) |
| 3 | SELECT público | Cualquier usuario ve todos los profiles |
| 4 | UPDATE perfil ajeno | RLS rechaza (0 filas afectadas) |
