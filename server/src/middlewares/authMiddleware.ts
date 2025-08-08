import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'


interface AuthPayload {
    id: string
} 

export interface AuthRequest extends Request {
    user?: AuthPayload
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction ) =>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({ message: 'Access denied. No token provided'})
    }
    const token = authHeader?.split(" ")[1]

    try {
        const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as JwtPayload
        
        if( typeof decoded === 'object' && decoded && "id" in decoded){
            req.user = { id: decoded.id as string }
            next()
        } else {
            return res.status(401).json({ message: 'Invalid token payload'})
        }
    } catch (error) {
        console.error(error)
        return res.status(401).json({ message:'invalid token'})
    }
}