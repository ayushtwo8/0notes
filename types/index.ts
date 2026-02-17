export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    defaultFolderId?: string;
    sidebarCollapsed: boolean;
  };
}

export interface Note {
  _id: string;
  title: string;
  content: object;
  plainText: string;
  folderId?: string;
  tags: Tag[];
  color?: string;
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  trashedAt?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  _id: string;
  name: string;
  parentId?: string | null;
  color?: string;
  icon?: string;
  userId: string;
  order: number;
  children?: Folder[];
  noteCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  _id: string;
  name: string;
  color?: string;
  userId: string;
  noteCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFilters {
  folderId?: string;
  tagId?: string;
  search?: string;
  isArchived?: boolean;
  isTrashed?: boolean;
  isFavorite?: boolean;
}

export type ViewMode = 'grid' | 'list';

export interface EditorState {
  currentNote: Note | null;
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export interface UIState {
  sidebarOpen: boolean;
  viewMode: ViewMode;
  selectedNoteIds: string[];
  isBulkMode: boolean;
}
