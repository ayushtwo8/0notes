import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { NoteList } from '@/components/notes/NoteList';
import { EmptyState } from '@/components/ui/EmptyState';
import { Archive } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Archive',
};

export default async function ArchivePage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Archive</h1>
        <NoteList showPinned={false} />
      </div>
    </AppLayout>
  );
}
