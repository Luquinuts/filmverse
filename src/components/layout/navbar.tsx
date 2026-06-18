'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { SearchInput } from '@/components/catalog/search-input';

export function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="sticky top-0 z-50 glass border-cinema-gold/20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white hover:text-cinema-gold transition-colors"
        >
          FilmVerse
        </Link>

        {/* Desktop: search + auth links */}
        <div className="hidden items-center gap-4 md:flex">
          <SearchInput
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            placeholder="Buscá películas..."
          />
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-cinema-gold"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-cinema-gold px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-cinema-amber"
          >
            Crear cuenta
          </Link>
        </div>

        {/* Mobile: hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-muted-foreground transition-colors hover:text-cinema-gold md:hidden"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-cinema-gold/20 glass px-4 pb-4 md:hidden">
          <div className="mt-3">
            <SearchInput
              value={query}
              onChange={setQuery}
              onSubmit={() => {
                handleSearch();
                setMobileMenuOpen(false);
              }}
              placeholder="Buscá películas..."
            />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-cinema-gold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-cinema-gold px-4 py-2 text-center text-sm font-semibold text-black transition-colors hover:bg-cinema-amber"
              onClick={() => setMobileMenuOpen(false)}
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
