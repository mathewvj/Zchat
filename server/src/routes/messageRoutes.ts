import express from 'express'
import { deleteMessges, editMessage, getMessage, sendMessage } from '../controllers/messageController'
import { authenticateUser } from '../middlewares/authMiddleware'


const router = express.Router()

router.get('/:conversationId', authenticateUser, getMessage)
router.post('/send', authenticateUser, sendMessage )
router.patch('/edit/:id', authenticateUser, editMessage)
router.delete("/delete", authenticateUser, deleteMessges)

export default router