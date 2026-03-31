import mongoose, { Document, Schema } from 'mongoose';

export enum Role {
  Viewer = 'Viewer',
  Editor = 'Editor',
  Admin = 'Admin'
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: Role;
  organizationId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.Viewer },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
