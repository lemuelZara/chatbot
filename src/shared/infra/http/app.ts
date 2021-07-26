import express from 'express';

import { verifyRequestSignature } from './middlewares';
import { routes } from './routes';

const app = express();

app.use(express.json({ verify: verifyRequestSignature }));
app.use(routes);

export { app };
