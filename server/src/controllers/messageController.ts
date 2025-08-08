import { Request, Response } from "express";
import Message from "../models/messageModel";
import { AuthRequest } from "../middlewares/authMiddleware";


export const getMessage = async( req: AuthRequest, res: Response ) => {
    const { conversationId } = req.params

    try {
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).populate('sender','username name').sort({ createdAt: 1})
        res.json(messages)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to get messages'})
    }
}

export const sendMessage = async( req: AuthRequest, res: Response ) =>{
    const { conversationId, text } = req.body
    const senderId = req.user?.id

    try {
        const newMsg = await Message.create({
            conversationId,
            sender: senderId,
            text
        })

        res.json(newMsg)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to send message'})
    }
}