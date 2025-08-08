import express from 'express'
import { searchUsers } from '../controllers/userSearch'
import { authenticateUser } from '../middlewares/authMiddleware'

const router = express.Router()

router.get('/search', authenticateUser, searchUsers)

export default router