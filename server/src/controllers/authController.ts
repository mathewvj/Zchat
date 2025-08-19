import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import { AuthRequest } from '../middlewares/authMiddleware'


export const signup = async ( req: Request, res: Response) => {
    try {
        const { name, username, email, password } = req.body;

        //check if user exists
        const existingUser = await User.findOne({ $or: [{ email} , { username }] })
        if(existingUser) return res.status(400).json({ message: 'Email or username already exists'})

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({ name, username, email, password: hashPassword })
        await newUser.save()

        res.status(201).json({ message: 'User created successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Server error', err})
        console.error(err)
    }
}

export const loginUser = async ( req: Request, res : Response ) =>{
    try {
        const { identifier , password } = req.body

        if(!identifier || !password) return res.status(400).json({ message: 'All fields are required '})

        //find user by username or email
        const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] })

        if(!user) return res.status(404).json({ message: 'User not found'})
        
        if(!user.password) return res.status(400).json({ message: "Please login with google"})

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(401).json({ message: 'Invalid credentials'})
        
        //create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!,{
            expiresIn: '7d',
        })

        const { password:_, ...userData } = user.toObject()
        return res.status(200).json({ message: 'Login successful', token, user: userData })
    } catch (error:any) {
        console.error(error.message)
        return res.status(500).json({ message: 'Login failed', error: error.message })
        
        
    }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleAuth =  async(req : AuthRequest, res: Response ) => {
    try {
        const { idToken } = req.body

        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        
        const payload = ticket.getPayload()
        if(!payload) throw new Error("invalid google token")

        const { sub: googleId, email, name } = payload

        let user = await User.findOne({ email })

        if(!user) {
            const username = email?.split("@")[0]
            user = await User.create({ name, username, email, googleId })
        }else if(!user.googleId){
            user.googleId = googleId
            await user.save()
        }

        const appToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" } 
        ) 

        res.json({ success: true, token: appToken, user })

    } catch (error : any) {
        console.error("something wrong:", error)
        res.status(400).json({ success: false, message: error.message})
    }
}