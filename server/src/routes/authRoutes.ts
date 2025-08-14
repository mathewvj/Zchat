import express from 'express'
import { signup, loginUser, googleAuth } from '../controllers/authController'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', loginUser)
router.post('/google', googleAuth)

export default router