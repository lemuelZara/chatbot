import { Router } from 'express';

import { SetupWebhookController } from '../../../../modules/chatbot/usecases/setup-webhook';

const webhookRouter = Router();

const setupWebhookController = new SetupWebhookController();

webhookRouter.post('/', setupWebhookController.handleIncomingMessage);
webhookRouter.get('/', setupWebhookController.handleVerificationWebhook);

export { webhookRouter };
