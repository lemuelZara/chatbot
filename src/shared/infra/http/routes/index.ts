import { Router } from 'express';

import { webhookRouter } from './webhook.routes';
import { profileRouter } from './profile.routes';

const routes = Router();

routes.use('/webhook', webhookRouter);
routes.use('/profile', profileRouter);

export { routes };
