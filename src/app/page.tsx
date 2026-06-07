import Link from 'next/link';
import { TrendingSection } from '@/components/home/trending-section';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4">
      {/* Hero */}
      <section className="mx-auto mt-16 max-w-3xl text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-6xl">
          FilmVerse
        </h1>
        <p className="mb-6 text-xl text-gray-400">
          La red social para cinéfilos. Descubrí películas, compartí reseñas y
          conectá con otros amantes del cine.
        </p>
        <p className="mb-10 text-base text-gray-500">
          Creá tu perfil, armá tus listas personalizadas, seguí a otros usuarios
          y recibí recomendaciones con IA. Todo en un solo lugar.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Crear cuenta
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-700 px-6 py-3 font-semibold text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            Iniciar sesión
          </Link>
        </div>
      </section>

      {/* Trending */}
      <section className="mt-24 w-full">
        <TrendingSection />
      </section>

      {/* Features */}
      <section className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Catálogo completo"
          description="Explorá miles de películas con datos de TMDB. Buscá por título, género o tendencias."
        />
        <FeatureCard
          title="Reseñas y puntuaciones"
          description="Calificá películas del 1 al 10 y escribí reseñas. Descubrí qué opinan otros usuarios."
        />
        <FeatureCard
          title="Recomendaciones con IA"
          description="Recibí sugerencias personalizadas basadas en tus gustos y actividad con Gemini."
        />
        <FeatureCard
          title="Listas personalizadas"
          description="Armá tus propias listas de películas y compartilas con la comunidad."
        />
        <FeatureCard
          title="Red social"
          description="Seguí a otros cinéfilos, dale like a reseñas y armá tu feed de actividad."
        />
        <FeatureCard
          title="Suscripción premium"
          description="Accedé a funciones exclusivas, estadísticas detalladas y sin publicidad."
        />
      </section>

      {/* Footer */}
      <footer className="mt-24 pb-8 text-sm text-gray-600">
        <p>FilmVerse — Proyecto académico ISW III, Universidad Atlántida Argentina</p>
      </footer>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
      <h3 className="mb-2 font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-400">{description}</p>
    </article>
  );
}
