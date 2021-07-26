import { Router } from 'express';

import { SetupProfileController } from '../../../../modules/profile/usecases/setup-profile';

const profileRouter = Router();

const setupProfileController = new SetupProfileController();

profileRouter.get('/', setupProfileController.handle);

export { profileRouter };
