import { Router } from 'express';
const router = Router();

import * as refreshTokenCtrl from '../controllers/refreshToken.controllers';

router.get('/', refreshTokenCtrl.refreshToken);

export default router;