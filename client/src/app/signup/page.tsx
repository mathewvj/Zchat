"use client"

import React, { useState } from "react"
import { useRouter } from 'next/navigation'
import styles from "../AuthForm.module.css"

export default function SignupPage(){
    const router = useRouter()
    const [ formData, setFormData ] = useState({
        name: "",
        username: "",
        email:"",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData({ ...formData, [e.target.name ] : e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()

        try {
            const res = await fetch("http://localhost:5000/api/auth/signup",{
                method:"POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify(formData),
                credentials:'include'
            })

            if(res.ok){
                router.push("/login")
            }else{
                const data = await res.json()
                alert(data.message || 'Signup failed')
            }
        } catch (error) {
            console.error("Signup Error:",error)
        }
    }

    return (
        <div className={styles.authContainer}>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit} className={styles.formm}>
                <input type="text" 
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                />
                 <input type="text" 
                        name="username"
                        placeholder="UserName"
                        value={formData.username}
                        onChange={handleChange}
                        required
                />
                 <input type="email" 
                        name="email"
                        placeholder="Email"
                        value={formData.email}
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
                <button type="submit" className={styles.buttonn}>Signup</button>
            </form>
        </div>
    )
}