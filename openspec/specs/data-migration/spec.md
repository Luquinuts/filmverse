# Data Migration — Especificación

## Propósito

Script one-time para migrar datos existentes en localStorage (`filmverse_reviews`, `filmverse_watchlist`, `filmverse_custom_lists`, `filmverse_follows`) a Supabase.

## Requerimientos

- El script DEBE ejecutarse con `service_role` (bypass RLS) para migrar datos históricos
- El script DEBE ser idempotente: si un registro ya existe, lo omite (upsert por ID)
- El script DEBE loggear cada paso (registros migrados, omitidos, errores)
- Watchlist/listas/follows requieren userId contextual (documentado en el script)

## Ubicación

`src/scripts/migrate-local-data.ts`. Script autónomo ejecutable con `tsx`. Sin interfaz de componentes. Ejecución manual.

## Scenarios de verificación

| # | Escenario | Expectativa |
|---|-----------|-------------|
| 1 | Migración completa | Todos los registros existen en Supabase |
| 2 | Datos duplicados | Omite sin errores (idempotente) |
| 3 | Sin datos locales | Log "Sin datos para migrar", sin inserts |
| 4 | Error de conexión | Logea error, detiene migración |
