import { Router } from 'express';
const router = Router()
import { upload } from '../multerConfig';



import * as preRegisterCtrl from '../controllers/preRegister.controllers';

router.get('/', preRegisterCtrl.emailVerification);
router.get('/allPreRegister/:id/:roles', preRegisterCtrl.getAllPreRegister);
router.get('/getPreRegisterById/:preRegisterId', preRegisterCtrl.getPreRegisterById);
router.get('/emailVerification/:email', preRegisterCtrl.emailVerification);
router.post('/', preRegisterCtrl.createPreRegister);
router.put('/:preRegisterId', preRegisterCtrl.updatePreRegisterById);
router.post('/validatePaymentVoucher', upload.single('file') ,  preRegisterCtrl.validatePaymentVoucher);
router.post('/validateCandidate', preRegisterCtrl.validateCandidate);


export default router