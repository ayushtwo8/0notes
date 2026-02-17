'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEditorStore } from '@/stores/useEditorStore';
import { useFoldersStore } from '@/stores/useFoldersStore';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button, Card } from '@/components/ui';
import { extractPlainText, flattenFolders } from '@/lib/utils';
import {
  ArrowLeft,
  Pin,
  Star,
  Archive,
  Trash2,
  Save,
  Check,
  Palette,
  Folder,
  Tag,
  ChevronDown,
} from 'lucide-react';
import { getHTMLFromContent } from '@/lib/utils';

const PALETTE_COLORS = [
  { color: '#E34664', name: 'Rose' },
  { color: '#364737', name: 'Green' },
  { color: '#F5E6DB', name: 'Cream' },
  { color: '#B9D2D1', name: 'Sage' },
  { color: '#EB7822', name: 'Orange' },
  { color: '#6D483F', name: 'Brown' },
];

export default function NoteEditorPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;
  const isNewNote = noteId === 'new';
  const [isEditing, setIsEditing] = useState(isNewNote);

  const {
    currentNote,
    isLoading,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    fetchNote,
    setCurrentNote,
    updateCurrentNote,
    saveNote,
  } = useEditorStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState({});
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { folders, fetchFolders } = useFoldersStore();
  const searchParams = useSearchParams();
  const folderIdFromQuery = searchParams.get('folderId');

  useEffect(() => {
    fetchFolders();
    if (!isNewNote) {
      fetchNote(noteId);
    } else {
      setCurrentNote(null);
      setTitle('Untitled Note');
      setContent({
        type: 'doc',
        content: [{ type: 'paragraph' }],
      });
      // Set folder from query param if creating new note
      if (folderIdFromQuery) {
        setSelectedFolderId(folderIdFromQuery);
      }
    }
  }, [noteId, isNewNote, fetchNote, setCurrentNote, fetchFolders, folderIdFromQuery]);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setSelectedFolderId(currentNote.folderId || null);
    }
  }, [currentNote]);

  const handleSave = useCallback(async () => {
    const plainText = extractPlainText(content);
    const noteData = {
      title,
      content,
      plainText,
      folderId: selectedFolderId,
    };
    
    if (isNewNote) {
      try {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
        if (response.ok) {
          const note = await response.json();
          router.push(`/notes/${note._id}`);
        } else {
          const error = await response.json();
          console.error('Failed to create note:', error);
          alert('Failed to create note: ' + (error.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Failed to create note:', error);
        alert('Failed to create note. Please try again.');
      }
    } else if (currentNote && hasUnsavedChanges) {
      try {
        const response = await fetch(`/api/notes/${currentNote._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
        if (response.ok) {
          const updated = await response.json();
          setCurrentNote(updated);
        } else {
          const error = await response.json();
          console.error('Failed to save note:', error);
        }
      } catch (error) {
        console.error('Failed to save note:', error);
      }
    }
  }, [isNewNote, currentNote, title, content, selectedFolderId, hasUnsavedChanges, router, setCurrentNote]);

  useEffect(() => {
     if (!isEditing) return;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content,isEditing, handleSave]);

  const handleTogglePin = async () => {
    if (!currentNote) return;
    try {
      const response = await fetch(`/api/notes/${currentNote._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !currentNote.isPinned }),
      });
      if (response.ok) {
        const updated = await response.json();
        setCurrentNote(updated);
      }
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentNote) return;
    try {
      const response = await fetch(`/api/notes/${currentNote._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentNote.isFavorite }),
      });
      if (response.ok) {
        const updated = await response.json();
        setCurrentNote(updated);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleArchive = async () => {
    if (!currentNote) return;
    try {
      const response = await fetch(`/api/notes/${currentNote._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: true }),
      });
      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to archive:', error);
    }
  };

  const handleTrash = async () => {
    if (!currentNote) return;
    try {
      const response = await fetch(`/api/notes/${currentNote._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTrashed: true }),
      });
      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to trash:', error);
    }
  };

  const handleColorChange = async (color: string | null) => {
    updateCurrentNote({ color: color || undefined });
    if (!isNewNote && currentNote) {
      try {
        await fetch(`/api/notes/${currentNote._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ color }),
        });
      } catch (error) {
        console.error('Failed to change color:', error);
      }
    }
    setShowColorPicker(false);
  };

  const handleFolderChange = async (folderId: string | null) => {
    setSelectedFolderId(folderId);
    updateCurrentNote({ folderId: folderId || undefined });
    if (!isNewNote && currentNote) {
      try {
        const response = await fetch(`/api/notes/${currentNote._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folderId }),
        });
        if (response.ok) {
          const updated = await response.json();
          setCurrentNote(updated);
        }
      } catch (error) {
        console.error('Failed to change folder:', error);
      }
    }
    setShowFolderDropdown(false);
  };

  const flattenedFolders = flattenFolders(folders);
  const currentFolder = flattenedFolders.find(f => f._id === selectedFolderId);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
            {/* Folder Selector */}
            <button
              onClick={() => setShowFolderDropdown(!showFolderDropdown)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors relative"
            >
              <Folder className="w-4 h-4" />
              <span className="max-w-[150px] truncate">
                {currentFolder ? currentFolder.name : 'No Folder'}
              </span>
              <ChevronDown className="w-3 h-3" />
              
              {showFolderDropdown && (
                <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 min-w-[200px] max-h-[300px] overflow-y-auto">
                  <button
                    onClick={() => handleFolderChange(null)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      !selectedFolderId ? 'bg-[#F5E6DB] text-[#E34664]' : 'text-gray-700'
                    }`}
                  >
                    No Folder
                  </button>
                  {flattenedFolders.map((folder) => (
                    <button
                      key={folder._id}
                      onClick={() => handleFolderChange(folder._id)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        selectedFolderId === folder._id ? 'bg-[#F5E6DB] text-[#E34664]' : 'text-gray-700'
                      }`}
                      style={{ paddingLeft: `${16 + folder.depth * 16}px` }}
                    >
                      {folder.name}
                    </button>
                  ))}
                </div>
              )}
            </button>

            {!isNewNote && currentNote && (
              <>
                <button
                  onClick={handleTogglePin}
                  className={`p-2 rounded-lg transition-colors ${
                    currentNote.isPinned ? 'text-[#E34664] bg-[#F5E6DB]' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <Pin className={`w-4 h-4 ${currentNote.isPinned ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-lg transition-colors ${
                    currentNote.isFavorite ? 'text-[#EB7822] bg-orange-50' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <Star className={`w-4 h-4 ${currentNote.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors relative"
                >
                  <Palette className="w-4 h-4" />
                  {showColorPicker && (
                    <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                      <div className="flex gap-2">
                        {PALETTE_COLORS.map(({ color }) => (
                          <button
                            key={color}
                            onClick={() => handleColorChange(color)}
                            className="w-6 h-6 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <button
                          onClick={() => handleColorChange(null)}
                          className="w-6 h-6 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </button>
              </>
            )}
          </div>
          </div>

          <div className="flex items-center gap-2">
            {isSaving && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Save className="w-4 h-4" /> Saving...
              </span>
            )}
            {!isSaving && lastSaved && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Saved
              </span>
            )}
            {!isNewNote && currentNote && (
              <>
              <Button
                  variant={isEditing ? 'primary' : 'ghost'}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Done' : 'Edit'}
                </Button>
                <Button variant="ghost" onClick={handleArchive}>
                  <Archive className="w-4 h-4" />
                </Button>
                <Button variant="ghost" onClick={handleTrash}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            updateCurrentNote({ title: e.target.value });
          }}
          placeholder="Note title"
          readOnly={!isEditing}
          onClick={() => !isEditing && setIsEditing(true)}
          className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-0 bg-transparent mb-4"
        />

        {isEditing ? (
          <TiptapEditor
            key={currentNote?._id ?? 'new'}
            content={content}
            onChange={(newContent) => {
              setContent(newContent);
              updateCurrentNote({ content: newContent });
            }}
            placeholder="Start writing your note..."
          />
        ) : (
          <div
            className="prose prose-sm max-w-none p-4 min-h-[300px] cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setIsEditing(true)}
            dangerouslySetInnerHTML={{ __html: getHTMLFromContent(content) }}
          />
        )}

        
      </div>
    </AppLayout>
  );
}
