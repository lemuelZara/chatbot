import { Request, Response } from 'express';

import { SetupProfileUseCase } from './setup-profile-usecase';

import { ProfileHelper } from '../../helpers/profile-helper';

import { config } from '../../../../shared/utils';

type QueryParams = {
  verify_token: string;
  mode: string;
};

export class SetupProfileController {
  public async handle(
    httpRequest: Request<any, any, any, QueryParams>,
    httpResponse: Response
  ): Promise<Response> {
    const profileHelper = new ProfileHelper();
    const setupProfileUseCase = new SetupProfileUseCase(profileHelper);

    const { verify_token: token, mode } = httpRequest.query;

    if (!config.webhookUrl().startsWith('https://')) {
      return httpResponse
        .status(200)
        .send('ERROR - Need a proper API_URL in the .env file');
    }

    try {
      await setupProfileUseCase.execute({ token, mode });

      return httpResponse
        .status(200)
        .json({ message: 'Success configuration!' });
    } catch (error) {
      return httpResponse.status(500).json({ message: error.message });
    }
  }
}
