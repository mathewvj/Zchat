import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/User";

export const searchUsers = async(req: AuthRequest, res : Response) => {
    const query = req.query.q?.toString() || ''
    const userId = req.user?.id

    try {
        const users = await User.find({
            _id: {$ne: userId},
            $or: [
                { username: new RegExp(query, 'i')},
                { name: new RegExp(query, 'i')}
            ]
        }).select('_id username name')

        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Search failed'})
    }
}