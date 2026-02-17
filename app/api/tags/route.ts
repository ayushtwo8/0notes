import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db';
import { Tag, Note } from '@/models';
import { createTagSchema } from '@/lib/validations/tag';
import { Types } from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const tags = await Tag.find({
      userId: new Types.ObjectId(session.user.id),
    }).lean();

    const tagsWithCount = await Promise.all(
      tags.map(async (tag) => {
        const noteCount = await Note.countDocuments({
          tags: tag._id,
          isTrashed: false,
        });
        return { ...tag, noteCount };
      })
    );

    return NextResponse.json(tagsWithCount);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
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
    const validationResult = createTagSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const existingTag = await Tag.findOne({
      name: validationResult.data.name.toLowerCase().trim(),
      userId: new Types.ObjectId(session.user.id),
    });

    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag with this name already exists' },
        { status: 409 }
      );
    }

    const tag = await Tag.create({
      ...validationResult.data,
      userId: new Types.ObjectId(session.user.id),
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
