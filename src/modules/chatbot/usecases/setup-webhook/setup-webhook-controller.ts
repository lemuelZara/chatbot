import { Request, Response } from 'express';

import { ReceiveHelper } from '../../helpers/receive-helper';

import { config } from '../../../../shared/utils';

export class SetupWebhookController {
  public async handleVerificationWebhook(
    httpRequest: Request,
    httpResponse: Response
  ): Promise<Response> {
    const mode = httpRequest.query['hub.mode'];
    const token = httpRequest.query['hub.verify_token'];
    const challenge = httpRequest.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === config.verifyToken) {
        console.log('WEBHOOK_VERIFIED');

        return httpResponse.status(200).send(challenge);
      }

      return httpResponse.sendStatus(403);
    }

    return httpResponse.sendStatus(201);
  }

  public async handleIncomingMessage(
    httpRequest: Request,
    httpResponse: Response
  ): Promise<Response> {
    const { body } = httpRequest;

    if (body.object === 'page') {
      body.entry.forEach(async (entry) => {
        entry.messaging.forEach(async (webhookEvent) => {
          console.log(webhookEvent);
          console.log('Sender PSID: ', webhookEvent.sender.id);

          const receiveMessage = new ReceiveHelper(
            webhookEvent.sender,
            webhookEvent
          );

          return receiveMessage.handleMessage();
        });
      });

      return httpResponse.status(200).send('EVENT_RECEIVED');
    }

    return httpResponse.sendStatus(403);
  }
}
