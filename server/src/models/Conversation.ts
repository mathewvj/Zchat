import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./User";

export interface Iconversation extends Document{
    participants: (Types.ObjectId | IUser)[]
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