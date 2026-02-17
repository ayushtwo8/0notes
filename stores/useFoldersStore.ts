import { create } from 'zustand';
import { Folder } from '@/types';

interface FoldersState {
  folders: Folder[];
  isLoading: boolean;
  error: string | null;
  expandedFolders: Set<string>;
  
  // Actions
  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (folder: Folder) => void;
  deleteFolder: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleFolder: (id: string) => void;
  expandFolder: (id: string) => void;
  collapseFolder: (id: string) => void;
  collapseAll: () => void;
  expandAll: () => void;
  
  // Async actions
  fetchFolders: () => Promise<void>;
  createFolder: (data: Partial<Folder>) => Promise<Folder>;
  patchFolder: (id: string, data: Partial<Folder>) => Promise<void>;
  removeFolder: (id: string) => Promise<void>;
  reorderFolders: (folders: { id: string; order: number; parentId: string | null }[]) => Promise<void>;
  
  // Computed
  getFolderById: (id: string) => Folder | undefined;
  getFolderPath: (id: string) => Folder[];
}

const findFolderById = (folders: Folder[], id: string): Folder | undefined => {
  for (const folder of folders) {
    if (folder._id === id) return folder;
    if (folder.children) {
      const found = findFolderById(folder.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

const buildFolderPath = (folders: Folder[], id: string, path: Folder[] = []): Folder[] => {
  for (const folder of folders) {
    if (folder._id === id) return [...path, folder];
    if (folder.children) {
      const result = buildFolderPath(folder.children, id, [...path, folder]);
      if (result.length > 0) return result;
    }
  }
  return [];
};

const collectAllIds = (folders: Folder[]): string[] => {
  const ids: string[] = [];
  for (const folder of folders) {
    ids.push(folder._id);
    if (folder.children) {
      ids.push(...collectAllIds(folder.children));
    }
  }
  return ids;
};

export const useFoldersStore = create<FoldersState>((set, get) => ({
  folders: [],
  isLoading: false,
  error: null,
  expandedFolders: new Set(),

  setFolders: (folders) => set({ folders }),
  addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
  updateFolder: (folder) =>
    set((state) => ({
      folders: state.folders.map((f) => (f._id === folder._id ? folder : f)),
    })),
  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((f) => f._id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  toggleFolder: (id) =>
    set((state) => {
      const newExpanded = new Set(state.expandedFolders);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return { expandedFolders: newExpanded };
    }),

  expandFolder: (id) =>
    set((state) => ({
      expandedFolders: new Set([...state.expandedFolders, id]),
    })),

  collapseFolder: (id) =>
    set((state) => {
      const newExpanded = new Set(state.expandedFolders);
      newExpanded.delete(id);
      return { expandedFolders: newExpanded };
    }),

  collapseAll: () => set({ expandedFolders: new Set() }),

  expandAll: () =>
    set((state) => ({
      expandedFolders: new Set(collectAllIds(state.folders)),
    })),

  fetchFolders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/folders');
      if (!response.ok) throw new Error('Failed to fetch folders');
      const folders = await response.json();
      set({ folders, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createFolder: async (data) => {
    const response = await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create folder');
    const folder = await response.json();
    get().addFolder(folder);
    return folder;
  },

  patchFolder: async (id, data) => {
    const response = await fetch(`/api/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update folder');
    const folder = await response.json();
    get().updateFolder(folder);
  },

  removeFolder: async (id) => {
    const response = await fetch(`/api/folders/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete folder');
    get().deleteFolder(id);
  },

  reorderFolders: async (folders) => {
    const response = await fetch('/api/folders/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folders }),
    });
    if (!response.ok) throw new Error('Failed to reorder folders');
    get().fetchFolders();
  },

  getFolderById: (id) => findFolderById(get().folders, id),
  getFolderPath: (id) => buildFolderPath(get().folders, id),
}));
