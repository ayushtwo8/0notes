'use client';

import { useEffect } from 'react';
import { NoteCard } from './NoteCard';
import { NoteCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNotesStore } from '@/stores/useNotesStore';
import { useUIStore } from '@/stores/useUIStore';
import { FileText, Plus } from 'lucide-react';

interface NoteListProps {
  folderId?: string;
  tagId?: string;
  showPinned?: boolean;
}

export function NoteList({ folderId, tagId, showPinned = true }: NoteListProps) {
  const { notes, isLoading, fetchNotes, setFilters } = useNotesStore();
  const { viewMode } = useUIStore();

  useEffect(() => {
    setFilters({ folderId, tagId });
    fetchNotes();
  }, [folderId, tagId, setFilters, fetchNotes]);

  const pinnedNotes = notes.filter((note) => note.isPinned && !note.isArchived && !note.isTrashed);
  const otherNotes = notes.filter((note) => !note.isPinned && !note.isArchived && !note.isTrashed);

  if (isLoading) {
    return (
      <div
        className={`grid gap-4 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <NoteCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No notes found"
        description="Create your first note to get started"
        action={{
          label: 'Create Note',
          onClick: () => {},
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {showPinned && pinnedNotes.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Pinned ({pinnedNotes.length})
          </h2>
          <div
            className={`grid gap-4 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {pinnedNotes.map((note) => (
              <NoteCard key={note._id} note={note} variant={viewMode === 'list' ? 'compact' : 'default'} />
            ))}
          </div>
        </div>
      )}

      {otherNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Others ({otherNotes.length})
            </h2>
          )}
          <div
            className={`grid gap-4 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {otherNotes.map((note) => (
              <NoteCard key={note._id} note={note} variant={viewMode === 'list' ? 'compact' : 'default'} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
