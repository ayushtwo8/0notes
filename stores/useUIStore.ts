import { create } from 'zustand';
import { ViewMode } from '@/types';

interface UIState {
  sidebarOpen: boolean;
  viewMode: ViewMode;
  selectedNoteIds: string[];
  isBulkMode: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  selectNote: (id: string) => void;
  deselectNote: (id: string) => void;
  toggleNoteSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: (ids: string[]) => void;
  setBulkMode: (isBulk: boolean) => void;
  toggleBulkMode: () => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  closeSearch: () => void;
  
  // Computed
  selectedCount: () => number;
  isSelected: (id: string) => boolean;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  viewMode: 'grid',
  selectedNoteIds: [],
  isBulkMode: false,
  isSearchOpen: false,
  searchQuery: '',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () =>
    set((state) => ({ viewMode: state.viewMode === 'grid' ? 'list' : 'grid' })),

  selectNote: (id) =>
    set((state) => ({
      selectedNoteIds: [...state.selectedNoteIds, id],
    })),

  deselectNote: (id) =>
    set((state) => ({
      selectedNoteIds: state.selectedNoteIds.filter((noteId) => noteId !== id),
    })),

  toggleNoteSelection: (id) =>
    set((state) => {
      const isSelected = state.selectedNoteIds.includes(id);
      return {
        selectedNoteIds: isSelected
          ? state.selectedNoteIds.filter((noteId) => noteId !== id)
          : [...state.selectedNoteIds, id],
      };
    }),

  clearSelection: () => set({ selectedNoteIds: [], isBulkMode: false }),

  selectAll: (ids) => set({ selectedNoteIds: ids }),

  setBulkMode: (isBulk) => set({ isBulkMode: isBulk }),

  toggleBulkMode: () =>
    set((state) => {
      const newBulkMode = !state.isBulkMode;
      return {
        isBulkMode: newBulkMode,
        selectedNoteIds: newBulkMode ? state.selectedNoteIds : [],
      };
    }),

  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),

  selectedCount: () => get().selectedNoteIds.length,
  isSelected: (id) => get().selectedNoteIds.includes(id),
}));
