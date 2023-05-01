import { Router } from 'express';

const router = Router()

import * as usersCtrl from '../controllers/users.controllers';

router.post('/', usersCtrl.createUser)
router.get('/', usersCtrl.getUsers)
router.get('/:userId', usersCtrl.getUsersById)
router.put('/:userId', usersCtrl.updateUsersById)
router.delete('/:userId', usersCtrl.deleteUsersById)

export default router