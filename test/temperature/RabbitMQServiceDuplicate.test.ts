
jest.mock('amqplib');

import amqplib from 'amqplib';
import { EventEmitter } from 'events';

const mockChannel = {
  assertQueue: jest.fn(),
  consume: jest.fn(),
  ack: jest.fn(),
  nack: jest.fn(),
};

const mockConnection = {
  createChannel: jest.fn(() => mockChannel),
  on: jest.fn(),
};

(amqplib.connect as jest.Mock).mockResolvedValue(mockConnection);

describe('RabbitMQService – Duplicación de Mensajes (Issue #38)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TS-RABBIT-DUP-01: Ack correcto de mensaje único', async () => {
    const queue = 'sensorQueue';
    const fakeMsg = {
      content: Buffer.from(JSON.stringify({ temperature: 25 })),
    };

    const messageHandler = jest.fn();
    mockChannel.consume.mockImplementation((_queue, cb) => {
      cb(fakeMsg);
    });

    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queue);
    await channel.consume(queue, (msg) => {
      const data = JSON.parse(msg.content.toString());
      messageHandler(data);
      channel.ack(msg);
    });

    expect(messageHandler).toHaveBeenCalledTimes(1);
    expect(messageHandler).toHaveBeenCalledWith({ temperature: 25 });
    expect(mockChannel.ack).toHaveBeenCalledWith(fakeMsg);
  });

  test('TS-RABBIT-DUP-02: Sin ack, RabbitMQ debe reenviar (simulado)', async () => {
    const queue = 'sensorQueue';
    const fakeMsg = {
      content: Buffer.from(JSON.stringify({ temperature: 30 })),
    };

    const messageHandler = jest.fn();
    let processCalled = 0;

    mockChannel.consume.mockImplementation((_queue, cb) => {
      if (processCalled < 2) {
        cb(fakeMsg);
        processCalled++;
      }
    });

    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queue);
    await channel.consume(queue, (msg) => {
      const data = JSON.parse(msg.content.toString());
      messageHandler(data);
    });

    expect(messageHandler).toHaveBeenCalledTimes(2); // Simula reentrega
    expect(mockChannel.ack).not.toHaveBeenCalled();
  });
});
