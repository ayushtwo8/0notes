'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  FolderOpen,
  Tags,
  Archive,
  Trash2,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  Search,
  Star,
} from 'lucide-react';
import { useFoldersStore } from '@/stores/useFoldersStore';
import { useTagsStore } from '@/stores/useTagsStore';
import { Folder as FolderType } from '@/types';
import { Dialog, Button } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';

function FolderItem({
  folder,
  level = 0,
}: {
  folder: FolderType;
  level?: number;
}) {
  const pathname = usePathname();
  const { expandedFolders, toggleFolder } = useFoldersStore();
  const isExpanded = expandedFolders.has(folder._id);
  const isActive = pathname === `/folders/${folder._id}`;
  const hasChildren = folder.children && folder.children.length > 0;

  return (
    <div>
      <Link
        href={`/folders/${folder._id}`}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isActive ? 'bg-[#F5E6DB] text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-100'}
        `}
        style={{ paddingLeft: `${12 + level * 16}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFolder(folder._id);
            }}
            className="p-0.5 rounded hover:bg-gray-200 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <Folder className="w-4 h-4 flex-shrink-0" style={{ color: folder.color || undefined }} />
        <span className="truncate flex-1">{folder.name}</span>
        {folder.noteCount ? (
          <span className="text-xs text-gray-400">{folder.noteCount}</span>
        ) : null}
      </Link>
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {folder.children?.map((child) => (
              <FolderItem key={child._id} folder={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { folders, fetchFolders } = useFoldersStore();
  const { tags, fetchTags } = useTagsStore();
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    fetchFolders();
    fetchTags();
  }, [fetchFolders, fetchTags]);

  const { createFolder } = useFoldersStore();

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolder({ name: newFolderName });
      setIsCreateFolderOpen(false);
      setNewFolderName('');
    } catch (error) {
      console.error('Failed to create folder:', error);
      alert('Failed to create folder. Please try again.');
    }
  };

  const navItems = [
    { href: '/dashboard', icon: FileText, label: 'All Notes' },
    { href: '/notes?favorite=true', icon: Star, label: 'Favorites' },
    { href: '/archive', icon: Archive, label: 'Archive' },
    { href: '/trash', icon: Trash2, label: 'Trash' },
  ];

  return (
    <aside className="w-64 h-full bg-[#FAFAFA] border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E34664] flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">Notes</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${pathname === item.href ? 'bg-[#F5E6DB] text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Folders
            </span>
            <button
              onClick={() => setIsCreateFolderOpen(true)}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-1">
            {folders.map((folder) => (
              <FolderItem key={folder._id} folder={folder} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tags
            </span>
          </div>
          <div className="space-y-1">
            {tags.map((tag) => (
              <Link
                key={tag._id}
                href={`/tags/${tag._id}`}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${pathname === `/tags/${tag._id}` ? 'bg-[#F5E6DB] text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                <Tags className="w-4 h-4" style={{ color: tag.color || undefined }} />
                <span className="flex-1">{tag.name}</span>
                {tag.noteCount ? (
                  <span className="text-xs text-gray-400">{tag.noteCount}</span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 space-y-1">
        <Link
          href="/settings"
          className={`
            flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
            ${pathname === '/settings' ? 'bg-[#F5E6DB] text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-100'}
          `}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      <Dialog
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        title="Create Folder"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateFolderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </>
        }
      >
        <input
          type="text"
          placeholder="Folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E34664] focus:border-transparent"
        />
      </Dialog>
    </aside>
  );
}
