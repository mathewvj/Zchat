"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ identifier: "", password: "" })
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError(null) // Clear error on input change
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include"
            })

            const data = await res.json()
            if (res.ok) {
                localStorage.setItem("userId", data.user._id)
                localStorage.setItem("token", data.token)
                router.push("/chat")
            } else {
                setError(data.message || "Login failed. Please check your credentials.")
            }
        } catch (error) {
            console.error("Login error", error)
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <nav className="relative z-10 flex items-center justify-between px-4 py-4 lg:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
            <button
                    onClick={() => router.push("/")}
                    className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                    aria-label="Go to Zchat landing page"
                >
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse-slow">
                            <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Zchat</span>
                    </div>
                </button>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="link"
                        onClick={() => router.push("/signup")}
                        className="text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-primary/60 transition-colors"
                    >
                        No account? Sign up
                    </Button>
                </div>
            </nav>
            <div className="flex flex-1 items-center justify-center px-4">
                <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
                    <CardHeader className="space-y-2 pb-6">
                        <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white">Welcome Back</CardTitle>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">Sign in to start chatting</p>
                    </CardHeader>
                    <CardContent className="pb-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    name="identifier"
                                    placeholder="Username or Email"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 text-base rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                                    aria-label="Username or Email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 text-base rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                                    aria-label="Password"
                                />
                            </div>
                            {error && (
                                <p className="text-sm text-red-500 dark:text-red-400 text-center animate-fade-in">{error}</p>
                            )}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Signing In...
                                    </span>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}