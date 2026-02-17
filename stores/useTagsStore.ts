import { create } from 'zustand';
import { Tag } from '@/types';

interface TagsState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  updateTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchTags: () => Promise<void>;
  createTag: (data: Partial<Tag>) => Promise<Tag>;
  patchTag: (id: string, data: Partial<Tag>) => Promise<void>;
  removeTag: (id: string) => Promise<void>;
  
  // Computed
  getTagById: (id: string) => Tag | undefined;
  searchTags: (query: string) => Tag[];
}

export const useTagsStore = create<TagsState>((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,

  setTags: (tags) => set({ tags }),
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  updateTag: (tag) =>
    set((state) => ({
      tags: state.tags.map((t) => (t._id === tag._id ? tag : t)),
    })),
  deleteTag: (id) =>
    set((state) => ({
      tags: state.tags.filter((t) => t._id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const tags = await response.json();
      set({ tags, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createTag: async (data) => {
    const response = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create tag');
    const tag = await response.json();
    get().addTag(tag);
    return tag;
  },

  patchTag: async (id, data) => {
    const response = await fetch(`/api/tags/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update tag');
    const tag = await response.json();
    get().updateTag(tag);
  },

  removeTag: async (id) => {
    const response = await fetch(`/api/tags/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete tag');
    get().deleteTag(id);
  },

  getTagById: (id) => get().tags.find((t) => t._id === id),
  searchTags: (query) =>
    get().tags.filter((t) =>
      t.name.toLowerCase().includes(query.toLowerCase())
    ),
}));
