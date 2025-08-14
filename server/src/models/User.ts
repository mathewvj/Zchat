import mongoose, { Document, Types} from "mongoose";

export interface IUser extends Document{
    _id: Types.ObjectId
    name: string
    username: string,
    email: string
    password?: string
    googleId?: string
    createdAt: Date
    updatedAt: Date
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type:String,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        }
    },
    { timestamps: true }
)

export default mongoose.model<IUser>("User",userSchema)