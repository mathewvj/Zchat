"use client"

import React from "react"
import ChatList from "@/components/ChatList"
import { Card, CardContent } from "@/components/ui/card"

export default function ChatPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 overflow-hidden">
            <div className="flex flex-1 flex-col md:flex-row">
                <div className="w-full md:w-80">
                    <ChatList />
                </div>
                <div className="hidden md:flex flex-1 items-center justify-center p-4">
                    <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
                        <CardContent className="py-8 text-center">
                            <p className="text-lg text-gray-500 dark:text-gray-400 animate-fade-in">
                                Select a user to start chatting
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}