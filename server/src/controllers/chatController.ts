import { Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/messageModel";
import User from "../models/User";
import { AuthRequest } from '../middlewares/authMiddleware'


export const getOrCreateConversation = async( req: AuthRequest, res: Response ) => {
    const { otherUserId } = req.body
    const userId = req.user?.id

    try {
        let conversation = await Conversation.findOne({
            participants : { $all: [ userId, otherUserId], $size: 2 }
        })

        if(!conversation) {
            conversation = await Conversation.create({
                participants: [ userId, otherUserId ]
            })
        }

        res.json(conversation)
    } catch (error) {
        res.status(500).json({ error: 'server error' })
    }
}

export const getRecentChats = async (req: AuthRequest, res: Response ) => {
    try {
        const userId = req.user?.id

        const conversations = await Conversation.find({ participants: userId }).populate("participants", "username name").sort({ updatedAt: -1})

        const chatSummaries = await Promise.all(
            conversations.map(async(conversation) => {
                const lastMessage = await Message.findOne({ conversationId: conversation._id}).sort({ createdAt: -1 }).lean()

                const otherUser = (conversation.participants as any[]).find(
                    (p) => p._id.toString() !== userId
                )

                return {
                    _id: conversation._id,
                    user: otherUser,
                    lastMessage : lastMessage?.text || "",
                    lastMessageTime : lastMessage?.createdAt,
                }
            })
        )
        res.status(200).json(chatSummaries)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'failed to fetch recent chats'})
    }
}
