'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import UserSearch from "./UserSearch";

interface ChatUser {
    _id: string;
    user: {
        _id: string;
        name: string;
        username: string
    }
    lastMessage: string;
}

export default function ChatList(){
    const [ chats, setChats ] = useState<ChatUser[]>([])
    const router = useRouter()

    useEffect(() =>{
        const token = localStorage.getItem("token")
        const fetchChats = async() =>{

            try {
                const res = await fetch('http://localhost:5000/api/chat/recent',{
                method: "GET",
                headers: {
                    Authorization : `Bearer ${token}`
                }
                })

                if(!res.ok){
                    throw new Error("Failed to fetch chats")
                }

                const data = await res.json()
                setChats(data)

            } catch (error) {
                console.error("Error fetching chatlist :", error)
                setChats([])
            }
            
        }

        fetchChats()
    })

    return(
         <div style={{ width: '30%', borderRight: '1px solid gray', padding: '10px' }}>
      <UserSearch />
      <h3>Recent Chats</h3>
      {chats.length === 0 ? (
        <p>No chats found.</p>
      ) : (
        chats.map((chat) => (
          <div
            key={chat._id || Math.random()}
            onClick={() => router.push(`/chat/${chat._id}`)}
            style={{ cursor: 'pointer', marginBottom: '10px' , color: 'black', background: 'red'}}
          >
            <strong>{ chat.user?.name || chat.user?.username }</strong><br />
            <small>{ chat.lastMessage }</small>
          </div>
        ))
      )}
    </div>
    )
}