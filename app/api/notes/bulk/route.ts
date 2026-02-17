import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db';
import { Note } from '@/models';
import { bulkUpdateNotesSchema, bulkDeleteNotesSchema } from '@/lib/validations/note';
import { Types } from 'mongoose';
import { isValidObjectId } from '@/lib/utils';

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = bulkUpdateNotesSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const { ids, ...updateData } = validationResult.data;

    const invalidId = ids.find((id) => !isValidObjectId(id));
    if (invalidId) {
      return NextResponse.json({ error: 'Invalid note id in list' }, { status: 400 });
    }

    const objectIds = ids.map((id) => new Types.ObjectId(id));
    const mongoUpdateData: any = { ...updateData };

    if (mongoUpdateData.folderId !== undefined) {
      mongoUpdateData.folderId = mongoUpdateData.folderId
        ? new Types.ObjectId(mongoUpdateData.folderId)
        : null;
    }

    if (mongoUpdateData.tags !== undefined) {
      mongoUpdateData.tags = mongoUpdateData.tags.map((id: string) =>
        new Types.ObjectId(id)
      );
    }

    if (mongoUpdateData.isTrashed === true) {
      mongoUpdateData.trashedAt = new Date();
    } else if (mongoUpdateData.isTrashed === false) {
      mongoUpdateData.trashedAt = null;
    }

    const result = await Note.updateMany(
      {
        _id: { $in: objectIds },
        userId: new Types.ObjectId(session.user.id),
      },
      mongoUpdateData
    );

    return NextResponse.json({
      message: 'Notes updated successfully',
      count: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error bulk updating notes:', error);
    return NextResponse.json(
      { error: 'Failed to update notes' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = bulkDeleteNotesSchema.safeParse(body);

     if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { ids } = validationResult.data;

    const invalidId = ids.find((id) => !isValidObjectId(id));
    if (invalidId) {
      return NextResponse.json({ error: 'Invalid note id in list' }, { status: 400 });
    }

    await connectDB();

    const objectIds = ids.map((id) => new Types.ObjectId(id));

    const result = await Note.deleteMany({
      _id: { $in: objectIds },
      userId: new Types.ObjectId(session.user.id),
    });

    return NextResponse.json({
      message: 'Notes deleted successfully',
      count: result.deletedCount,
    });
  } catch (error) {
    console.error('Error bulk deleting notes:', error);
    return NextResponse.json(
      { error: 'Failed to delete notes' },
      { status: 500 }
    );
  }
}
