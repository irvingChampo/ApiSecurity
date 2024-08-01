import mongoose, { Schema, Document } from 'mongoose';

export interface SensorDocument extends Document {
  temperature: number;
  humidity: number;
  timestamp: Date;
}

const SensorSchema: Schema = new Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  timestamp: { type: Date, required: true }
});

const SensorModel = mongoose.model<SensorDocument>('Sensor', SensorSchema);

export default SensorModel;
