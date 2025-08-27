"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import UserSearch from "./UserSearch"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from "lucide-react"

interface ChatUser {
    _id: string
    user: {
        _id: string
        name: string
        username: string
    }
    lastMessage: string
    lastMessageTime?: string // Optional: for timestamp
    unreadCount?: number // Optional: for unread message indicators
}

export default function ChatList() {
    const [chats, setChats] = useState<ChatUser[]>([])
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        const fetchChats = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/chat/recent", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!res.ok) {
                    throw new Error("Failed to fetch chats")
                }

                const data = await res.json()
                setChats(data)
            } catch (error) {
                console.error("Error fetching chatlist:", error)
                setChats([])
            }
        }

        fetchChats()
    })

    return (
        <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-full md:w-80 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse-slow">
                            <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Zchat</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Chats</h3>
                    <UserSearch />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {chats.length === 0 ? (
                    <p className="p-4 text-gray-500 dark:text-gray-400 text-center animate-fade-in">No chats found.</p>
                ) : (
                    chats.map((chat) => (
                        <Card
                            key={chat._id || Math.random()}
                            onClick={() => router.push(`/chat/${chat._id}`)}
                            className="cursor-pointer bg-white dark:bg-gray-800 border-none shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg"
                            aria-label={`Chat with ${chat.user?.name || chat.user?.username}`}
                        >
                            <CardContent className="p-3 flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                        {(chat.user?.name || chat.user?.username)?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-medium text-gray-900 dark:text-white truncate">
                                            {chat.user?.name || chat.user?.username}
                                        </p>
                                        {chat.lastMessageTime && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {chat.lastMessage}
                                    </p>
                                </div>
                                {chat.unreadCount && chat.unreadCount > 0 ? (
                                    <Badge className="bg-primary text-white">
                                        {chat.unreadCount}
                                    </Badge>
                                ) : null}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}