'use strict';

import express from 'express';
import exampleRouter from './routes';

const app = express();
const port = process.env.PORT || 8081;

app.use(express.json());

app.use('/api/v1', exampleRouter);
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});