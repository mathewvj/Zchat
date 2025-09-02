import express from "express"
import { uploadVoice } from "../controllers/voiceController"
import { authenticateUser } from "../middlewares/authMiddleware"

const router = express.Router()

router.post("/upload-voice", authenticateUser, uploadVoice)

export default router
