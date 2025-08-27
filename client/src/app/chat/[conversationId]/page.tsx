"use client"

import React from "react"
import { useParams } from "next/navigation"
import ChatList from "@/components/ChatList"
import ChatWindow from "@/components/ChatWindow"

export default function ChatWithUser() {
    const params = useParams()
    const conversationId = params.conversationId as string

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 overflow-hidden">
            <div className="flex flex-1 flex-col md:flex-row">
                <div className="hidden md:block w-full md:w-80">
                    <ChatList />
                </div>
                <div className="flex-1">
                    <ChatWindow conversationId={conversationId} />
                </div>
            </div>
        </div>
    )
}