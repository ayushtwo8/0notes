import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { NoteList } from '@/components/notes/NoteList';

export const metadata: Metadata = {
  title: 'Trash',
};

export default async function TrashPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
          <p className="text-sm text-gray-500">
            Items in trash are automatically deleted after 30 days
          </p>
        </div>
        <NoteList showPinned={false} />
      </div>
    </AppLayout>
  );
}
