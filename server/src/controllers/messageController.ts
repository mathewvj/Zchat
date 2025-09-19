import { Request, Response } from "express";
import Message from "../models/messageModel";
import { AuthRequest } from "../middlewares/authMiddleware";
import Conversation from "../models/Conversation";


export const getMessage = async( req: AuthRequest, res: Response ) => {
    const { conversationId } = req.params

    try {
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).populate('sender','name username').sort({ createdAt: 1})
        res.json(messages)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to get messages'})
    }
}

export const sendMessage = async( req: AuthRequest, res: Response ) =>{
    console.log("Req.body:", req.body)
    const { conversationId, type, text, voiceUrl } = req.body
    
    const senderId = req.user?.id

    try {
        if(!conversationId || !senderId || !type){
            return res.status(400).json({ message: "missing required fields" })
        }

        const newMsg = new Message({
            conversationId,
            sender: senderId,
            type,
            text: type === "text" ? text: undefined,
            voiceUrl: type === "voice" ? voiceUrl: undefined
        })

        await newMsg.save()

        const populateMsg = await Message.findById(newMsg._id).populate('sender', 'name username')
        res.json(populateMsg)
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to send message'})
    }
}


export const editMessage = async(req: AuthRequest, res: Response ) => {
    const { id } = req.params
    const { newText } = req.body
    const userId = req.user?.id
    console.log(req.body)

    try {
        if(!newText) return res.status(400).json({ message: "New text required "})
        
        const msg = await Message.findById(id)
        if(!msg) return res.status(404).json({ message: "Message not found"})

        if(msg.sender.toString() !== userId){
            return res.status(403).json({ message: "Not authorized to edit"})
        }

        const fifteenMinutes = 15 * 60 * 1000
        const createdAt = msg.createdAt.getTime()
        const now = Date.now()

        if(now - createdAt > fifteenMinutes){
            return res.status(400).json({ message: "Edit time window has passed"})
        }

        msg.text = newText
        await msg.save()
        
        const populated = await msg.populate('sender', 'name username')
        res.json(populated)


    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to edit message"})
    }
}

export const deleteMessges = async(req: AuthRequest, res: Response) => {
    const { ids } = req.body
    const userId = req.user?.id

    try {
        if(!Array.isArray(ids) || ids.length === 0){
            return res.status(400).json({ message: "No message ids provided" })
        }

        const result = await Message.deleteMany({
            _id: { $in: ids },
            sender: userId
        })

        res.json({ deletedCount: result.deletedCount})
    } catch (error) {
        console.error("Delete error:", error)
        res.status(500).json({ message: "Failed to delete messages" })
    }
}