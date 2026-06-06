import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FilmVerse — Autenticación',
  description:
    'Iniciá sesión o creá tu cuenta en FilmVerse, la red social para cinéfilos.',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className} min-h-screen flex items-center justify-center bg-gray-950 px-4`}>
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Branding */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            FilmVerse
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            La red social para cinéfilos
          </p>
        </div>

        {/* Card container */}
        {children}
      </div>
    </div>
  );
}
