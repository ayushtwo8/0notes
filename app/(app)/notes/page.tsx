import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { NoteList } from '@/components/notes/NoteList';

export const metadata: Metadata = {
  title: 'Notes',
};

export default async function NotesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">All Notes</h1>
        <NoteList />
      </div>
    </AppLayout>
  );
}
