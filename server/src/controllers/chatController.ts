import { Response } from "express";
import Conversation, { Iconversation } from "../models/Conversation";
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

        const conversations = await Conversation.find({ participants: userId }).populate("participants", "username name")

        const chatSummaries = await Promise.all(
            conversations.map(async(conversation) => {
                const lastMessage = await Message.findOne({ conversationId: conversation._id}).sort({ createdAt: -1 }).lean()

                const otherUser = (conversation.participants as any[]).find(
                    (p) => p._id.toString() !== userId
                )
                const updateAt = (conversation as Iconversation).updatedAt

                return {
                    _id: conversation._id,
                    user: otherUser,
                    lastMessage : lastMessage?.text || "",
                    lastMessageTime : lastMessage?.createdAt || updateAt,
                }
            })
        )

        chatSummaries.sort((a,b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
        res.status(200).json(chatSummaries)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'failed to fetch recent chats'})
    }
}


export const getConversationUserDetails = async (req: AuthRequest, res : Response ) => {
    try {
        const { conversationId } = req.params

        const conversation = await Conversation.findById(conversationId).populate('participants', '_id name username').lean()
        if(!conversation){
            return res.status(404).json({ message: 'Conversation not found'})
        }

        const isParticipant = conversation.participants.some((p) => p._id.toString() === req.user?.id)
        if(!isParticipant){
            return res.status(403).json({ message: 'Not authorized to view this conversation '})
        }
        res.json(conversation)
    } catch (error) {
        console.error('Error fetching conversation',error)
        res.status(500).json({ message: 'Server error '})
    }
}