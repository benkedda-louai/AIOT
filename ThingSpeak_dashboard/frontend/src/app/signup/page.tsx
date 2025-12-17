'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import { setToken, setUser } from '@/lib/auth'

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        height: '',
        weight: '',
        age: '',
        pregnancies: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        const height = parseFloat(formData.height)
        const weight = parseFloat(formData.weight)
        const age = parseInt(formData.age)
        const pregnancies = parseInt(formData.pregnancies)

        if (isNaN(height) || height <= 0) {
            setError('Please enter a valid height')
            return
        }

        if (isNaN(weight) || weight <= 0) {
            setError('Please enter a valid weight')
            return
        }

        if (isNaN(age) || age <= 0 || age > 150) {
            setError('Please enter a valid age')
            return
        }

        if (isNaN(pregnancies) || pregnancies < 0) {
            setError('Please enter a valid number of pregnancies')
            return
        }

        setLoading(true)

        try {
            const response = await authAPI.signup({
                username: formData.username,
                password: formData.password,
                pregnancies,
                weight_kg: weight,
                height_m: height,
                age,
            })
            setToken(response.access_token)
            setUser(response.user)
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Signup failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <span className="text-3xl">👤</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        إنشاء حساب جديد
                    </h1>
                    <p className="text-white/70 text-sm">Create New Account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-white text-sm font-medium mb-2" dir="rtl">
                            اسم المستخدم • Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
                            placeholder="اختر اسم المستخدم"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-white text-sm font-medium mb-2" dir="rtl">
                            كلمة المرور • Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
                            placeholder="أدخل كلمة المرور"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2" dir="rtl">
                            تأكيد كلمة المرور • Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
                            placeholder="أعد إدخال كلمة المرور"
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="pregnancies" className="block text-white text-sm font-medium mb-2" dir="rtl">
                                عدد الحمل
                            </label>
                            <input
                                id="pregnancies"
                                name="pregnancies"
                                type="number"
                                min="0"
                                max="20"
                                value={formData.pregnancies}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label htmlFor="height" className="block text-white text-sm font-medium mb-2" dir="rtl">
                                الطول (م)
                            </label>
                            <input
                                id="height"
                                name="height"
                                type="number"
                                step="0.01"
                                value={formData.height}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
                                placeholder="1.75"
                            />
                        </div>

                        <div>
                            <label htmlFor="weight" className="block text-white text-sm font-medium mb-2" dir="rtl">
                                الوزن (كج)
                            </label>
                            <input
                                id="weight"
                                name="weight"
                                type="number"
                                step="0.1"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
                                placeholder="70"
                            />
                        </div>

                        <div>
                            <label htmlFor="age" className="block text-white text-sm font-medium mb-2" dir="rtl">
                                العمر
                            </label>
                            <input
                                id="age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
                                placeholder="30"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl text-sm" dir="rtl">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-500/30 backdrop-blur-md border border-pink-400/50 text-white font-semibold py-3 rounded-xl hover:shadow-xl hover:shadow-pink-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span dir="rtl">{loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}</span>
                    </button>
                </form>

                <p className="text-white text-center mt-6" dir="rtl">
                    لديك حساب بالفعل؟{' '}
                    <Link href="/login" className="text-pink-400 font-semibold hover:underline">
                        تسجيل الدخول
                    </Link>
                </p>
            </div>
        </div>
    )
}
