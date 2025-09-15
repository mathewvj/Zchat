import { Divide, ShowerHead } from "lucide-react";
import { useState, useEffect } from "react";

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

interface Props{
    msg: Message
    currentUserId: string
    onEdit: (m: Message) => void
    onSelect: (m: Message) => void
}

export default function MessageItem({ msg, currentUserId, onEdit, onSelect } : Props){
    const [  showEdit, setShowEdit ] = useState(false)

    const canEdit = msg.sender._id === currentUserId && Date.now() - new Date(msg.createdAt).getTime() <= 15 * 60 * 1000

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        if(canEdit) setShowEdit(true)
            onSelect(msg)
    }

    let pressTimer: NodeJS.Timeout
    const handleTouchStart = () =>{
        pressTimer = setTimeout(() => {
            if(canEdit) setShowEdit(true)
                onSelect(msg)
        }, 700);
    }

    const handleTouchEnd = () => clearTimeout(pressTimer)

    return (
        <div onContextMenu={handleContextMenu}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className={`flex ${
                msg.sender._id === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
                <div className={`relative max-w-xs p-3 rounded-lg ${
                    msg.sender._id === currentUserId
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                     : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
                >
                    {msg.type === "voice" && msg.voiceUrl ? (
                        <audio controls src={msg.voiceUrl} className="w-40"/>
                    ):(
                        <p className="text-sm"> {msg.text}</p>
                    )}

                    <p className="text-xs text-gray-300 dark:text-gray-500 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour:"2-digit", minute: '2-digit' })}
                    </p>

                    {showEdit && canEdit && (
                        <button onClick={() => onEdit(msg)}
                                className="absolute top-1 right-1 text-xs bg-black/30 rounded px-1 hover:bg-black/50"
                        >
                            Edit
                        </button>
                    )}

                </div>

        </div>
    )
} 