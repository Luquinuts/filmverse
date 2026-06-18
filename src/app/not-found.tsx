import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-7xl font-bold text-cinema-gold">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-white">
        Página no encontrada
      </h2>
      <p className="mb-8 max-w-md text-gray-400">
        Parece que esta página no existe. Podría haberse movido o la dirección
        es incorrecta.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-cinema-gold px-6 py-3 font-semibold text-black transition-all duration-300 hover:bg-cinema-amber"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
