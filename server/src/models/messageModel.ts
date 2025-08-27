import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {

    conversationId : Types.ObjectId
    sender: Types.ObjectId
    type: "text" | "voice"
    text?: string
    voiceUrl?: string
    createdAt: Date
}


const messageSchema = new Schema<IMessage>(
    {
        conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation'},
        sender: { type: Schema.Types.ObjectId, ref: 'User'},
        type: { type: String, enum:[ "text", "voice" ], required: true },
        text: { type: String},
        voiceUrl: { type: String }

    },
    { timestamps: true }
)


const Message = mongoose.model<IMessage>('Message', messageSchema)
export default Message