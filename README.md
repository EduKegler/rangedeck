# RangeDeck

A free poker range builder for creating, visualizing, and studying Texas Hold'em starting hand ranges.

**[Open RangeDeck →](https://rangedeck.kegler.dev)**

## About

RangeDeck is a 100% client-side web app — no backend, no sign-up, no data leaves your browser. Ranges are saved to localStorage and settings to cookies, so everything persists across sessions.

## Features

- **13×13 Interactive Grid** — all 169 starting hands with combo counts (pairs=6, suited=4, offsuit=12)
- **Labels** — color-code hands with up to 6 labels per range
- **Categories** — organize ranges into groups (Opens, Responses, Blinds, 3Bet, or custom)
- **Drag & Drop** — reorder ranges, categories, and labels
- **Export/Import** — share ranges as compressed JSON files
- **Undo/Redo** — full history stack for hand edits
- **Dark Mode** — automatic detection with manual toggle
- **Auto-Save** — all changes persist instantly to localStorage

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, React 19, React Compiler)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [HeroUI v2](https://www.heroui.com/) (component library)
- [Zustand 5](https://zustand.docs.pmnd.rs/) (state management)
- [@dnd-kit](https://dndkit.com/) (drag and drop)
- [Motion](https://motion.dev/) (animations)
- [Lucide React](https://lucide.dev/) (icons)

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Commands

| Command      | Description      |
| ------------ | ---------------- |
| `pnpm dev`   | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint`  | Run ESLint       |
