'use client'

import { useRouter } from "next/navigation"
import styles from "./page.module.css"
import GoogleLoginButton from "@/components/GoogleLoginButton"

export default function LandingPage(){
  const router = useRouter()

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Welcome to Zchat </h1>
      <div className={styles.buttonGroup}>
          <button onClick={()=> router.push("/login")} className={styles.button}>
              Login
          </button>
          <button onClick={()=> router.push("/signup")} className={styles.button}>
            Signup
          </button>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <GoogleLoginButton/>
      </div>
    </main>
  )
}