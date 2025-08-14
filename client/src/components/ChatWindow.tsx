'use client'

import { useState, useEffect } from "react"
import socket from "@/lib/socket";


interface Message {
    _id: string;
    text: string;
    sender: {
        _id: string;
        name: string;
        username: string;
    }
    createdAt: string
}

interface Conversation {
    _id: string
    participants: {
        _id: string
        name: string
        username: string
    }[]
}


export default function ChatWindow({ conversationId} : { conversationId: string}){
    const [ messages, setMessages ] = useState<Message[]>([])
    const [ text, setText ] = useState('')
    const [  chatPartner, setChatPartner ] = useState<string>('')

    console.log('conversationid:',conversationId)

    useEffect(() =>{
        const token = localStorage.getItem("token")

        const fetchConversationDetails = async() => {
            const res = await fetch(`http://localhost:5000/api/chat/${conversationId}`,{
                headers: { Authorization : `Bearer ${token}`}
            })
            const conversation : Conversation = await res.json()
            const userId = localStorage.getItem("userId")

            const otherUser = conversation.participants.find(p => p._id !== userId )
            if(otherUser) {
                setChatPartner(otherUser.name || otherUser.username)
            }
        }

        const fetchMessages = async () =>{
            const res = await fetch(`http://localhost:5000/api/message/${conversationId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json()
            console.log("converstion data", data)
            setMessages(data)
        }

        if(conversationId) {
                fetchMessages()
                fetchConversationDetails()

                socket.emit('joinRoom', conversationId)

                socket.on('receiveMessage',( newMsg: Message) => {
                setMessages((prev) => [...prev, newMsg])
            })

            //cleanup
            return () => {
                socket.off('receiveMessage')
            }
        }
 
        

    },[conversationId])

    const handleSend = async () => {
        if(!text.trim()) return
        const token = localStorage.getItem('token')

        const res = await fetch('http://localhost:5000/api/message/send',{
            method: 'POST',
            headers: { 'Content-Type' : 'application/json', Authorization : `Bearer ${token}` },
            credentials: 'include',
            body: JSON.stringify({ conversationId, text })
        })
        if (!res.ok) {
            const err = await res.json();
            console.error("Send error:", err.message);
            return;
        }

        const newMsg = await res.json()
        setMessages((prev) => [...prev, newMsg])
        socket.emit('sendMessage' ,{
            roomId: conversationId,
            message: newMsg
        })
        setText('')
    }

    return (
            <div style={{ width: '70%', padding: '10px' }}>
                { chatPartner && (
                    <div style={{ fontWeight: 'bold', paddingBottom: '10px' , borderBottom: '1px solid #ccc'}}>
                        { chatPartner }
                    </div>
                )}
                <div>
                    {messages.length === 0 ? (
                    <p>No messages yet.</p>
                    ) : (
                    messages.map((msg) => (
                        <div key={msg._id}>
                        <strong>{msg.sender?.name || msg.sender?.username}</strong>: {msg.text}
                        </div>
                    ))
                    )}
                </div>
                <input type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message"
                />

                <button onClick={handleSend}>Send</button>

            </div>
    )
}