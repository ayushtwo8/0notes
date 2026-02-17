import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db';
import { Note } from '@/models';
import { bulkUpdateNotesSchema } from '@/lib/validations/note';
import { Types } from 'mongoose';

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
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'At least one note must be selected' },
        { status: 400 }
      );
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
