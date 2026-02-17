'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Star,
  FolderOpen,
  Archive,
  Trash2,
  Settings,
  Plus,
} from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: FileText, label: 'Notes' },
    { href: '/notes?favorite=true', icon: Star, label: 'Favorites' },
    { href: '/folders', icon: FolderOpen, label: 'Folders' },
    { href: '/archive', icon: Archive, label: 'Archive' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors
              ${pathname === item.href ? 'text-[#E34664]' : 'text-gray-500'}
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
