'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProfileDropdown } from '../profile/ProfileDropdown';
import { cn } from '@/lib/utils';

export default function Navbar({ user }: { user?: { email?: string } | null }) {
  const pathname = usePathname();

  const navItems = user
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/notes', label: 'Notes' },
        { href: '/profile', label: 'Profile' },
      ]
    : [];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-semibold">
              App
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm transition-colors hover:text-foreground/80',
                  pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <ProfileDropdown user={user} />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

