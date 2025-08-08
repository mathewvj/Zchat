import express from 'express'
import { getMessage, sendMessage } from '../controllers/messageController'
import { authenticateUser } from '../middlewares/authMiddleware'


const router = express.Router()

router.get('/:conversationId', authenticateUser, getMessage)
router.post('/send', authenticateUser, sendMessage )

export default router