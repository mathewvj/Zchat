"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../AuthForm.module.css'

export default function LoginPage(){
    const router = useRouter()
    const [ formData, setFormData ] = useState({ identifier: "", password:"" })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData({ ...formData, [ e.target.name] : e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch("http://localhost:5000/api/auth/login",{
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify(formData),
                credentials: "include" // for using cookie, not neccessary here
            })

            const data = await res.json()
            if(res.ok){
                localStorage.setItem("token",data.token)
                router.push("/chat")
            }else{
                
                alert(data.message || "Login failed")
            }
        } catch (error) {
            console.error("Login error",error)
        }
    }

    return (
        <div className={styles.authContainer}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className={styles.formm}>
                <input type="text"
                    name="identifier"
                    placeholder="Username or Email"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                />

                <input type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" className={styles.buttonn}>Login</button>
            </form>
        </div>
    )
}