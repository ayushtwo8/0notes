import { Types } from "mongoose";
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

// Helper function to extract plain text from Tiptap JSON content
export function extractPlainText(content: any): string {
  if (!content || !content.content) return '';
  
  let text = '';
  
  function traverse(node: any) {
    if (node.text) {
      text += node.text + ' ';
    }
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  }
  
  traverse(content);
  return text.trim();
}

// Helper to flatten folder tree for dropdown
export function flattenFolders(folders: any[]): any[] {
  const result: any[] = [];
  
  function traverse(folder: any, depth: number = 0) {
    result.push({
      ...folder,
      depth,
      displayName: '  '.repeat(depth) + folder.name,
    });
    
    if (folder.children && folder.children.length > 0) {
      folder.children.forEach((child: any) => traverse(child, depth + 1));
    }
  }
  
  folders.forEach((folder) => traverse(folder, 0));
  return result;
}

 export function isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
  }


export function getHTMLFromContent(content: object): string {
  try {
    return generateHTML(content as any, [
      StarterKit,
      Underline,
      TaskList,
      TaskItem,
    ]);
  } catch {
    return '';
  }
}