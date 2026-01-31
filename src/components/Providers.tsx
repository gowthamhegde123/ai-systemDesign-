'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import OAuthHandler from './OAuthHandler';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <OAuthHandler />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}