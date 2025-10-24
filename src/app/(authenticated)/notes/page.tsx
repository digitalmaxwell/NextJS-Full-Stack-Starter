'use client';

import { NotesManager } from '@/components/notes/NotesManager';
import { Toaster } from 'sonner';

export default function NotesPage() {
  return (
    <>
      <Toaster />
      <NotesManager />
    </>
  );
}

