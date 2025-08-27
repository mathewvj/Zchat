"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"

interface User {
    _id: string
    name: string
    username: string
}

export default function UserSearch() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<User[]>([])
    const [error, setError] = useState("")
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const router = useRouter()

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen)
        if (isSearchOpen) {
            setQuery("")
            setResults([])
            setError("")
        }
    }

    const handleSearch = async () => {
        if (!query.trim()) {
            setResults([])
            return
        }
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const users = await res.json()

            if (!Array.isArray(users)) {
                throw new Error("Unexpected response format")
            }
            setResults(users)
            setError("")
        } catch (error: any) {
            setError(error.message || "Something went wrong")
            setResults([])
        }
    }

    const handleStartChat = async (otherUserId: string) => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch("http://localhost:5000/api/chat/start", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ otherUserId }),
            })
            const convo = await res.json()
            router.push(`/chat/${convo._id}`)
            setIsSearchOpen(false)
            setQuery("")
            setResults([])
        } catch (error) {
            console.error("Error starting chat:", error)
        }
    }

    return (
        <div className="relative">
            <div className="flex items-center space-x-2">
                {isSearchOpen ? (
                    <div className="flex items-center w-full animate-fade-in">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Search users..."
                            className="h-10 w-40 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                            aria-label="Search users"
                            autoFocus
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSearchToggle}
                            className="ml-2"
                            aria-label="Close search"
                        >
                            <X className="h-5 w-5 text-gray-900 dark:text-white" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSearchToggle}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Open search"
                    >
                        <Search className="h-5 w-5 text-gray-900 dark:text-white" />
                    </Button>
                )}
            </div>
            {isSearchOpen && results.length > 0 && (
                <Card className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-10 max-h-60 overflow-y-auto">
                    <CardContent className="p-2">
                        {results.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user.name || user.username}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        @{user.username}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStartChat(user._id)}
                                    className="text-primary hover:text-primary/80"
                                    aria-label={`Start chat with ${user.name || user.username}`}
                                >
                                    Message
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
            {isSearchOpen && error && (
                <Card className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-10">
                    <CardContent className="p-2">
                        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}