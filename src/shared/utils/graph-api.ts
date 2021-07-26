import axios from 'axios';
import { URL, URLSearchParams } from 'url';

import { config } from './env';

enum MessagingTypes {
  'RESPONSE',
  'UPDATE',
  'MESSAGE_TAG'
}

type SendMessageRequest = {
  messaging_type?: MessagingTypes;
  recipient: {
    id: string;
    user_ref?: string;
    post_id?: string;
    commend_id?: string;
  };
  message: {
    text: string;
    attachment?: { type: string; payload: any };
  };
};

type SendMessageProfileRequest = {
  get_started?: { payload: string };
  greeting?: Array<{ locale: string; text: string }>;
  persistent_menu?: any;
  whitelisted_domains?: any;
};

type SubscriptionsResponse = {
  success: boolean | undefined;
};

type SubscribedAppsResponse = {
  success: boolean | undefined;
};

type MessengerProfileResponse = {
  success: boolean | undefined;
};

export class GraphApi {
  public static async callSendApi(
    requestBody: SendMessageRequest
  ): Promise<void> {
    const url = new URL(`${config.apiUrl()}/me/messages`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken
    }).toString();

    const response = await axios.post(url.toString(), requestBody);

    if (response.status === 200) {
      console.log('Request sent.');
    } else {
      console.error(`Unable to callSubscriptionsAPI: ${response.statusText}`);
    }
  }

  // Configura os eventos iniciais ao iniciar o chat
  public static async callMessengerProfileApi(
    requestBody: SendMessageProfileRequest
  ): Promise<MessengerProfileResponse> {
    const url = new URL(`${config.apiUrl()}/me/messenger_profile`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken
    }).toString();

    try {
      const response = await axios.post(url.toString(), requestBody);
      return { success: response.status === 200 };
    } catch (error) {
      console.error('callMessengerProfileApi', error);
      return { success: false };
    }
  }

  // Se inscreve em eventos do Webhook para o aplicativo
  public static async callSubscriptionsApi(
    customFields?: string
  ): Promise<SubscriptionsResponse> {
    let fields =
      'messages, messaging_postbacks, messaging_optins, ' +
      'message_deliveries, messaging_referrals';

    if (customFields !== undefined) {
      fields = `${fields}, ${customFields}`;
    }

    const url = new URL(`${config.apiUrl()}/${config.appId}/subscriptions`);
    url.search = new URLSearchParams({
      access_token: `${config.appId}|${config.appSecret}`,
      object: 'page',
      callback_url: config.webhookUrl(),
      verify_token: config.verifyToken,
      fields,
      include_values: 'true'
    }).toString();

    const response = await axios.post(url.toString());

    return { success: response.status === 200 };
  }

  // Retorna os eventos do Webhook no qual a aplicativo está inscrito
  public static async callSubscribedApps(
    customFields?: string
  ): Promise<SubscribedAppsResponse> {
    let fields =
      'messages, messaging_postbacks, messaging_optins, ' +
      'message_deliveries, messaging_referrals';

    if (customFields !== undefined) {
      fields = `${fields}, ${customFields}`;
    }

    const url = new URL(`${config.apiUrl()}/${config.pageId}/subscribed_apps`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken,
      subscribed_fields: fields
    }).toString();

    const response = await axios.post(url.toString());

    return { success: response.status === 200 };
  }
}
