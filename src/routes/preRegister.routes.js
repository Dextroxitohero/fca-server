import { Router } from 'express';

const router = Router()

import * as preRegisterCtrl from '../controllers/preRegister.controllers';

router.post('/', preRegisterCtrl.createPreRegister)
router.get('/:preRegisterId', preRegisterCtrl.updatePreRegisterById)


export default router