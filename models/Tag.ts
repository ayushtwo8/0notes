import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITag extends Document {
  _id: Types.ObjectId;
  name: string;
  color?: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>({
  name: { type: String, required: true, trim: true },
  color: { type: String, default: null },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, {
  timestamps: true,
});

TagSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
