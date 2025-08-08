import express from 'express'
import { signup, loginUser } from '../controllers/authController'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', loginUser)

export default router