import mongoose, { Document, Schema } from 'mongoose';

export enum ProcessingStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Ready = 'Ready',
  Failed = 'Failed'
}

export enum SafetyStatus {
  Unchecked = 'Unchecked',
  Safe = 'Safe',
  Flagged = 'Flagged'
}

export interface IVideo extends Document {
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  duration?: number;
  processingStatus: ProcessingStatus;
  processingProgress: number;
  safetyStatus: SafetyStatus;
  uploadedBy: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  duration: { type: Number },
  processingStatus: { type: String, enum: Object.values(ProcessingStatus), default: ProcessingStatus.Pending },
  processingProgress: { type: Number, default: 0 },
  safetyStatus: { type: String, enum: Object.values(SafetyStatus), default: SafetyStatus.Unchecked },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
}, { timestamps: true });

export default mongoose.model<IVideo>('Video', VideoSchema);
