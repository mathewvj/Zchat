import { Router } from "express"
import { uploadVoice } from "../controllers/voiceController"

const router = Router()

router.post("/upload-voice", uploadVoice)

export default router
