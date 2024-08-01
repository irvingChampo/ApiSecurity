export interface SensorUltrasonic {
  id: string;
  distance: number;
  motionDetected?: boolean;
  timestamp: Date;
}
