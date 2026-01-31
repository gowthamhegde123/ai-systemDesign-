'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import OAuthHandler from './OAuthHandler';

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider>
      <OAuthHandler />
      {children}
    </NextAuthSessionProvider>
  );
}
