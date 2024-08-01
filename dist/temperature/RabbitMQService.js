"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const amqpUrl = 'amqp://samuel:samuel2004@44.197.73.155:5672';
const queue = 'mqtt';
class RabbitMQService {
    constructor(saveSensorDataUseCase) {
        this.saveSensorDataUseCase = saveSensorDataUseCase;
    }
    async consumeMessages() {
        try {
            const connection = await amqplib_1.default.connect(amqpUrl);
            const channel = await connection.createChannel();
            await channel.assertQueue(queue, { durable: true });
            console.log(`Esperando mensajes en la cola ${queue}...`);
            channel.consume(queue, async (message) => {
                if (message !== null) {
                    try {
                        const data = JSON.parse(message.content.toString()); // Convertir a objeto JSON
                        console.log("Mensaje recibido:", data);
                        // Aquí se asume que los datos recibidos están en el formato adecuado.
                        // Puedes ajustar esta lógica según tu caso.
                        const sensorData = {
                            id: '',
                            temperature: data.temperature,
                            humidity: data.humidity,
                            timestamp: new Date(),
                        };
                        // Guardar los datos usando el caso de uso
                        await this.saveSensorDataUseCase.execute(sensorData);
                        // Confirmar el mensaje
                        channel.ack(message);
                    }
                    catch (error) {
                        console.error('Error al procesar el mensaje:', error);
                        channel.nack(message); // No confirmar el mensaje para que pueda ser re-procesado
                    }
                }
            });
        }
        catch (error) {
            console.error('Error al consumir mensajes:', error);
        }
    }
}
exports.default = RabbitMQService;
//# sourceMappingURL=RabbitMQService.js.map