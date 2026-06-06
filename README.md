# FilmVerse 🎬

Plataforma social para cinéfilos — descubrí, reseñá y compartí tu pasión por el cine.

Proyecto académico — ISW III, Universidad Atlántida Argentina.

---

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com) |
| Base de datos | PostgreSQL (via [Supabase](https://supabase.com)) |
| Autenticación | Supabase Auth (email/password + OAuth) |
| API externa | [TMDB](https://developer.themoviedb.org) (catálogo de películas) |
| IA | [Gemini](https://ai.google.dev) (recomendaciones) |
| Pagos | Mercado Pago (suscripciones premium) |
| CI/CD | GitHub Actions + Vercel |
| Linting | ESLint + Prettier |

---

## Setup

### Prerrequisitos

- Node.js 18+ (recomendado 20)
- npm
- Cuenta en [Supabase](https://supabase.com) (gratuita)
- API key de [TMDB](https://developer.themoviedb.org) (gratuita)
- API key de [Gemini](https://ai.google.dev) (gratuita)
- [OAuth Client ID de Google](https://console.cloud.google.com/apis/credentials) (para login con Google)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd filmverse

# 2. Configurar variables de entorno
cp .env.template .env.local

# 3. Editar .env.local con tus credenciales
#    (ver sección Variables de Entorno abajo)

# 4. Instalar dependencias
npm install

# 5. Aplicar migraciones de Supabase
npx supabase link --project-ref <tu-project-ref>
npx supabase migration up

# 6. Iniciar servidor de desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

### Configurar Supabase Auth

1. En el dashboard de Supabase, andá a **Authentication → Providers**
2. Activá **Email** (ya viene activado por defecto)
3. Activá **Google** y configurá el Client ID y Client Secret desde Google Cloud Console
4. En **URL Configuration**, agregá `http://localhost:3000/auth/callback` como Redirect URL (y la URL de producción en Vercel)
5. En **Authentication → Settings**, configurá la URL del sitio como `http://localhost:3000`

---

## Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (admin) | ✅ |
| `TMDB_API_KEY` | API key de TMDB v3 | ✅ |
| `TMDB_API_TOKEN` | Token de acceso a TMDB (alternativa) | ❌ |
| `GEMINI_API_KEY` | API key de Google Gemini | ✅ |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de acceso a Mercado Pago | ❌ (stub) |
| `NEXT_PUBLIC_APP_URL` | URL base de la aplicación | ❌ (default: localhost:3000) |

Ver `.env.template` para todas las variables.

---

## Estructura del Proyecto

```
filmverse/
├── .github/workflows/       # CI (GitHub Actions)
├── openspec/                 # Documentación SDD (propuestas, diseño, tareas)
├── references/               # Documentación original del proyecto (ERS, casos de uso)
├── src/
│   ├── app/
│   │   ├── (auth)/           # Grupo de rutas de autenticación
│   │   │   ├── login/        # Inicio de sesión
│   │   │   ├── register/     # Registro de usuario
│   │   │   └── auth/         # Callback OAuth + recuperación de contraseña
│   │   ├── globals.css       # Estilos globales + Tailwind + shadcn/ui
│   │   ├── layout.tsx        # Layout raíz
│   │   ├── page.tsx          # Landing page
│   │   └── not-found.tsx     # Página 404
│   ├── components/
│   │   ├── auth/             # Componentes de autenticación
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── reset-password-form.tsx
│   │   │   └── oauth-button.tsx
│   │   └── ui/               # shadcn/ui primitives
│   ├── lib/
│   │   ├── types.ts          # Tipos de dominio y base de datos
│   │   ├── tmdb.ts           # Cliente API TMDB
│   │   ├── gemini.ts         # Cliente API Gemini
│   │   ├── mercadopago.ts    # Cliente Mercado Pago (stub)
│   │   └── supabase/         # Helpers de Supabase
│   ├── middleware.ts         # Auth guard (protege rutas privadas)
├── supabase/migrations/      # Migraciones SQL
├── .env.template             # Template de variables de entorno
├── components.json           # Configuración de shadcn/ui
├── .eslintrc.json            # ESLint
├── .prettierrc               # Prettier
├── next.config.js            # Next.js
├── tsconfig.json             # TypeScript
└── package.json
```

---

## Comandos Útiles

```bash
npm run dev     # Iniciar servidor de desarrollo
npm run build   # Build de producción
npm run start   # Iniciar servidor de producción
npm run lint    # Ejecutar linter
```

---

## Licencia

Proyecto académico — sin licencia específica.
