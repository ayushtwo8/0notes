import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Note } from '@/models';
import { subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const thirtyDaysAgo = subDays(new Date(), 30);

    const result = await Note.deleteMany({
      isTrashed: true,
      trashedAt: { $lt: thirtyDaysAgo },
    });

    console.log(`Deleted ${result.deletedCount} old trashed notes`);

    return NextResponse.json({
      message: 'Trash cleanup completed',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error cleaning up trash:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup trash' },
      { status: 500 }
    );
  }
}
