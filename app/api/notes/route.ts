import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db';
import { Note } from '@/models';
import { createNoteSchema } from '@/lib/validations/note';
import { Types } from 'mongoose';

type NoteQuery = {
  userId: Types.ObjectId;
  isTrashed?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  folderId?: Types.ObjectId;
  tags?: Types.ObjectId;
  $or?: Array<{ title: RegExp } | { plainText: RegExp }>;
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');
    const tagId = searchParams.get('tagId');
    const search = searchParams.get('search');
    const isArchived = searchParams.get('isArchived');
    const isTrashed = searchParams.get('isTrashed');
    const isFavorite = searchParams.get('isFavorite');

    // Validate ObjectId params before hitting the DB
    if (folderId && !isValidObjectId(folderId)) {
      return NextResponse.json({ error: 'Invalid folderId' }, { status: 400 });
    }
    if (tagId && !isValidObjectId(tagId)) {
      return NextResponse.json({ error: 'Invalid tagId' }, { status: 400 });
    }

    const query: NoteQuery = { userId: new Types.ObjectId(session.user.id) };

    if (isTrashed === 'true') {
      query.isTrashed = true;
    } else if (isArchived === 'true') {
      query.isArchived = true;
      query.isTrashed = false;
      // isFavorite is intentionally ignored when viewing archived notes
    } else {
      query.isArchived = false;
      query.isTrashed = false;
      if (isFavorite === 'true') {
        query.isFavorite = true;
      }
    }

    if (folderId) {
      query.folderId = new Types.ObjectId(folderId);
    }

    if (tagId) {
      query.tags = new Types.ObjectId(tagId);
    }

    if (search) {
      // Escape user input to prevent ReDoS attacks
      const searchRegex = new RegExp(escapeRegex(search), 'i');
      query.$or = [
        { title: searchRegex },
        { plainText: searchRegex },
      ];
    }

    await connectDB();

    const notes = await Note.find(query)
      .populate('tags', 'name color')
      .sort({ isPinned: -1, updatedAt: -1 })
      .lean();

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
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
    const validationResult = createNoteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const noteData = {
      ...validationResult.data,
      userId: new Types.ObjectId(session.user.id),
      folderId: validationResult.data.folderId
        ? new Types.ObjectId(validationResult.data.folderId)
        : null,
      tags: validationResult.data.tags?.map((id) => new Types.ObjectId(id)) || [],
    };

    const note = await Note.create(noteData);
    // Use .lean() for a consistent serialized shape with the GET response
    await note.populate('tags', 'name color');
    return NextResponse.json(note.toObject(), { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}