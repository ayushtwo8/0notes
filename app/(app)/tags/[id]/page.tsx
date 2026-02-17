import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { NoteList } from '@/components/notes/NoteList';

export const metadata: Metadata = {
  title: 'Tag',
};

export default async function TagPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    redirect('/login');
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Tag</h1>
        <NoteList tagId={id} />
      </div>
    </AppLayout>
  );
}
