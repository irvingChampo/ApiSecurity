
import { SensorUltrasonic } from '../../src/sensor/domain/sensor/SensorUltrasonic';

describe('SensorUltrasonic Interface - Issue #33', () => {

  test('TS-MODEL-US-01: Objeto completo cumple con la interfaz', () => {
    const obj: SensorUltrasonic = {
      id: 'abc123',
      distance: 10,
      motionDetected: true,
      timestamp: new Date()
    };

    expect(obj).toHaveProperty('distance');
    expect(typeof obj.distance).toBe('number');
    expect(typeof obj.motionDetected).toBe('boolean');
    expect(obj.timestamp instanceof Date).toBe(true);
  });

  test('TS-MODEL-US-02: Objeto sin motionDetected sigue siendo válido', () => {
    const obj: SensorUltrasonic = {
      distance: 15,
      timestamp: new Date()
    };

    expect(obj).toHaveProperty('distance');
    expect(obj).not.toHaveProperty('motionDetected');
    expect(obj.timestamp instanceof Date).toBe(true);
  });

});
