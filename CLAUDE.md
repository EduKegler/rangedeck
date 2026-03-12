# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RangeDeck is a free poker range builder web app for creating, visualizing, and studying Texas Hold'em hand ranges. Fully client-side — no backend, no database. Data persists in localStorage, settings in cookies. Deployed at rangedeck.kegler.dev.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint (flat config, next core-web-vitals + typescript)
```

No test framework is configured yet.

## Tech Stack

- **Next.js 16** (App Router, React 19, React Compiler enabled)
- **TypeScript** (strict mode, path alias `@/*` → project root)
- **Tailwind CSS 4** (via @tailwindcss/postcss, theme in globals.css)
- **HeroUI v2** (@heroui/react) — component library
- **Zustand 5** — state management with localStorage/cookie persistence
- **@dnd-kit** — drag and drop for ranges, categories, and labels
- **Motion** — animations
- **Lucide React** — icons

## Architecture

```
app/
├── page.tsx                    → RangeList (home — lists ranges by category)
├── edit/[rangeId]/page.tsx     → RangeEditor (13×13 interactive grid)
├── components/                 → React components
├── stores/                     → Zustand stores
│   ├── rangesStore.ts          → Ranges, labels, categories, undo/redo history
│   ├── settingsStore.ts        → Grid font size, card size (cookie persist)
│   └── toastStore.ts           → Transient notifications
├── types/                      → TypeScript type definitions
├── utils/                      → Poker hand utilities (combos, grid data)
├── hooks/                      → useDarkMode, useFocusTrap
└── lib/                        → Analytics, settings helpers
```

### Key Patterns

- **State**: All application state lives in Zustand stores with persistence middleware. `rangesStore` uses localStorage (`rangedeck-ranges`), `settingsStore` uses cookies (`rangedeck-settings`).
- **Undo/Redo**: `rangesStore` maintains a history stack for hand edits in the range editor.
- **Export/Import**: Ranges can be exported/imported as compressed JSON files (lz-string).
- **Modals**: Loaded via `next/dynamic` — `RangeCreateModal`, `CategoryModal`, `LabelModal`, `ConfirmModal`, `SettingsModal`.
- **Poker Grid**: 13×13 grid representing all 169 starting hands. Each cell can have multiple labels. Combos: pairs=6, suited=4, offsuit=12.

### Core Types

- `Label` — `{id, name, color}` — up to 6 per range
- `RangeData` — `{labels[], hands{}, customName?}` — the range content
- `RangeDefinition` — `{id, name, categoryId}` — range metadata
- `Category` — `{id, name}` — groups ranges (Opens, Responses, Blinds, 3Bet, custom)

## UI Components

The project uses **HeroUI** as its component library for complex widgets (Input, etc.). For buttons, use the custom `Button` component from `app/components/button.tsx` — it provides variant-based styling (`primary`, `secondary`, `ghost`, `danger`, `warning`) aligned with the neon design system. The `buttonVariants()` export can style non-button elements (e.g., `<label>` for file inputs). Always check existing components in `app/components/` before creating new ones.

### Tailwind CSS 4 — Custom Classes

Custom CSS classes with `:hover` or other pseudo-classes **must** be wrapped in `@layer components { }` in `globals.css`, otherwise Tailwind v4 tree-shakes them from the output.
