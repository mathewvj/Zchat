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
    updatedAt: string
}

interface Props{
    msg: Message
    currentUserId: string
    onEdit: (m: Message) => void
    onDelete: (m: Message) => void
    onReply: (m: Message) => void
}

export default function MessageItem({ msg, currentUserId, onEdit, onDelete, onReply } : Props){
    const [ showMenu, setShowMenu ] = useState(false)
    const [ showEdit, setShowEdit ] = useState(false)

    const canEdit = msg.sender._id === currentUserId && Date.now() - new Date(msg.createdAt).getTime() <= 15 * 60 * 1000 && msg.type === 'text'

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        if(canEdit) setShowEdit(true)
            setShowMenu(true)

    }

    let pressTimer: NodeJS.Timeout
    const handleTouchStart = () =>{
        pressTimer = setTimeout(() => {
            if(canEdit) setShowEdit(true)
                setShowMenu(true)
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
                 <div
                    className={`relative max-w-xs p-3 rounded-lg
                    ${
                        msg.sender._id === currentUserId
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }
                    `}
                >
                    {msg.type === "voice" && msg.voiceUrl ? (
                    <audio controls src={msg.voiceUrl} className="w-40" />
                    ) : (
                    <p className="text-sm">{msg.text}</p>
                    )}

                    <p className="text-xs text-dark-300 dark:text-gray-500 mt-1">
                    {new Date(msg.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                    {new Date(msg.updatedAt).getTime() !==
                        new Date(msg.createdAt).getTime() && (
                        <span className="ml-1 italic text-gray-400">(edited)</span>
                    )}
                    </p>

                   {showMenu && (
  <div
    className="
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/30   /* optional dark overlay */
    "
    onClick={() => setShowMenu(false)}   // click outside closes
  >
    <div
      className="
        w-56     
        rounded-xl bg-white dark:bg-gray-800
        border dark:border-gray-700 shadow-2xl
        text-base 
        p-2
      "
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking menu
    >
      {msg.sender._id === currentUserId && (
        <>
          {showEdit && canEdit && (
            <button
                onClick={() => {onEdit(msg); setShowMenu(false)}}
                className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                Edit
            </button>
            )}
          <button
            className="block w-full px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => { onDelete(msg); setShowMenu(false); }}
          >
            Delete
          </button>
        </>
      )}
      <button
        className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => { onReply(msg); setShowMenu(false); }}
      >
        Reply
      </button>
    </div>
  </div>
)}



                </div>
                </div>
    )
} 

