import { Router, Request, Response } from 'express';

const router = Router();

interface TemperatureData {
    value: number;
    unit: string;
    timestamp: string;
    location: string;
    status: string;
    sensor_id: string;
    sensor_type: string;
    description: string;
}
function generateRandomTemperature(): number {
    return Math.floor(1800 + Math.random() * 1000) / 100;
}

router.get('/temperature', (req: Request, res: Response) => {
    const location = (req.query.location as string) || 'Unknown';
    const sensorID = '1';

    const data: TemperatureData = {
        value: generateRandomTemperature(),
        unit: '°C',
        timestamp: new Date().toISOString(),
        location: location,
        status: 'active',
        sensor_id: sensorID,
        sensor_type: 'temperature',
        description: `Temperature sensor in ${location}`
    };

    res.json(data);
});

router.get('/temperature/:id', (req: Request, res: Response) => {
    const sensorID = req.params.id;
    if (!sensorID) {
         res.status(400).json({ error: 'Sensor ID is required' });
        return;
    }

    const data: TemperatureData = {
        value: generateRandomTemperature(),
        unit: '°C',
        timestamp: new Date().toISOString(),
        location: sensorID === '1' ? 'Living Room' : 'Unknown',
        status: 'active',
        sensor_id: sensorID,
        sensor_type: 'temperature',
        description: `Temperature sensor with ID ${sensorID}`,
    };

    res.json(data);
});

export default router;