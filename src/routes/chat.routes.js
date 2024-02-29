import { Router } from 'express';

const router = Router();

import * as chatCtrl from '../controllers/chat.controllers';

router.get(`/getAllMessagesFromChatByIdCourse/:courseId`, chatCtrl.getAllMessagesFromChatByIdCourse);

router.post(`/addMessageToChat/:courseId`, chatCtrl.addMessageToChat);
router.delete(`/deleteMessageToChat/:courseId`, chatCtrl.deleteMessageFromChat);

export default router;