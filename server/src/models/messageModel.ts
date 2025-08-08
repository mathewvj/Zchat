import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {

    conversationId : Types.ObjectId
    sender: Types.ObjectId
    text : string
    createdAt: Date
}


const messageSchema = new Schema<IMessage>(
    {
        conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation'},
        sender: { type: Schema.Types.ObjectId, ref: 'User'},
        text: String

    },
    { timestamps: true }
)


const Message = mongoose.model<IMessage>('Message', messageSchema)
export default Message