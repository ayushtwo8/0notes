import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { NoteList } from '@/components/notes/NoteList';

export const metadata: Metadata = {
  title: 'Folder',
};

export default async function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  const { id } = await params;
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Folder</h1>
        <NoteList folderId={id} />
      </div>
    </AppLayout>
  );
}
