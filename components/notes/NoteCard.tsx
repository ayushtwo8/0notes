'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Pin, Star, MoreVertical, Trash2, Archive } from 'lucide-react';
import { Note } from '@/types';
import { Card } from '@/components/ui/Card';
import { useUIStore } from '@/stores/useUIStore';
import { useNotesStore } from '@/stores/useNotesStore';

interface NoteCardProps {
  note: Note;
  variant?: 'default' | 'compact';
}

export function NoteCard({ note, variant = 'default' }: NoteCardProps) {
  const { isBulkMode, isSelected, toggleNoteSelection } = useUIStore();
  const { updateNote } = useNotesStore();
  const selected = isSelected(note._id);

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !note.isPinned }),
      });
      if (response.ok) {
        const updated = await response.json();
        updateNote(updated);
      }
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !note.isFavorite }),
      });
      if (response.ok) {
        const updated = await response.json();
        updateNote(updated);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const contentPreview = useMemo(() => {
    if (!note.plainText) return '';
    return note.plainText.slice(0, 150) + (note.plainText.length > 150 ? '...' : '');
  }, [note.plainText]);

  if (variant === 'compact') {
    return (
      <Link href={`/notes/${note._id}`}>
        <Card
          hoverable
          selected={selected}
          className="relative group"
          onClick={(e) => {
            if (isBulkMode) {
              e.preventDefault();
              toggleNoteSelection(note._id);
            }
          }}
        >
          {note.isPinned && (
            <Pin className="absolute top-3 right-3 w-4 h-4 text-[#E34664] fill-[#E34664]" />
          )}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900 line-clamp-1 flex-1">
              {note.title}
            </h3>
            {isBulkMode && (
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggleNoteSelection(note._id)}
                className="w-4 h-4 rounded border-gray-300 text-[#E34664] focus:ring-[#E34664]"
              />
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{contentPreview}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">
              {format(new Date(note.updatedAt), 'MMM d')}
            </span>
            {note.tags && note.tags.length > 0 && (
              <div className="flex gap-1">
                {note.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag._id}
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{
                      backgroundColor: tag.color ? `${tag.color}20` : '#F5E6DB',
                      color: tag.color || '#6D483F',
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
                {note.tags.length > 2 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">
                    +{note.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/notes/${note._id}`}>
      <Card
        hoverable
        selected={selected}
        className="relative group h-full flex flex-col"
        onClick={(e) => {
          if (isBulkMode) {
            e.preventDefault();
            toggleNoteSelection(note._id);
          }
        }}
        style={{ borderLeft: note.color ? `4px solid ${note.color}` : undefined }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1">
            {note.title}
          </h3>
          <div className="flex items-center gap-1">
            {note.isPinned && (
              <Pin className="w-4 h-4 text-[#E34664] fill-[#E34664]" />
            )}
            {isBulkMode ? (
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggleNoteSelection(note._id)}
                className="w-4 h-4 rounded border-gray-300 text-[#E34664] focus:ring-[#E34664]"
              />
            ) : (
              <>
                <button
                  onClick={handleToggleFavorite}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all"
                >
                  <Star
                    className={`w-4 h-4 ${
                      note.isFavorite ? 'text-[#EB7822] fill-[#EB7822]' : 'text-gray-400'
                    }`}
                  />
                </button>
                <button
                  onClick={handleTogglePin}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all"
                >
                  <Pin
                    className={`w-4 h-4 ${
                      note.isPinned ? 'text-[#E34664] fill-[#E34664]' : 'text-gray-400'
                    }`}
                  />
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 flex-1">{contentPreview}</p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {format(new Date(note.updatedAt), 'MMM d, yyyy')}
          </span>
          {note.tags && note.tags.length > 0 && (
            <div className="flex gap-1">
              {note.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag._id}
                  className="px-2 py-0.5 text-xs rounded-full"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}20` : '#F5E6DB',
                    color: tag.color || '#6D483F',
                  }}
                >
                  {tag.name}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">
                  +{note.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
