import express from 'express'
import { getOrCreateConversation, getRecentChats } from '../controllers/chatController'
import { authenticateUser } from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/start',authenticateUser, getOrCreateConversation)
router.get('/recent', authenticateUser, getRecentChats )

export default router