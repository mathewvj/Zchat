import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware"; 
import multer from "multer";
import path from "path"
import { error } from "console";

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../uploads"),
    filename: (req, file, cb) => {
        cb(null, `voice-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage }).single("voice")

export const uploadVoice = (req: AuthRequest, res: Response) => {
    upload(req, res, (err) =>{
        if(err) {
            console.error(err)
            return res.status(500).json({ error: 'upload failed'})
        }
        if(!req.file){
            return res.status(400).json({ error: " no file uploaded"})
        }

        const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`
        res.json({ fileUrl })
    }) 
}