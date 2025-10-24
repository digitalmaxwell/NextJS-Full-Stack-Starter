import type { Metadata } from 'next';
import { ThemeProvider } from '@/lib/theme-provider';
import { TRPCProvider } from '@/lib/trpc/client';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js Starter',
  description: 'A full-stack Next.js starter with Supabase, tRPC, and shadcn/ui',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

