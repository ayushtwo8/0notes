import { create } from 'zustand';
import { Note, NoteFilters } from '@/types';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  filters: NoteFilters;
  
  // Actions
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<NoteFilters>) => void;
  clearFilters: () => void;
  
  // Async actions
  fetchNotes: () => Promise<void>;
  createNote: (data: Partial<Note>) => Promise<Note>;
  patchNote: (id: string, data: Partial<Note>) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
}

const buildQueryString = (filters: NoteFilters): string => {
  const params = new URLSearchParams();
  if (filters.folderId) params.append('folderId', filters.folderId);
  if (filters.tagId) params.append('tagId', filters.tagId);
  if (filters.search) params.append('search', filters.search);
  if (filters.isArchived) params.append('isArchived', 'true');
  if (filters.isTrashed) params.append('isTrashed', 'true');
  if (filters.isFavorite) params.append('isFavorite', 'true');
  return params.toString();
};

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,
  filters: {},

  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (note) =>
    set((state) => ({
      notes: state.notes.map((n) => (n._id === note._id ? note : n)),
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n._id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: {} }),

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const queryString = buildQueryString(get().filters);
      const response = await fetch(`/api/notes?${queryString}`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const notes = await response.json();
      set({ notes, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createNote: async (data) => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create note');
    const note = await response.json();
    get().addNote(note);
    return note;
  },

  patchNote: async (id, data) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update note');
    const note = await response.json();
    get().updateNote(note);
  },

  removeNote: async (id) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete note');
    get().deleteNote(id);
  },
}));
