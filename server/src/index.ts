import express from 'express'
import dotenv  from 'dotenv'
import cors from 'cors'
import path from 'path'
import connectDB from './config/db'
import authRoutes from './routes/authRoutes'
import chatRoutes from './routes/chatRoutes'
import http from 'http'
import { Server } from 'socket.io' 
import messageRoutes from './routes/messageRoutes'
import searchRoutes from './routes/searchRoutes'
import voiceRouets from './routes/voiceRoutes'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/uploads",express.static(path.join(__dirname, "../uploads")))

connectDB()

const server = http.createServer(app)

//setup socket server
const io = new Server(server,{
    cors:{
        origin: 'http://localhost:3000',
        methods: [ 'GET', 'POST' ],
    },
})

io.on("connection", (socket) => {
    console.log('A user connected:', socket.id)

    socket.on("joinRoom", ( roomId ) => {
        socket.join(roomId)
        console.log(`User ${socket.id} joined room ${roomId}`)
    }) 

    socket.on("sendMessage", ({ roomId, message }) => {
        socket.to(roomId).emit("receiveMessage", message)
        console.log(`message sent to room ${roomId}:`, message)
    })

    // socket.on("sendVoice", ({ roomId, message }) => {
    //     socket.to(roomId).emit("receiveVoice", message)
    // })

    socket.on("disconnect", () => {
        console.log(" User disconnected:", socket.id)
    })
})

app.use('/api/auth',authRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
app.use('/api/users',searchRoutes)
app.use('/api/voice', voiceRouets)

server.listen(PORT,()=>{
    console.log('Server running......')
})