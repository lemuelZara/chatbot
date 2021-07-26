import { GraphApi } from '../../../shared/utils';
import { ResponseHelper } from './response-helper';

export class ReceiveHelper {
  constructor(private user: any, private webhookEvent: any) {}

  public handleMessage() {
    const event = this.webhookEvent;

    let responses = {};

    try {
      if (event.message) {
        const { message } = event;

        if (message.quick_reply) {
          responses = 'this.handleQuickReply()';
        } else if (message.attachments) {
          responses = 'this.handleAttachmentMessage()';
        } else if (message.text) {
          responses = 'this.handleTextMessage()';
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      }
    } catch (error) {
      console.error(error);
    }

    /* eslint no-restricted-syntax: off */
    if (Array.isArray(responses)) {
      let delay = 0;

      for (const response of responses) {
        this.sendMessage(response, delay * 2000);
        delay += 1;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  public handlePostback() {
    const { postback } = this.webhookEvent;

    let payload;

    if (postback.payload) {
      payload = postback.payload;
    }

    return this.handlePayload(payload.toUpperCase());
  }

  public handlePayload(payload) {
    console.log('Received Payload:', `${payload}`);

    let response = {};

    if (payload === 'GET_STARTED') {
      response = ResponseHelper.genNuxMessage();
    }

    return response;
  }

  public sendMessage(response, delay = 0) {
    const requestBody = {
      recipient: {
        id: this.user.id
      },
      message: response
    };

    setTimeout(() => GraphApi.callSendApi(requestBody), delay);
  }
}
