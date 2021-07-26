import { ProfileHelper } from '../../helpers/profile-helper';
import { config } from '../../../../shared/utils';
import { AppError } from '../../../../shared/errors';

type HttpRequest = {
  token: string;
  mode: string;
};

export class SetupProfileUseCase {
  constructor(private profileHelper: ProfileHelper) {}

  public async execute({ token, mode }: HttpRequest): Promise<void> {
    if (token && mode) {
      if (token === config.verifyToken) {
        if (mode === 'all') {
          Promise.all([
            this.profileHelper.setWebhook(),
            this.profileHelper.setGetStarted(),
            this.profileHelper.setGreeting(),
            this.profileHelper.setPersistentMenu(),
            this.profileHelper.setWhitelistedDomains()
          ]).then((values) => console.log(values));
        }
      } else {
        throw new AppError('Invalid token!');
      }
    } else {
      throw new AppError('Missing token and mode!');
    }
  }
}
