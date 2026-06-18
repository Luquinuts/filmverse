'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SearchInput } from '@/components/catalog/search-input';

export function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setIsLoggedIn(true);
        setUsername(
          (data.user.user_metadata?.username as string) ??
            data.user.email?.split('@')[0] ??
            'Usuario',
        );
      }
    });
  }, [supabase.auth]);

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

          {isLoggedIn ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-cinema-gold"
            >
              <User className="size-4" />
              {username}
            </Link>
          ) : (
            <>
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
            </>
          )}
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
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-cinema-gold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="size-4" />
                {username}
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
