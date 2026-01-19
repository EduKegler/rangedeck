'use client';

import { HeroUIProvider } from '@heroui/react';
import { RangesProvider } from './context/RangesContext';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <RangesProvider>
        <main className="dark text-foreground bg-background min-h-screen">
          {children}
        </main>
      </RangesProvider>
    </HeroUIProvider>
  );
}
