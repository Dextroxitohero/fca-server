import { Router } from 'express';
// import express from 'express';
const router = Router()
import { upload } from '../multerConfig'


// Agregar el middleware para analizar los datos del formulario
// router.use(express.urlencoded({ extended: true }));

import * as preRegisterCtrl from '../controllers/preRegister.controllers';
import { uploadImage } from '../middlewares';

router.get('/', preRegisterCtrl.emailVerification)
router.get('/allPreRegister', preRegisterCtrl.getAllPreRegister)
router.get('/emailVerification/:email', preRegisterCtrl.emailVerification)
router.post('/', preRegisterCtrl.createPreRegister)
router.put('/:preRegisterId', preRegisterCtrl.updatePreRegisterById)
router.post('/validatePaymentVoucher', upload.single('file') ,  preRegisterCtrl.validatePaymentVoucher)


export default router