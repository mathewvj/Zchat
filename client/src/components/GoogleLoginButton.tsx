"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

declare global {
    interface Window {
        google?: any
    }
}


export default function GoogleLoginButton(){
    const router = useRouter()
    useEffect(()=>{
        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        document.body.appendChild(script)

        script.onload = () =>{
            if(window.google){
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse,
                })
                window.google.accounts.id.renderButton(
                    document.getElementById("googleButton"),
                    { theme: "outline", size: "large" }
                )
            }
        }
    },[])

    const handleCredentialResponse = async ( response: any ) => {
        try {
            const idToken = response.credential
            const res = await fetch("http://localhost:5000/api/auth/google",{
                method: "POST",
                headers: { "Content-Type":"application/json" },
                body: JSON.stringify({ idToken })
            })

            const data = await res.json()
            console.log("Backend response:" ,data)
            if(res.ok){
                localStorage.setItem("userId",data.user._id)
                localStorage.setItem("token",data.token)
                router.push("/chat")
            }else{
                
                alert(data.message || "Login failed")
            }
        } catch (error) {
            console.error("Google signin error", error)
        }
    }
    return <div id="googleButton"></div>
}
