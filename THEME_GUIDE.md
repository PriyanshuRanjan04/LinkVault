# Theme System Quick Reference

## Using Theme-Aware Colors in Components

Instead of hardcoding dark colors like `bg-zinc-900`, use these semantic classes:

### Backgrounds
- `bg-background` - Main page background (white/zinc-950)
- `bg-card` - Card backgrounds (zinc-50/zinc-900)
- `bg-muted` - Muted sections (zinc-100/zinc-800)

### Text
- `text-foreground` - Primary text (near-black/zinc-50)
- `text-muted-foreground` - Secondary text (zinc-500/zinc-400)

### Borders
- `border-border` - Standard borders (zinc-200/zinc-800)

### Example Refactor

**Before (dark only):**
```tsx
<div className="bg-zinc-900 text-zinc-100 border-zinc-700">
```

**After (theme-aware):**
```tsx
<div className="bg-card text-foreground border-border">
```

## Component Update Strategy

To make your app theme-aware, update these files:
1. `app/dashboard/page.tsx` - Dashboard background
2. `components/AddBookmark.tsx` - Form backgrounds
3. `components/BookmarkCard.tsx` - Card styles
4. `components/DashboardClient.tsx` - Main layout

Replace hardcoded zinc colors with semantic variables above.
