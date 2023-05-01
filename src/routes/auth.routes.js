import { Router } from 'express'
const router = Router()

import * as authCtrl from '../controllers/auth.controllers'
import { verifySignUp, authJwt } from '../middlewares'


router.post('/signup',
    [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkPassword
    ],
    authCtrl.signUp
)

router.post('/login',
    [
        verifySignUp.existsEmail
    ],
    authCtrl.login
)

router.get('/refreshAccessToken',
    [
        authJwt.verifyToken
    ],
    authCtrl.refreshAccessToken
)


export default router