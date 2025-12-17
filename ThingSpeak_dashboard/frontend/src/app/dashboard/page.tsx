'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getUser, logout } from '@/lib/auth'
import { thingspeakAPI, predictionAPI } from '@/lib/api'
import type { ThingSpeakData, PredictionResult, PredictionHistory, User } from '@/types'
import SensorCards from '@/components/SensorCards'
import PredictionPanel from '@/components/PredictionPanel'
import HistoryTable from '@/components/HistoryTable'
import { LogOut, RefreshCw } from 'lucide-react'

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [sensorData, setSensorData] = useState<ThingSpeakData | null>(null)
    const [prediction, setPrediction] = useState<PredictionResult | null>(null)
    const [history, setHistory] = useState<PredictionHistory[]>([])
    const [pregnancies, setPregnancies] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Auto-refresh settings
    const [autoRefresh, setAutoRefresh] = useState(false)
    const [refreshInterval, setRefreshInterval] = useState(10)
    const [countdown, setCountdown] = useState(10)
    const [autoPredict, setAutoPredict] = useState(false)

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login')
            return
        }

        const userData = getUser()
        setUser(userData)
        fetchData()
        fetchHistory()
    }, [router])

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (autoRefresh && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => prev - 1)
            }, 1000)
        }

        if (autoRefresh && countdown === 0) {
            fetchData()
            setCountdown(refreshInterval)
        }

        return () => clearInterval(interval)
    }, [autoRefresh, countdown, refreshInterval])

    useEffect(() => {
        if (autoPredict && sensorData && user) {
            handlePredict()
        }
    }, [sensorData, autoPredict, user])

    const fetchData = async () => {
        try {
            const data = await thingspeakAPI.getLatestData()
            setSensorData(data)
        } catch (err: any) {
            console.error('Failed to fetch sensor data:', err)
        }
    }

    const fetchHistory = async () => {
        try {
            const data = await predictionAPI.getHistory()
            setHistory(data)
        } catch (err: any) {
            console.error('Failed to fetch history:', err)
        }
    }

    const handlePredict = async () => {
        if (!sensorData || !user) return

        setLoading(true)
        setError('')

        try {
            const result = await predictionAPI.predict(pregnancies)
            setPrediction(result)
            await fetchHistory()

            // Trigger animations based on risk level
            if (typeof window !== 'undefined') {
                if (result.risk_level === 'Low Risk') {
                    // Show balloons animation
                    const style = document.createElement('style')
                    style.innerHTML = `
            @keyframes balloon-float {
              0% { transform: translateY(100vh) scale(1); opacity: 1; }
              100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
            }
          `
                    document.head.appendChild(style)

                    for (let i = 0; i < 20; i++) {
                        const balloon = document.createElement('div')
                        balloon.textContent = '🎈'
                        balloon.style.position = 'fixed'
                        balloon.style.left = `${Math.random() * 100}vw`
                        balloon.style.bottom = '-50px'
                        balloon.style.fontSize = '2rem'
                        balloon.style.animation = `balloon-float ${3 + Math.random() * 2}s ease-out forwards`
                        balloon.style.animationDelay = `${Math.random() * 0.5}s`
                        balloon.style.zIndex = '9999'
                        document.body.appendChild(balloon)

                        setTimeout(() => balloon.remove(), 5000)
                    }
                } else {
                    // Show danger animation (red particles)
                    const style = document.createElement('style')
                    style.innerHTML = `
            @keyframes danger-fall {
              0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
          `
                    document.head.appendChild(style)

                    for (let i = 0; i < 30; i++) {
                        const particle = document.createElement('div')
                        particle.style.position = 'fixed'
                        particle.style.left = `${Math.random() * 100}vw`
                        particle.style.top = '-20px'
                        particle.style.width = '10px'
                        particle.style.height = '10px'
                        particle.style.background = 'red'
                        particle.style.borderRadius = '50%'
                        particle.style.animation = `danger-fall ${2 + Math.random() * 2}s linear forwards`
                        particle.style.animationDelay = `${Math.random() * 0.3}s`
                        particle.style.zIndex = '9999'
                        document.body.appendChild(particle)

                        setTimeout(() => particle.remove(), 4000)
                    }
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Prediction failed')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
    }

    const handleRefreshIntervalChange = (interval: number) => {
        setRefreshInterval(interval)
        setCountdown(interval)
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-2xl">Loading...</div>
            </div>
        )
    }

    const bmi = user.weight / Math.pow(user.height, 2)

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="glass-card p-6 mb-8 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-xl">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white" dir="rtl">
                                    لوحة التحكم
                                </h1>
                                <p className="text-white/60 text-sm">Diabetes Prediction Dashboard</p>
                            </div>
                        </div>
                        <p className="text-white/80" dir="rtl">
                            مرحباً، {user.username} | مؤشر كتلة الجسم: {bmi.toFixed(1)} | العمر: {user.age}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-lg"
                    >
                        <LogOut size={20} />
                        <span dir="rtl">تسجيل الخروج</span>
                    </button>
                </div>

                {/* Auto-refresh Controls */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3">
                            <label className="text-white font-medium" dir="rtl">التحديث التلقائي:</label>
                            <button
                                onClick={() => {
                                    setAutoRefresh(!autoRefresh)
                                    if (!autoRefresh) setCountdown(refreshInterval)
                                }}
                                className={`px-4 py-2 rounded-xl font-medium transition-all backdrop-blur-md border ${autoRefresh
                                    ? 'bg-green-500/30 border-green-400/50 text-white shadow-lg shadow-green-500/20'
                                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                    }`}
                            >
                                <span dir="rtl">{autoRefresh ? 'مفعّل' : 'معطّل'}</span>
                            </button>
                        </div>

                        {autoRefresh && (
                            <>
                                <div className="flex items-center gap-3">
                                    <label className="text-white font-medium" dir="rtl">المدة الزمنية:</label>
                                    {[5, 10, 15, 30].map(interval => (
                                        <button
                                            key={interval}
                                            onClick={() => handleRefreshIntervalChange(interval)}
                                            className={`px-4 py-2 rounded-xl font-medium transition-all backdrop-blur-md border ${refreshInterval === interval
                                                ? 'bg-cyan-500/30 border-cyan-400/50 text-white shadow-lg shadow-cyan-500/20'
                                                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                                }`}
                                        >
                                            {interval}<span dir="rtl">ث</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="text-white font-medium" dir="rtl">
                                    التحديث القادم خلال: {countdown} ثانية
                                </div>
                            </>
                        )}

                        <div className="flex items-center gap-3">
                            <label className="text-white font-medium" dir="rtl">التنبؤ التلقائي:</label>
                            <button
                                onClick={() => setAutoPredict(!autoPredict)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all backdrop-blur-md border ${autoPredict
                                    ? 'bg-green-500/30 border-green-400/50 text-white shadow-lg shadow-green-500/20'
                                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                    }`}
                            >
                                <span dir="rtl">{autoPredict ? 'مفعّل' : 'معطّل'}</span>
                            </button>
                        </div>

                        <button
                            onClick={fetchData}
                            className="flex items-center gap-2 bg-cyan-500/30 backdrop-blur-md border border-cyan-400/50 text-white px-6 py-3 rounded-xl font-medium hover:shadow-xl shadow-cyan-500/20 transition-all hover:scale-105"
                        >
                            <RefreshCw size={20} />
                            <span dir="rtl">تحديث الآن</span>
                        </button>
                    </div>
                </div>

                {/* Sensor Data */}
                {sensorData && <SensorCards data={sensorData} />}

                {/* Prediction Panel */}
                <PredictionPanel
                    pregnancies={pregnancies}
                    setPregnancies={setPregnancies}
                    onPredict={handlePredict}
                    loading={loading}
                    prediction={prediction}
                    error={error}
                />

                {/* History Table */}
                {history.length > 0 && <HistoryTable history={history} />}
            </div>
        </div>
    )
}
