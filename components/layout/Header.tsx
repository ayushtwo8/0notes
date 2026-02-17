'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  FileText,
  Star,
  FolderOpen,
  Archive,
  Trash2,
  Settings,
  Plus,
  Search,
  Grid3X3,
  List,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/useUIStore';
import { useNotesStore } from '@/stores/useNotesStore';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { viewMode, toggleViewMode, isSearchOpen, setSearchOpen, searchQuery, setSearchQuery } = useUIStore();
  const { fetchNotes, setFilters } = useNotesStore();
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(localSearch);
      setFilters({ search: localSearch });
      fetchNotes();
    }, 300);

    return () => clearTimeout(timeout);
  }, [localSearch, setSearchQuery, setFilters, fetchNotes]);

  const handleCreateNote = () => {
    // Check if we're in a folder context
    if (pathname.startsWith('/folders/')) {
      const folderId = pathname.split('/')[2];
      router.push(`/notes/new?folderId=${folderId}`);
    } else {
      router.push('/notes/new');
    }
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
          {pathname === '/dashboard' && 'Dashboard'}
          {pathname === '/archive' && 'Archive'}
          {pathname === '/trash' && 'Trash'}
          {pathname === '/settings' && 'Settings'}
          {pathname.startsWith('/folders/') && 'Folder'}
          {pathname.startsWith('/tags/') && 'Tag'}
          {pathname.startsWith('/notes/') && 'Note'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {isSearchOpen ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9 pr-9 py-2 w-64 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E34664] focus:border-transparent text-sm"
              autoFocus
            />
            <button
              onClick={() => {
                setLocalSearch('');
                setSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => toggleViewMode()}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleViewMode()}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <Button onClick={handleCreateNote} leftIcon={<Plus className="w-4 h-4" />}>
          New Note
        </Button>
      </div>
    </header>
  );
}
