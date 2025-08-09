"use client"
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import { useParams } from "next/navigation";

export default function ChatWithUser() {
    const params = useParams()
    const conversationId = params.conversationId as string
    return (
        <div style={{ display: 'flex', height: '100vh'}}>
            <ChatList/>
            <ChatWindow conversationId={conversationId} />
        </div>
    )
}