// irvingchampo-apisecurity/src/index.ts

import express from 'express';
import cors from 'cors';
import { SensorController } from './temperature/interfaces/SensorController';
import { SaveSensorDataUseCase } from './temperature/application/SaveSensorDataUseCase';
import { GetLatestSensorDataUseCase } from './temperature/application/GetLatestSensorDataUseCase';
import { SensorUltrasonicController } from './sensor/interfaces/sensor/SensorUltrasonicController';
import { SaveSensorUltrasonicDataUseCase } from './sensor/application/sensor/SaveSensorUltrasonicDataUseCase';
import { GetLatestSensorUltrasonicDataUseCase } from './sensor/application/sensor/GetLatestSensorUltrasonicDataUseCase';
import { InMemorySensorRepository } from './temperature/adapters/InMemorySensorRepository';
import { InMemorySensorUltrasonicRepository } from './sensor/adapters/sensor/InMemorySensorUltrasonicRepository';
import RabbitMQService from './temperature/services/RabbitMQService';

// Variable para controlar el estado del sistema (caído, lento, etc.)
let systemState = { isDown: false, isSlow: false };
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const startServer = async () => {
    console.log('Iniciando servicios de la aplicación...');

    // Inicialización de la lógica de negocio con repositorios en memoria
    const sensorRepository = new InMemorySensorRepository();
    const sensorUltrasonicRepository = new InMemorySensorUltrasonicRepository();

    const saveSensorDataUseCase = new SaveSensorDataUseCase(sensorRepository);
    const getLatestSensorDataUseCase = new GetLatestSensorDataUseCase(sensorRepository);
    const saveSensorUltrasonicDataUseCase = new SaveSensorUltrasonicDataUseCase(sensorUltrasonicRepository);
    const getLatestSensorUltrasonicDataUseCase = new GetLatestSensorUltrasonicDataUseCase(sensorUltrasonicRepository);

    const sensorController = new SensorController(saveSensorDataUseCase, getLatestSensorDataUseCase);
    const sensorUltrasonicController = new SensorUltrasonicController(saveSensorUltrasonicDataUseCase, getLatestSensorUltrasonicDataUseCase);

    // --- RUTAS DE CONTROL INTERNO (para pruebas y scripts) ---
    // Estas rutas no deben ser expuestas públicamente en un entorno de producción real.
    app.post('/api/simulation/fail', (req, res) => {
        systemState.isDown = true;
        res.status(200).send({ message: 'System state updated to: DOWN' });
    });
    app.post('/api/simulation/recover', (req, res) => {
        systemState.isDown = false;
        systemState.isSlow = false;
        res.status(200).send({ message: 'System state updated to: UP' });
    });
    app.post('/api/simulation/slowdown', (req, res) => {
        systemState.isSlow = true;
        res.status(200).send({ message: 'System state updated to: SLOW' });
    });

    // --- RUTA DE HEALTH CHECK (para monitoreo) ---
    // Se coloca antes del middleware para que siempre responda.
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
    });

    // --- MIDDLEWARE DE ESTADO ---
    // Afecta a todas las rutas de la aplicación que se definan después de él.
    app.use((req, res, next) => {
        if (systemState.isDown) {
            return res.status(503).json({ message: 'Service Unavailable' });
        }
        if (systemState.isSlow) {
            setTimeout(next, 2500);
        } else {
            next();
        }
    });

    // --- RUTAS PRINCIPALES DE LA APLICACIÓN ---
    app.get('/api/sensor/latest', (req, res) => sensorController.getLatestSensorData(req, res));
    app.get('/api/sensor/ultrasonic/latest', (req, res) => sensorUltrasonicController.getLatestSensorUltrasonicData(req, res));
    
    // Inicia el servicio que genera los datos de los sensores
    const rabbitMQService = new RabbitMQService(saveSensorDataUseCase, saveSensorUltrasonicDataUseCase);
    rabbitMQService.consumeMessages();

    // Inicia el servidor
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
};

startServer();