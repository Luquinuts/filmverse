/**
 * migrate-local-data — Script de migración one-time de localStorage a Supabase.
 *
 * ⚠️ HERRAMIENTA DE DESARROLLO — NO EJECUTAR EN PRODUCCIÓN.
 *
 * Este script migra datos de localStorage a Supabase usando service_role.
 * Como localStorage no está disponible en Node.js, se requiere:
 *
 *   Opción A (recomendada): Exportar localStorage a JSON manualmente y ejecutar:
 *      npx tsx src/scripts/migrate-local-data.ts --file ./exported-data.json
 *
 *   Opción B: Agregar un botón/browser-tool en la app que ejecute la migración
 *     desde el navegador usando el admin client o RLS.
 *
 *   Opción C: Usar jsdom/happy-dom para mockear localStorage.
 *
 * Idempotente: usa upsert por ID. Ejecutar múltiples veces no duplica datos.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    '[migrate] Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface LegacyReview {
  id: string;
  filmId: number;
  filmTitle: string;
  filmYear: number | null;
  filmPoster: string | null;
  rating: number;
  content: string;
  isSpoiler: boolean;
  userId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

interface LegacyWatchlistEntry {
  filmId: number;
  filmTitle: string;
  filmYear: number | null;
  filmPoster: string | null;
  addedAt: string;
}

interface LegacyCustomList {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface LegacyFollow {
  userId: string;
  username: string;
}

interface ExportData {
  reviews?: LegacyReview[];
  watchlist?: LegacyWatchlistEntry[];
  customLists?: LegacyCustomList[];
  follows?: LegacyFollow[];
  exportedAt?: string;
}

function parseArgs(): { file?: string } {
  const args = process.argv.slice(2);
  const fileIndex = args.indexOf('--file');
  return {
    file: fileIndex >= 0 ? args[fileIndex + 1] : undefined,
  };
}

async function migrateFromData(data: ExportData) {
  console.log('[migrate] Iniciando migración de datos...\n');

  let totalMigrated = 0;
  let totalErrors = 0;

  // 1. Migrar reseñas
  if (data.reviews && data.reviews.length > 0) {
    console.log(`[migrate] Reseñas encontradas: ${data.reviews.length}`);

    for (const review of data.reviews) {
      const { error } = await supabase.from('reviews').upsert(
        {
          id: review.id,
          user_id: review.userId,
          film_id: review.filmId,
          film_title: review.filmTitle,
          film_year: review.filmYear,
          film_poster: review.filmPoster,
          rating: review.rating,
          content: review.content,
          is_spoiler: review.isSpoiler,
          created_at: review.createdAt,
          updated_at: review.updatedAt,
        },
        { onConflict: 'id' },
      );

      if (error) {
        console.error(`[migrate] Error reseña ${review.id}:`, error.message);
        totalErrors++;
      } else {
        totalMigrated++;
      }
    }
    console.log(`[migrate] ✅ ${data.reviews.length} reseñas procesadas`);
  } else {
    console.log('[migrate] Sin reseñas para migrar');
  }

  // 2. Migrar watchlist (requiere userId — puede omitirse si no hay contexto)
  if (data.watchlist && data.watchlist.length > 0) {
    console.log(
      `[migrate] ⚠️ Watchlist: ${data.watchlist.length} entradas encontradas, pero requieren userId.`,
    );
    console.log(
      '[migrate]    Ejecutar desde el browser con el usuario logueado para migrar watchlist.',
    );
  } else {
    console.log('[migrate] Sin watchlist para migrar');
  }

  // 3. Migrar custom lists (requiere userId)
  if (data.customLists && data.customLists.length > 0) {
    console.log(
      `[migrate] ⚠️ Listas: ${data.customLists.length} encontradas, pero requieren userId.`,
    );
    console.log(
      '[migrate]    Ejecutar desde el browser con el usuario logueado para migrar listas.',
    );
  } else {
    console.log('[migrate] Sin listas para migrar');
  }

  // 4. Migrar follows (requiere userId)
  if (data.follows && data.follows.length > 0) {
    console.log(
      `[migrate] ⚠️ Follows: ${data.follows.length} encontrados, pero requieren userId.`,
    );
    console.log(
      '[migrate]    Ejecutar desde el browser con el usuario logueado para migrar follows.',
    );
  } else {
    console.log('[migrate] Sin follows para migrar');
  }

  console.log(
    `\n[migrate] Migración completada. ${totalMigrated} registros migrados, ${totalErrors} errores.`,
  );
}

async function main() {
  const args = parseArgs();

  if (args.file) {
    // Leer de archivo JSON exportado
    try {
      const fs = await import('fs');
      const raw = fs.readFileSync(args.file, 'utf-8');
      const data: ExportData = JSON.parse(raw);
      await migrateFromData(data);
    } catch (err) {
      console.error('[migrate] Error leyendo archivo:', err);
      process.exit(1);
    }
  } else {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║  migrate-local-data.ts                                      ║
║                                                              ║
║  Este script migra datos de localStorage a Supabase.         ║
║                                                              ║
║  USO:                                                        ║
║    1. Exportá localStorage desde el browser:                  ║
║       copy(JSON.stringify({                                   ║
║         reviews: JSON.parse(localStorage.getItem('filmverse_reviews') || '[]'),║
║         watchlist: JSON.parse(localStorage.getItem('filmverse_watchlist') || '[]'),║
║         customLists: JSON.parse(localStorage.getItem('filmverse_custom_lists') || '[]'),║
║         follows: JSON.parse(localStorage.getItem('filmverse_follows') || '[]'),║
║       }))                                                     ║
║                                                              ║
║    2. Guardá el JSON en un archivo (ej: export.json)          ║
║                                                              ║
║    3. Ejecutá:                                               ║
║       npx tsx src/scripts/migrate-local-data.ts --file ./export.json  ║
║                                                              ║
║  NOTA: Watchlist, listas y follows requieren userId del       ║
║  usuario autenticado. Solo las reseñas se migran con         ║
║  service_role. Para el resto, crear una page/tool en la app  ║
║  que ejecute la migración desde el browser con el usuario    ║
║  logueado.                                                   ║
╚══════════════════════════════════════════════════════════════╝
    `);
  }
}

main().catch((err) => {
  console.error('[migrate] Error fatal:', err);
  process.exit(1);
});
