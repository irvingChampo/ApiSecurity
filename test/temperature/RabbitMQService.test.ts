
import RabbitMQService from '../../src/temperature/services/RabbitMQService';

jest.mock('amqplib', () => ({
  connect: jest.fn((url: string) => {
    if (url.includes('invalid')) {
      return Promise.reject(new Error('Connection failed'));
    }
    return Promise.resolve({
      createChannel: async () => ({
        assertQueue: async () => {},
        consume: async (queue: string, cb: any) => {
          cb({ content: Buffer.from('{') }); 
        }
      })
    });
  })
}));

describe('RabbitMQService - Issue #37', () => {

  const originalConsoleError = console.error;
  let errorMock: jest.Mock;

  beforeEach(() => {
    errorMock = jest.fn();
    console.error = errorMock;
  });

  afterEach(() => {
    console.error = originalConsoleError;
    jest.clearAllMocks();
  });

  test('TS-RABBIT-ERR-01: Error al conectar al broker', async () => {
    const service = new RabbitMQService('amqp://invalid-url', 'fake-queue');
    await service.init();
    expect(errorMock).toHaveBeenCalledWith(expect.stringContaining('Error al conectar con RabbitMQ'));
  });

  test('TS-RABBIT-ERR-02: Parsing fallido de mensaje', async () => {
    const service = new RabbitMQService('amqp://valid-url', 'fake-queue');
    await service.init();
    expect(errorMock).toHaveBeenCalledWith(expect.stringContaining('Error al procesar mensaje'));
  });

});
