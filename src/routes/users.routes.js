import { Router } from 'express';
import upload from '../multerConfig'

const router = Router()

import * as usersCtrl from '../controllers/users.controllers';
import { authJwt } from '../middlewares';

router.post('/' ,usersCtrl.createUser)
// router.get('/', usersCtrl.getAllUser)
router.get('/', 
    [
        authJwt.verifyToken
    ], 
usersCtrl.getUser)
router.put('/:userId', usersCtrl.updateUsersById)
router.delete('/:userId', usersCtrl.deleteUsersById)

export default router