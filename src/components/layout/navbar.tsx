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
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white hover:text-indigo-400 transition-colors"
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
            className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Crear cuenta
          </Link>
        </div>

        {/* Mobile: hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-300 transition-colors hover:text-white md:hidden"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-800 bg-gray-950 px-4 pb-4 md:hidden">
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
              className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
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
