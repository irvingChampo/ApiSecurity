import mongoose, { Schema, Document } from 'mongoose';

export interface SensorUltrasonicDocument extends Document {
  distance: number;
  timestamp: Date;
}

const SensorUltrasonicSchema: Schema = new Schema({
  distance: { type: Number, required: true },
  timestamp: { type: Date, required: true }
});

const SensorUltrasonicModel = mongoose.model<SensorUltrasonicDocument>('SensorUltrasonic', SensorUltrasonicSchema);

export default SensorUltrasonicModel;
