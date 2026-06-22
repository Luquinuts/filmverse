# Premium Subscriptions — Especificación

## Propósito

Suscripciones premium gestionadas mediante MercadoPago. Los usuarios adquieren el rol `premium` a través de pagos recurrentes. Un webhook de MercadoPago actualiza el estado de la suscripción y el rol del perfil automáticamente.

## Datos

| Concepto | Detalle |
|----------|---------|
| Tabla | `public.premium_subscriptions` |
| PK | `id` UUID, default `gen_random_uuid()` |
| FK | `user_id` → `public.profiles(id)` ON DELETE CASCADE |
| Columnas | `user_id`, `status`, `mercadopago_subscription_id`, `start_date`, `end_date`, `created_at`, `updated_at` |
| Status válidos | `active`, `cancelled`, `expired`, `past_due` |
| RLS | SELECT propia; INSERT/UPDATE solo vía `service_role` o funciones SECURITY DEFINER |
| Restricción | Un usuario DEBE tener como máximo una suscripción activa |

## Reglas de negocio

| Evento | Acción |
|--------|--------|
| Webhook `subscription_created` con status `authorized` o `active` | Insertar suscripción con status `active`, actualizar perfil a rol `premium` |
| Webhook `subscription_cancelled` | Actualizar suscripción a `cancelled` con `end_date = now()`, revertir perfil a `cinefilo` |
| Webhook `subscription_expired` | Actualizar suscripción a `expired`, revertir perfil a `cinefilo` |
| Webhook `subscription_updated` (status no terminal) | Reflejar el nuevo status sin cambiar rol |
| Cancelación desde la app | Ejecutar solicitud a API de MP, actualizar a `cancelled`, revertir perfil |
| Webhook duplicado | Ignorar si el mismo `mercadopago_subscription_id` + tipo de evento ya fue procesado |

## Contrato de API

| Función | Input | Output |
|---------|-------|--------|
| `createSubscriptionPreference(client, userId, planId)` | `SupabaseClient, string, string` | `{ preferenceId, initPoint }` |
| `getUserSubscription(client, userId)` | `SupabaseClient, string` | `PremiumSubscription \| null` |
| `cancelSubscription(client, userId)` | `SupabaseClient, string` | `void` |
| `handleMercadoPagoWebhook(event)` | `MercadoPagoWebhookEvent` (uso interno) | `void` |

## Escenarios de verificación

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Usuario sin suscripción activa crea preferencia | Se genera `preferenceId` e `initPoint` |
| 2 | Webhook `subscription_created` con status activo | Se inserta suscripción con status `active`, perfil pasa a `premium` |
| 3 | Webhook `subscription_cancelled` | Suscripción → `cancelled`, `end_date` se setea, perfil revierte a `cinefilo` |
| 4 | Webhook `subscription_expired` | Suscripción → `expired`, perfil revierte a `cinefilo` |
| 5 | Usuario con suscripción activa cancela desde la app | Suscripción → `cancelled`, perfil revierte a `cinefilo` |
| 6 | SELECT sobre suscripción ajena | RLS rechaza (0 filas) |
| 7 | Webhook duplicado (mismo evento + subscription_id) | Se ignora — no hay duplicación de suscripciones ni cambios de rol |
| 8 | Intento de INSERT directo desde el cliente | RLS rechaza (solo service_role o SECURITY DEFINER) |
