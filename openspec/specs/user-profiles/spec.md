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
| Columna `role` | Valores válidos: `cinefilo` (default), `premium`, `moderador`, `admin` |
| Perfil inicial | `id = auth.uid()`, `username` (de `raw_user_meta_data` o email), `avatar_url = null`, `role = 'cinefilo'` |

## Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `getProfile(client, userId)` | `SupabaseClient, string` | `ProfileRow \| null` (incluye `role`) |
| `updateProfile(client, userId, data)` | `SupabaseClient, string, { username?, avatar_url? }` | `void` — `role` NO DEBE modificarse (se ignora/rechaza) |

## Scenarios de verificación

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Registro con username único | Trigger crea profile con ese username y `role = 'cinefilo'` |
| 2 | Registro con username duplicado | Trigger auto-incrementa (ej: `user` → `user1`) y asigna `role = 'cinefilo'` |
| 3 | SELECT público | Cualquier usuario ve todos los profiles incluyendo la columna `role` |
| 4 | UPDATE perfil ajeno | RLS rechaza (0 filas afectadas) |
| 5 | `getProfile` incluye `role` | Retorna `ProfileRow` con `role = 'premium'` para un perfil premium |
| 6 | `updateProfile` rechaza `role` | Campo `role` no se modifica (ignorado/rechazado) |
| 7 | Suscripción activa asigna premium | Rol se actualiza a `premium` vía webhook |
| 8 | Cancelación/expiración revierte a cinefilo | Rol se revierte a `cinefilo` |

## Transición de rol por suscripción

El rol del perfil DEBE actualizarse automáticamente cuando cambia el estado de la suscripción premium del usuario.

| Evento | Acción |
|--------|--------|
| Webhook de suscripción activa | `profiles.role` → `premium` |
| Cancelación o expiración de suscripción | `profiles.role` → `cinefilo` |

El rol solo se modifica vía webhook de MercadoPago — `updateProfile` NO DEBE permitir cambiar `role`.
