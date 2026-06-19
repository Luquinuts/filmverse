import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import { Navbar } from '@/components/layout/navbar';
import { FilmIntelligence } from '@/components/ai/film-intelligence';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FilmVerse',
  description:
    'FilmVerse — La red social para cinéfilos. Descubrí, reseñá y compartí tu pasión por el cine.',
  keywords: ['cine', 'películas', 'red social', 'reseñas', 'FilmVerse'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn(inter.className, "font-sans", geist.variable, "dark")}>
      <body className="bg-background text-foreground">
        <Navbar />
        <main className="pt-16">{children}</main>
        <FilmIntelligence />
      </body>
    </html>
  );
}
