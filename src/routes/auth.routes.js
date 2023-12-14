import { Router } from 'express';
const router = Router();

import * as authCtrl from '../controllers/auth.controllers'
import { verifySignUp, authJwt } from '../middlewares'


router.post('/signup',
    [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkPassword
    ],
    authCtrl.signUp
)
router.post('/forgot-password-email', authCtrl.forgotPasswordEmail);

router.put('/update-password', authCtrl.updatedPassword);

router.post('/activation', authCtrl.activation)

router.post('/login', authCtrl.login)

router.get('/logout', authCtrl.logout)

router.get('/refreshAccessToken',
    [
        authJwt.verifyToken
    ],
    authCtrl.refreshAccessToken
)
router.get('/refresh-token', authCtrl.refreshToken)


export default router