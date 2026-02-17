import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { Folder } from "@/models";
import { reorderFoldersSchema } from "@/lib/validations/folder";
import { Types } from "mongoose";

import { isValidObjectId } from "@/lib/utils";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = reorderFoldersSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();

    const { folders } = validationResult.data;

    // Validate all IDs before building ops
    const invalidId = folders.find(
      (f) =>
        !isValidObjectId(f.id) || (f.parentId && !isValidObjectId(f.parentId)),
    );
    if (invalidId) {
      return NextResponse.json(
        { error: "Invalid folder id in list" },
        { status: 400 },
      );
    }

    const bulkOps = folders.map((folder) => ({
      updateOne: {
        filter: {
          _id: new Types.ObjectId(folder.id),
          userId: new Types.ObjectId(session.user.id),
        },
        update: {
          order: folder.order,
          parentId: folder.parentId
            ? new Types.ObjectId(folder.parentId)
            : null,
        },
      },
    }));

    await Folder.bulkWrite(bulkOps);

    return NextResponse.json({ message: "Folders reordered successfully" });
  } catch (error) {
    console.error("Error reordering folders:", error);
    return NextResponse.json(
      { error: "Failed to reorder folders" },
      { status: 500 },
    );
  }
}
