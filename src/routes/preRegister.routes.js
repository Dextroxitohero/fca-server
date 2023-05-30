import { Router } from 'express';

const router = Router()

import * as preRegisterCtrl from '../controllers/preRegister.controllers';

router.get('/', preRegisterCtrl.getAllPreRegister)
router.post('/', preRegisterCtrl.createPreRegister)
router.put('/:preRegisterId', preRegisterCtrl.updatePreRegisterById)


export default router