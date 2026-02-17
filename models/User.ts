import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserPreferences {
  theme: 'light' | 'dark';
  defaultFolderId?: Types.ObjectId;
  sidebarCollapsed: boolean;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  hashedPassword: string;
  preferences: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferencesSchema = new Schema<IUserPreferences>({
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  defaultFolderId: { type: Schema.Types.ObjectId, ref: 'Folder' },
  sidebarCollapsed: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  hashedPassword: { type: String, required: true },
  preferences: { type: UserPreferencesSchema, default: () => ({}) },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
