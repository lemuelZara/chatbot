import { Request, Response } from 'express';
import crypto from 'crypto';

import { config } from '../../../utils';

export function verifyRequestSignature(
  httpRequest: Request,
  httpResponse: Response,
  buf: string | NodeJS.ArrayBufferView
) {
  const signature = httpRequest.headers['x-hub-signature'] as string;

  if (!signature) {
    console.warn(`Couldn't find "x-hub-signature" in headers.`);
  } else {
    const elements = signature.split('=');
    const signatureHash = elements[1];
    const expectedHash = crypto
      .createHmac('sha1', config.appSecret)
      .update(buf)
      .digest('hex');

    if (signatureHash !== expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}
