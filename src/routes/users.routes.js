import { Router } from 'express';

const router = Router()

import * as usersCtrl from '../controllers/users.controllers';

router.post('/', usersCtrl.createUser)
router.get('/', usersCtrl.getAllUser)
router.get('/:userId', usersCtrl.getUser)
router.put('/:userId', usersCtrl.updateUsersById)
router.delete('/:userId', usersCtrl.deleteUsersById)

export default router