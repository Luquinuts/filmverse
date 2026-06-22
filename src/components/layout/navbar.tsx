'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, Rss, Shield, Crown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SearchInput } from '@/components/catalog/search-input';

export function Navbar() {
  const router = useRouter();
  const supabase = useRef(createClient()).current;

  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [username, setUsername] = useState('');

  const checkAdmin = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    setIsAdmin(data?.role === 'admin');
    setIsPremium(data?.role === 'premium');
  }, [supabase]);

  useEffect(() => {
    // Initial auth check
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setIsLoggedIn(true);
        setUsername(
          (data.user.user_metadata?.username as string) ??
            data.user.email?.split('@')[0] ??
            'Usuario',
        );
        checkAdmin(data.user.id);
      }
    });

    // Listen for auth changes (login/logout) reactively
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setIsLoggedIn(true);
          setUsername(
            session.user.user_metadata?.username as string ??
              session.user.email?.split('@')[0] ??
              'Usuario',
          );
          checkAdmin(session.user.id);
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setIsPremium(false);
          setUsername('');
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth, checkAdmin]);

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
            <>
              <Link
                href="/feed"
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cinema-gold"
              >
                <Rss className="size-4" />
                Feed
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/reports"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cinema-gold"
                >
                  <Shield className="size-4" />
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-cinema-gold"
              >
                <User className="size-4" />
                {username}
                {isPremium && <Crown className="size-3.5 text-cinema-gold" />}
              </Link>
            </>
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
              <>
                <Link
                  href="/feed"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cinema-gold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Rss className="size-4" />
                  Feed
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin/reports"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-cinema-gold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="size-4" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-cinema-gold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="size-4" />
                  {username}
                  {isPremium && <Crown className="size-3.5 text-cinema-gold" />}
                </Link>
              </>
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
