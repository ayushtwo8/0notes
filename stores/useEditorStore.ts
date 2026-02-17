import { create } from 'zustand';
import { Note } from '@/types';

interface EditorState {
  currentNote: Note | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  error: string | null;
  
  // Actions
  setCurrentNote: (note: Note | null) => void;
  updateCurrentNote: (data: Partial<Note>) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setLastSaved: (date: Date | null) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchNote: (id: string) => Promise<void>;
  saveNote: (data: Partial<Note>) => Promise<void>;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  currentNote: null,
  isLoading: false,
  isSaving: false,
  lastSaved: null,
  hasUnsavedChanges: false,
  error: null,

  setCurrentNote: (note) => set({ currentNote: note }),
  updateCurrentNote: (data) =>
    set((state) => ({
      currentNote: state.currentNote
        ? { ...state.currentNote, ...data }
        : null,
      hasUnsavedChanges: true,
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setSaving: (saving) => set({ isSaving: saving }),
  setLastSaved: (date) => set({ lastSaved: date }),
  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
  setError: (error) => set({ error }),

  fetchNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/notes/${id}`);
      if (!response.ok) throw new Error('Failed to fetch note');
      const note = await response.json();
      set({ currentNote: note, isLoading: false, hasUnsavedChanges: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  saveNote: async (data) => {
    const { currentNote } = get();
    if (!currentNote) return;

    set({ isSaving: true });
    try {
      const response = await fetch(`/api/notes/${currentNote._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save note');
      const note = await response.json();
      set({
        currentNote: note,
        isSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isSaving: false });
    }
  },
}));
