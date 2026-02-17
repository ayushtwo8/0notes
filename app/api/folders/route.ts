import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db';
import { Folder, Note } from '@/models';
import { createFolderSchema } from '@/lib/validations/folder';
import { Types } from 'mongoose';

async function buildFolderTree(
  folders: any[],
  parentId: string | null = null,
  level: number = 0
): Promise<any[]> {
  if (level >= 4) return [];

  const result = [];
  const children = folders.filter(
    (f) =>
      (parentId === null && !f.parentId) ||
      f.parentId?.toString() === parentId
  );

  for (const folder of children.sort((a, b) => a.order - b.order)) {
    const noteCount = await Note.countDocuments({
      folderId: folder._id,
      isTrashed: false,
      isArchived: false,
    });

    const folderWithCount = {
      ...folder,
      noteCount,
      children: await buildFolderTree(folders, folder._id.toString(), level + 1),
    };
    result.push(folderWithCount);
  }

  return result;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const folders = await Folder.find({
      userId: new Types.ObjectId(session.user.id),
    }).lean();

    const folderTree = await buildFolderTree(folders);

    return NextResponse.json(folderTree);
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createFolderSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    if (validationResult.data.parentId) {
      const parentFolder = await Folder.findOne({
        _id: new Types.ObjectId(validationResult.data.parentId),
        userId: new Types.ObjectId(session.user.id),
      });

      if (!parentFolder) {
        return NextResponse.json(
          { error: 'Parent folder not found' },
          { status: 404 }
        );
      }

      const depth = await calculateFolderDepth(validationResult.data.parentId);
      if (depth >= 4) {
        return NextResponse.json(
          { error: 'Maximum folder depth (4 levels) reached' },
          { status: 400 }
        );
      }
    }

    const maxOrder = await Folder.findOne({
      userId: new Types.ObjectId(session.user.id),
      parentId: validationResult.data.parentId
        ? new Types.ObjectId(validationResult.data.parentId)
        : null,
    }).sort({ order: -1 });

    const folder = await Folder.create({
      ...validationResult.data,
      userId: new Types.ObjectId(session.user.id),
      parentId: validationResult.data.parentId
        ? new Types.ObjectId(validationResult.data.parentId)
        : null,
      order: (maxOrder?.order || 0) + 1,
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}

async function calculateFolderDepth(folderId: string): Promise<number> {
  let depth = 1;
  let currentFolder = await Folder.findById(folderId);

  while (currentFolder?.parentId) {
    depth++;
    currentFolder = await Folder.findById(currentFolder.parentId);
  }

  return depth;
}
