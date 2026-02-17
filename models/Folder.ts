import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFolder extends Document {
  _id: Types.ObjectId;
  name: string;
  parentId?: Types.ObjectId | null;
  color?: string;
  icon?: string;
  userId: Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FolderSchema = new Schema<IFolder>({
  name: { type: String, required: true, trim: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
  color: { type: String, default: null },
  icon: { type: String, default: 'folder' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
});

FolderSchema.index({ userId: 1, parentId: 1 });

export default mongoose.models.Folder || mongoose.model<IFolder>('Folder', FolderSchema);
