"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import GoogleLoginButton from "@/components/GoogleLoginButton"
import { MessageCircle, Zap, Shield, Sparkles, Users, Globe } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Zchat</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button onClick={() => router.push("/signup")} className="rounded-lg">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-600 opacity-20 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-900/10 backdrop-blur-sm dark:bg-slate-800/80 dark:text-slate-300 dark:ring-slate-700">
            <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
            Real-time messaging powered by Socket.io
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            Chat without limits.
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Connect instantly.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Experience lightning-fast conversations with friends, family, and teams. 
            Secure, beautiful, and built for the modern world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              onClick={() => router.push("/signup")} 
              size="lg" 
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-base font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105 sm:w-auto"
            >
              Start Chatting Free
            </Button>
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              size="lg"
              className="w-full rounded-xl border-2 px-8 py-3 text-base font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800 sm:w-auto"
            >
              Sign In
            </Button>
          </div>

          {/* Google Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-50 px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  or continue with
                </span>
              </div>
            </div>
            <div className="mt-4 justify-items-center">
              <GoogleLoginButton />
            </div>
          </div>

          {/* Trust indicators */}
          <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
            Trusted by thousands of users worldwide. Free to start, always secure.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Why choose Zchat?
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Everything you need for seamless communication
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Group Conversations"
              description="Create unlimited group chats and manage conversations with ease"
              gradient="from-blue-400 to-cyan-500"
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Lightning Fast"
              description="Messages delivered instantly with real-time synchronization across all devices"
              gradient="from-yellow-400 to-orange-500"
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Modern Interface"
              description="Beautiful, intuitive design built with the latest web technologies"
              gradient="from-indigo-400 to-blue-500"
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Cross Platform"
              description="Access your chats from any device, anywhere in the world"
              gradient="from-purple-400 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 shadow-2xl lg:p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to start chatting?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of users who've made Zchat their go-to messaging platform.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                onClick={() => router.push("/signup")} 
                size="lg" 
                variant="secondary"
                className="rounded-xl bg-white px-8 py-3 text-base font-semibold text-blue-600 transition-all hover:bg-slate-50 hover:scale-105"
              >
                Create Account
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                size="lg"
                className="rounded-xl border-2 border-white px-8 py-3 text-base font-semibold text-white transition-all hover:bg-white/10"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 py-12 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-r from-blue-600 to-purple-600">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Zchat</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Zchat. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-slate-500 dark:text-slate-400">
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">Terms</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-slate-800">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 transition-opacity group-hover:opacity-5`} />
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${gradient} text-white`}>
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  )
}