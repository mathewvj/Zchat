import mongoose, { Schema, Document } from "mongoose";

export interface Iconversation extends Document{
    participants: string[]
    createdAt: Date
    updatedAt: Date
}

const conversationSchema = new Schema<Iconversation>(
    {
        participants: [ { type: Schema.Types.ObjectId, ref: 'User' }]
    },
    { timestamps: true }
)

export default mongoose.model<Iconversation>('Conversation', conversationSchema)