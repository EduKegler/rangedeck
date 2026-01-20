'use client';

import { HeroUIProvider } from '@heroui/react';
import { ToastContainer } from './components/Toast';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <main className="dark text-foreground bg-background min-h-screen">
        {children}
      </main>
      <ToastContainer />
    </HeroUIProvider>
  );
}
