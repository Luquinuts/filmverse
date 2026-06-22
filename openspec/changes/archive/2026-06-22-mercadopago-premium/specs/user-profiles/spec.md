# Delta para User Profiles

## REQUISITOS MODIFICADOS

### Requisito: Datos de perfil

La tabla `public.profiles` DEBE incluir una columna `role` con valores válidos `cinefilo`, `premium`, `moderador`, `admin`. El valor por defecto DEBE ser `cinefilo`.
(Previamente: sin columna role — el perfil solo contenía id, username, avatar_url)

#### Escenario: Registro con username único

- DADO un nuevo registro en `auth.users`
- CUANDO el trigger `on_auth_user_created` se ejecuta
- ENTONCES el perfil se crea con `username` único y `role = 'cinefilo'`

#### Escenario: Registro con username duplicado

- DADO un registro en `auth.users` con username existente
- CUANDO el trigger `on_auth_user_created` se ejecuta
- ENTONCES auto-incrementa el username (ej: `user` → `user1`) y asigna `role = 'cinefilo'`

#### Escenario: SELECT público de perfiles

- DADO cualquier usuario autenticado
- CUANDO ejecuta SELECT en `public.profiles`
- ENTONCES ve todos los perfiles incluyendo la columna `role`

#### Escenario: UPDATE de perfil ajeno

- DADO un usuario autenticado
- CUANDO intenta UPDATE sobre un perfil con `id <> auth.uid()`
- ENTONCES RLS rechaza (0 filas afectadas)

### Requisito: Contrato de API

Las funciones `getProfile` y `updateProfile` DEBEN retornar/aceptar el campo `role`. `updateProfile` NO DEBE permitir modificar `role` — el rol solo se actualiza vía suscripción premium.
(Previamente: role no existía en el perfil ni en la API)

#### Escenario: getProfile incluye role

- DADO un perfil existente con rol `premium`
- CUANDO se llama `getProfile(client, userId)`
- ENTONCES retorna `ProfileRow` con `role = 'premium'`

#### Escenario: updateProfile rechaza role

- DADO un usuario autenticado
- CUANDO intenta `updateProfile(client, userId, { role: 'premium' })`
- ENTONCES el campo `role` NO DEBE ser modificado (se ignora o rechaza)

## REQUISITOS AGREGADOS

### Requisito: Transición de rol por suscripción

El rol del perfil DEBE actualizarse automáticamente cuando cambia el estado de la suscripción premium del usuario.

#### Escenario: Suscripción activa asigna premium

- DADO un usuario con rol `cinefilo`
- CUANDO se recibe un webhook de suscripción activa
- ENTONCES el rol del perfil DEBE actualizarse a `premium`

#### Escenario: Cancelación/expiración revierte a cinefilo

- DADO un usuario con rol `premium`
- CUANDO la suscripción se cancela o expira
- ENTONCES el rol del perfil DEBE revertirse a `cinefilo`
