import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INote extends Document {
  _id: Types.ObjectId;
  title: string;
  content: object;
  plainText: string;
  folderId?: Types.ObjectId;
  tags: Types.ObjectId[];
  color?: string;
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  trashedAt?: Date;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true, trim: true, default: 'Untitled Note' },
  content: { type: Schema.Types.Mixed, default: {} },
  plainText: { type: String, default: '' },
  folderId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  color: { type: String, default: null },
  isPinned: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isTrashed: { type: Boolean, default: false },
  trashedAt: { type: Date, default: null },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, {
  timestamps: true,
});

NoteSchema.index({ title: 1, plainText: 1 });
NoteSchema.index({ userId: 1, isPinned: 1 });
NoteSchema.index({ userId: 1, folderId: 1 });
NoteSchema.index({ userId: 1, isTrashed: 1 });
NoteSchema.index({ userId: 1, isArchived: 1 });
NoteSchema.index({ tags: 1 });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
