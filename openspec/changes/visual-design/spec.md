# Visual Design — Cinematic Dark Theme

## Theme Token Spec

Replace the `.dark` class in `globals.css` with the following values. Keep `:root` for light mode (unused — dark-only app). All values in OKLCH.

### Background & Surface

| Token | Current Value | New Value |
|-------|--------------|-----------|
| `--background` | `oklch(0.145 0 0)` | `oklch(0 0 0)` — pure black |
| `--foreground` | `oklch(0.985 0 0)` | `oklch(0.95 0 0)` — off-white |
| `--card` | `oklch(0.205 0 0)` | `oklch(0.12 0 0)` — near-black |
| `--card-foreground` | `oklch(0.985 0 0)` | `oklch(0.95 0 0)` |
| `--popover` | `oklch(0.205 0 0)` | `oklch(0.12 0 0)` |
| `--popover-foreground` | `oklch(0.985 0 0)` | `oklch(0.95 0 0)` |
| `--primary` | `oklch(0.922 0 0)` | Amber accent → see accent row |
| `--primary-foreground` | `oklch(0.205 0 0)` | `oklch(0.05 0 0)` |
| `--secondary` | `oklch(0.269 0 0)` | `oklch(0.18 0 0)` |
| `--secondary-foreground` | `oklch(0.985 0 0)` | `oklch(0.9 0 0)` |
| `--muted` | `oklch(0.269 0 0)` | `oklch(0.15 0 0)` |
| `--muted-foreground` | `oklch(0.708 0 0)` | `oklch(0.5 0 0)` — dim text |
| `--border` | `oklch(1 0 0 / 10%)` | `oklch(1 0 0 / 8%)` — subtler |
| `--input` | `oklch(1 0 0 / 15%)` | `oklch(1 0 0 / 10%)` |

### Accent (Amber/Gold)

| Token | Value |
|-------|-------|
| `--primary` | `oklch(0.72 0.16 75)` — warm amber |
| `--accent` | `oklch(0.72 0.16 75 / 15%)` — tinted bg |
| `--accent-foreground` | `oklch(0.92 0.08 75)` — lighter gold |
| `--ring` | `oklch(0.72 0.16 75 / 40%)` — focus ring |
| `--chart-1` | `oklch(0.7 0.14 75)` |
| `--chart-2` | `oklch(0.6 0.12 75)` |
| `--chart-3` | `oklch(0.5 0.1 75)` |
| `--chart-4` | `oklch(0.8 0.1 75)` |
| `--chart-5` | `oklch(0.65 0.08 45)` |

### Glass Tokens (new)

Add as `@theme` inline variables or `@layer utilities`:

```
--glass-bg: oklch(1 1 0 / 5%);
--glass-border: oklch(1 1 0 / 10%);
--glass-shadow: 0 8px 32px oklch(0 0 0 / 40%);
--glass-blur: 12px;
```

### Radius (unchanged)

Keep current `--radius: 0.625rem` with the existing `@theme` radius scale.

---

## Visual Requirements by Page/Component

### Landing Page Hero

- **Background**: `oklch(0 0 0)` base. Radial gradient from bottom-center: `oklch(0.25 0.1 280 / 40%)` at 50% → `oklch(0 0 0)` at edges. A subtle amber glow (`oklch(0.72 0.16 75 / 6%)`) at top-right.
- **Typography**: Title `text-5xl sm:text-6xl font-bold tracking-tight` — white. Subtitle `text-gray-400`. Description `text-gray-500`.
- **CTAs**: "Crear cuenta" — filled amber (`bg-primary`), "Iniciar sesión" — outlined (`border border-white/10` text `text-foreground`). Both: `rounded-lg px-6 py-3 font-semibold transition-all duration-300`. On hover: filled CTA brightens (`brightness-110`), outlined glows (`border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.15)]`).

### Feature Cards Section

- 6 cards in `grid gap-8 sm:grid-cols-2 lg:grid-cols-3`.
- **Card**: `rounded-xl border border-white/[6%] bg-glass-bg backdrop-blur-[var(--glass-blur)] shadow-glass`. Hover: `border-amber-500/20 shadow-[0_0_20px_rgba(251,191,36,0.08)]`.
- **Title**: `font-semibold text-white`.
- **Description**: `text-sm leading-relaxed text-muted-foreground`.

### Auth Pages (Login, Register, Reset-Password)

- **Layout** (`(auth)/layout.tsx`): `min-h-screen flex items-center justify-center px-4`. Background: same radial gradient as hero (purple wash).
- **Card** (`<Card>` from shadcn/ui): border `border-white/[6%]`, bg `bg-card` (near-black), with glass shadow.
- **CardTitle**: `text-xl text-white`.
- **Inputs**: Use shadcn/ui `Input` — already styled by tokens. Focus ring amber (`ring-primary/40`).
- **Links** (forgot password, register/login redirect): `text-amber-400/80 hover:text-amber-300 transition-colors`.
- **Error alert**: `rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400`.

### Navbar (Desktop + Mobile)

- **Container**: `sticky top-0 z-50 border-b border-white/[6%] bg-glass-bg backdrop-blur-[var(--glass-blur)]`.
- **Logo**: `text-xl font-bold tracking-tight text-white`. Hover: `text-amber-400`.
- **Desktop nav links**: `text-sm font-medium text-muted-foreground transition-colors hover:text-amber-400`.
- **Desktop CTA button** ("Crear cuenta"): `rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all`.
- **Mobile menu**: dropdown with same glass bg, border `border-white/[6%]`. Hamburger icon `text-muted-foreground hover:text-amber-400`.
- **Search input**: within navbar — glass style (see SearchInput below).

### Search Page

- **Page**: `bg-background` (pure black).
- **Heading**: `text-2xl font-bold text-white`.
- **SearchInput**: `rounded-lg border border-white/10 bg-glass-bg py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-[var(--glass-blur)] transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/30`.
- **Result count**: `text-sm text-muted-foreground`.
- **Empty/initial states**: `text-center text-muted-foreground`.

### Film Detail Page

- **Backdrop hero**: `relative h-[50vh] w-full overflow-hidden`. Gradient overlay: `bg-gradient-to-t from-background via-background/80 to-transparent`.
- **Poster**: `aspect-[2/3] w-48 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)]`. Border `border border-white/[4%]`.
- **Title**: `text-3xl font-bold text-white`.
- **Tagline**: `text-sm italic text-muted-foreground`.
- **Meta icons** (Calendar, Clock, Star): `text-amber-400/70`. Star fill: `fill-amber-400 text-amber-400`.
- **Genre pills**: `rounded-full border border-white/[6%] bg-glass-bg px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm`.
- **Overview**: `max-w-2xl leading-relaxed text-muted-foreground`.
- **Section headings** ("Reparto", "Películas similares"): `text-xl font-bold text-white`.

### MovieCard

- **Container**: `group relative flex flex-col overflow-hidden rounded-xl border border-white/[6%] bg-card transition-all duration-300`. Hover: `scale-105 shadow-[0_0_25px_rgba(251,191,36,0.15)] border-amber-500/30`.
- **Poster**: `aspect-[2/3] w-full overflow-hidden`. Image `object-cover transition-transform duration-300 group-hover:scale-110`. No-poster fallback: `bg-muted` with film icon in `text-muted-foreground`.
- **Info**: `flex flex-1 flex-col gap-1 p-3`.
- **Title**: `line-clamp-2 text-sm font-semibold leading-tight text-foreground group-hover:text-white`.
- **Year**: `text-xs text-muted-foreground`.
- **Rating**: `flex items-center gap-1 text-xs`. Star: `fill-amber-400 text-amber-400`. Number: `text-amber-400/80`.

### MovieGrid

- **Container**: `grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`. No visual changes needed — structural only. Already correct.

### CastCard

- **Container**: `flex flex-col items-center gap-2 text-center`.
- **Photo**: `size-16 overflow-hidden rounded-full border-2 border-white/[6%]`. Hover: `border-amber-400/40 transition-colors duration-300`. No-photo fallback: `bg-muted flex items-center justify-center`.
- **Name**: `truncate text-sm font-semibold text-foreground`.
- **Character**: `truncate text-xs text-muted-foreground`.

### SimilarCarousel

- **Section heading**: `text-xl font-bold text-white`.
- **Scroll container**: `flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory`. Custom scrollbar: `scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10`.
- Each item: `min-w-[160px] max-w-[160px] flex-shrink-0 snap-start`. Uses MovieCard inside.

### TrendingSection

- **Section heading**: `text-2xl font-bold text-white`. No visual changes needed — delegates to MovieGrid + MovieCard for visuals.
- **Loading state**: skeleton shimmer (see Animation Spec).
- **Error state**: glass card with error message.
- **Empty state**: same glass card with "No hay películas" message.

### Loading / Error / Empty States (all components)

| State | Visual Treatment |
|-------|-----------------|
| **Loading** | Skeleton placeholders with shimmer animation. `bg-glass-bg` base, `rounded-xl` for rectangles. |
| **Error** | `rounded-lg border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-muted-foreground` — glass feel. |
| **Empty** | `rounded-lg border border-white/[6%] bg-glass-bg p-6 text-center text-sm text-muted-foreground` — glass feel. |
| **Not found** | Same as empty. |

---

## Animation Spec

### Shimmer Loading

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    oklch(0.12 0 0) 25%,
    oklch(0.18 0 0) 50%,
    oklch(0.12 0 0) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

Apply via `bg-[oklch(0.12_0_0)] animate-shimmer` or as a utility class `skeleton`. Replaces current `animate-pulse` with smoother shimmer.

### Fade-In on Page Load

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}
```

Apply to `<main>` content containers. Stagger children via `animation-delay` if desired.

### Glow Pulse on Hover

```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px oklch(0.72 0.16 75 / 20%); }
  50% { box-shadow: 0 0 20px oklch(0.72 0.16 75 / 40%); }
}
```

Used on MovieCard hover, CTA hover, Navbar logo hover.

### Transition Durations and Easings

| Property | Duration | Easing |
|----------|----------|--------|
| Color (hover, link) | 200ms | `ease-out` |
| Transform (scale) | 300ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` — spring |
| Border/shadow | 300ms | `ease-out` |
| Opacity | 300ms | `ease-out` |
| Backdrop blur | 200ms | `ease-out` |

---

## Delta Summary

No behavioral specs exist in `openspec/specs/` for visual design. This is a pure visual delta against the existing codebase. All changes are CSS/token-only — no component logic, props, or API contracts are modified.

**Status**: success
**Summary**: Visual design spec for cinematic dark theme. Defines OKLCH tokens, per-component visuals, animations, and state coverage.
**Artifacts**: `openspec/changes/visual-design/spec.md`
**Next**: sdd-design
**Risks**: Amber accent must pass WCAG AA contrast on all surfaces (background `oklch(0 0 0)` + amber `oklch(0.72 0.16 75)` → ratio ~8.5:1 — passes). But on `--card` (`oklch(0.12 0 0)`) it needs re-check.
**Skill Resolution**: none — no external skills loaded
