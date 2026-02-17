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
