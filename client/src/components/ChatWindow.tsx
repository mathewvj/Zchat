"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import socket from "@/lib/socket"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Send, ArrowLeft } from "lucide-react"
import VoiceRecorder from "./VoiceRecorder"

interface Message {
    _id: string
    text?: string
    voiceUrl?: string
    sender: {
        _id: string
        name?: string
        username?: string
    }
    type: "text" | "voice"
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

export default function ChatWindow({ conversationId }: { conversationId: string }) {
    const [messages, setMessages] = useState<Message[]>([])
    const [text, setText] = useState("")
    const [chatPartner, setChatPartner] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(!conversationId) return

        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }



        const token = localStorage.getItem("token")

        const fetchConversationDetails = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/chat/${conversationId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const conversation: Conversation = await res.json()
                const userId = localStorage.getItem("userId")

                const otherUser = conversation.participants.find((p) => p._id !== userId)
                if (otherUser) {
                    setChatPartner(otherUser.name || otherUser.username)
                }
            } catch (error) {
                console.error("Error fetching conversation details:", error)
            }
        }

        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/message/${conversationId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                const data = await res.json()
                setMessages(data)
                scrollToBottom()
            } catch (error) {
                console.error("Error fetching messages:", error)
            }
        }

        fetchMessages()
        fetchConversationDetails()

        socket.emit("joinRoom", conversationId)

        socket.on("receiveMessage", (newMsg: Message) => {
            setMessages((prev) => [...prev, newMsg])
            scrollToBottom()
        })

        // socket.on("receiveVoice", (fileUrl: string) => {
        //     const newVoiceMsg: Message = {
        //         _id: Date.now().toString(),
        //         sender: { _id: "other"},
        //         type: "voice",
        //         voiceUrl: fileUrl,
        //         createdAt: new Date().toDateString()

        //     }
        //     setMessages((prev) => [...prev, newVoiceMsg])
        //     scrollToBottom()
        // })

        return () => {
            socket.off("receiveMessage")
            // socket.off("receiveVoice")
        }
        
    }, [conversationId])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!text.trim()) return

        setIsLoading(true)
        try {
            const token = localStorage.getItem("token")
            const res = await fetch("http://localhost:5000/api/message/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
                body: JSON.stringify({ conversationId, type: "text", text }),
            })

            if (!res.ok) {
                const err = await res.json()
                console.error("Send error:", err.message)
                return
            }

            const newMsg = await res.json()
            setMessages((prev) => [...prev, newMsg])
            socket.emit("sendMessage", {
                roomId: conversationId,
                message: newMsg,
            })
            setText("")
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        } catch (error) {
            console.error("Error sending message:", error)
        } finally {
            setIsLoading(false)
        }

        
    }
    const handleVoice = async( audioBlob: Blob) =>{
            const formData = new FormData()
            formData.append("voice", audioBlob, `voice-${Date.now()}.webm`)

           try {
            //upload file to backend
            const token = localStorage.getItem("token")
             const uploadRes = await fetch("http://localhost:5000/api/voice/upload-voice",{
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const { fileUrl } = await uploadRes.json()

            //save message in DB
            
            const msgRes = await fetch("http://localhost:5000/api/message/send",{
                method: "POST",
                headers: { "Content-Type" : "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ conversationId, type: "voice", voiceUrl: fileUrl})
            })

            const newVoiceMsg : Message = await msgRes.json()

            setMessages((prev) => [...prev, newVoiceMsg])

            socket.emit("sendMessage",{
                roomId: conversationId,
                message: newVoiceMsg,
            })
            
           } catch (error) {
            console.error("Voice upload error", error)
           }
        }

    return (
        <div className="h-screen w-full flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
            {/* Fixed header with chat partner's name and Back button */}
            <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shrink-0">
                <div className="flex items-center space-x-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => router.push("/chat")}
                        aria-label="Back to chat list"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-900 dark:text-white" />
                    </Button>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {chatPartner || "Loading..."}
                    </p>
                </div>
            </CardHeader>

            {/* Scrollable messages section */}
            <style jsx>{`
                .custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background-color: #d1d5db;
                    border-radius: 3px;
                }
                .dark .custom-scroll::-webkit-scrollbar-thumb {
                    background-color: #4b5563;
                }
            `}</style>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 animate-fade-in">
                        No messages yet. Start the conversation!
                    </p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`flex ${
                                msg.sender._id === localStorage.getItem("userId")
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-xs p-3 rounded-lg ${
                                    msg.sender._id === localStorage.getItem("userId")
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                }`}
                            >
                               {msg.type === "voice" && msg.voiceUrl ? (
                                <audio controls src={msg.voiceUrl} className="w-40"></audio>):( <p className="text-sm">{msg.text}</p>)
                               }
                                <p className="text-xs text-gray-300 dark:text-gray-500 mt-1">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Fixed input area */}
            <CardContent className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
                <form onSubmit={handleSend} className="flex items-center space-x-2">
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                        aria-label="Type a message"
                    />

                    {text.trim() ? (
                         <Button
                            type="submit"
                            disabled={isLoading || !text.trim()}
                            className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            aria-label="Send message"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    ):(
                        <VoiceRecorder onSend={handleVoice}/>
                    )}
                    
                   
                </form>
            </CardContent>
        </div>
    )
}