import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db';
import { Folder, Note } from '@/models';
import { updateFolderSchema } from '@/lib/validations/folder';
import { Types } from 'mongoose';

import { isValidObjectId } from '@/lib/utils';


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;


    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid folder id' }, { status: 400 });
    }

    const body = await request.json();
    const validationResult = updateFolderSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const folder = await Folder.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(session.user.id),
      },
      validationResult.data,
      { new: true }
    );

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json(folder);
  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json(
      { error: 'Failed to update folder' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

     if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid folder id' }, { status: 400 });
    }

    await connectDB();

    const folder = await Folder.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(session.user.id),
    });

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    await deleteFolderAndChildren(id);

    // await Note.updateMany(
    //   { folderId: new Types.ObjectId(id) },
    //   { folderId: null }
    // );

    return NextResponse.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json(
      { error: 'Failed to delete folder' },
      { status: 500 }
    );
  }
}

// async function deleteFolderAndChildren(folderId: string) {
//   const children = await Folder.find({ parentId: new Types.ObjectId(folderId) });

//   for (const child of children) {
//     await deleteFolderAndChildren(child._id.toString());
//     await Note.updateMany(
//       { folderId: child._id },
//       { folderId: null }
//     );
//     await Folder.findByIdAndDelete(child._id);
//   }

//   await Folder.findByIdAndDelete(folderId);
// }


async function deleteFolderAndChildren(folderId: string) {
  const children = await Folder.find({ parentId: new Types.ObjectId(folderId) });
  for (const child of children) {
    await deleteFolderAndChildren(child._id.toString());
  }
  await Note.updateMany({ folderId: new Types.ObjectId(folderId) }, { folderId: null });
  await Folder.findByIdAndDelete(folderId);
}