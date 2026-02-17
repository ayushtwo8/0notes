import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db';
import { Note } from '@/models';
import { updateNoteSchema } from '@/lib/validations/note';
import { Types } from 'mongoose';
import { isValidObjectId } from '@/lib/utils';

export async function GET(
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
      return NextResponse.json({ error: 'Invalid note id' }, { status: 400 });
    }

    await connectDB();

    const note = await Note.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(session.user.id),
    }).populate('tags', 'name color')
    .lean();

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

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
      return NextResponse.json({ error: 'Invalid note id' }, { status: 400 });
    }

    const body = await request.json();
    const validationResult = updateNoteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const updateData: any = { ...validationResult.data };

    if (updateData.folderId !== undefined) {
      updateData.folderId = updateData.folderId
        ? new Types.ObjectId(updateData.folderId)
        : null;
    }

    if (updateData.tags !== undefined) {
      updateData.tags = updateData.tags.map((id: string) => new Types.ObjectId(id));
    }

    if (updateData.isTrashed === true) {
      updateData.trashedAt = new Date();
    } else if (updateData.isTrashed === false) {
      updateData.trashedAt = null;
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(session.user.id),
      },
      updateData,
      { new: true }
    ).populate('tags', 'name color').lean();

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
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
      return NextResponse.json({ error: 'Invalid note id' }, { status: 400 });
    }

    await connectDB();

    const note = await Note.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(session.user.id),
    }).lean();

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
