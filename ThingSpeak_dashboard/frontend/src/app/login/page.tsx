'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import { setToken, setUser } from '@/lib/auth'

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await authAPI.login({ username, password })
            setToken(response.access_token)
            setUser(response.user)
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <span className="text-3xl">🏥</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        تسجيل الدخول
                    </h1>
                    <p className="text-white/70 text-sm">Login to Your Account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-white text-sm font-medium mb-2" dir="rtl">
                            اسم المستخدم • Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                            placeholder="أدخل اسم المستخدم"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-white text-sm font-medium mb-2" dir="rtl">
                            كلمة المرور • Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                            placeholder="أدخل كلمة المرور"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl text-sm" dir="rtl">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500/30 backdrop-blur-md border border-cyan-400/50 text-white font-semibold py-3 rounded-xl hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span dir="rtl">{loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}</span>
                    </button>
                </form>

                <p className="text-white text-center mt-6" dir="rtl">
                    ليس لديك حساب؟{' '}
                    <Link href="/signup" className="text-cyan-400 font-semibold hover:underline">
                        إنشاء حساب جديد
                    </Link>
                </p>
            </div>
        </div>
    )
}
