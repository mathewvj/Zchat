'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UserSearch() {
    const [ query, setQuery ] = useState('')
    const [ results, setResults ] = useState<any[]>([])
    const [ error, setError ] = useState('')
    const router = useRouter()

    const handleSearch = async() => {
        try {
            const token = localStorage.getItem('token')

            const res = await fetch(`http://localhost:5000/api/users/search?=${query}`, { 
                method: 'GET',
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            const users = await res.json()

            if(!Array.isArray(users)){
                throw new Error('unexpected response format')
            }
            setResults(users)
        } catch (error: any) {
            setError(error.message || 'something went wrong')
            setResults([])
        }
    }

    const handleStartChat = async( otherUserId: string) => {
       try {
        const token = localStorage.getItem("token")
            const res = await fetch('http://localhost:5000/api/chat/start',{
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type' : 'application/json' , Authorization: `Bearer ${token}`},
                body: JSON.stringify({ otherUserId })
            })
            const convo = await res.json()
            router.push(`/chat/${convo._id}`)
            console.log('conversation started', convo)
       } catch (error) {
        console.error('Error starting chat:', error)
       }
    }

    return (
        <div style={{ padding: '1rem'}}>
            <input type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            <ul>
                { results.map((user: any) =>(
                    <li key={user._id} >
                        {user.username} - { user.name}
                        <button onClick={() => handleStartChat(user._id)}>Message</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}