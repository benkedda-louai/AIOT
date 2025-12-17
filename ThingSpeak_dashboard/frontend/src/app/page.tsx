'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth'
import { Activity, Heart, TrendingUp, Shield, Zap, BarChart3, Clock, Lock } from 'lucide-react'

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/dashboard')
        }
    }, [router])

    const features = [
        {
            icon: Activity,
            titleAr: 'مراقبة في الوقت الفعلي',
            titleEn: 'Real-time Monitoring',
            descAr: 'متابعة مستمرة لمستويات الجلوكوز وضغط الدم والأنسولين من خلال أجهزة IoT',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Heart,
            titleAr: 'تنبؤ ذكي بالمرض',
            titleEn: 'Smart Prediction',
            descAr: 'خوارزميات تعلم آلي متقدمة للتنبؤ بخطر الإصابة بالسكري بدقة عالية',
            color: 'from-pink-500 to-rose-500',
        },
        {
            icon: TrendingUp,
            titleAr: 'تحليل البيانات',
            titleEn: 'Data Analysis',
            descAr: 'تحليل شامل لجميع القراءات الصحية مع إحصائيات مفصلة وتقارير دقيقة',
            color: 'from-purple-500 to-indigo-500',
        },
        {
            icon: Shield,
            titleAr: 'أمان متقدم',
            titleEn: 'Advanced Security',
            descAr: 'حماية كاملة لبياناتك الصحية مع تشفير JWT وأمان متعدد الطبقات',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: Zap,
            titleAr: 'تحديث تلقائي',
            titleEn: 'Auto Refresh',
            descAr: 'تحديث تلقائي للبيانات كل 5-30 ثانية للحصول على أحدث القراءات',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: BarChart3,
            titleAr: 'سجل كامل',
            titleEn: 'Complete History',
            descAr: 'سجل شامل لجميع التنبؤات والقراءات مع إمكانية التصدير والمقارنة',
            color: 'from-red-500 to-pink-500',
        },
    ]

    const stats = [
        {
            icon: Clock,
            valueAr: '24/7',
            labelAr: 'مراقبة مستمرة',
            color: 'text-blue-400',
        },
        {
            icon: Shield,
            valueAr: '79.22%',
            labelAr: 'دقة النموذج',
            color: 'text-green-400',
        },
        {
            icon: Activity,
            valueAr: '5',
            labelAr: 'مؤشرات حيوية',
            color: 'text-purple-400',
        },
        {
            icon: Lock,
            valueAr: '7 أيام',
            labelAr: 'صلاحية الجلسة',
            color: 'text-pink-400',
        },
    ]

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Hero Section */}
                <div className="container mx-auto px-6 py-16">
                    {/* Header */}
                    <nav className="flex justify-between items-center mb-20">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                                <Heart className="text-white" size={28} />
                            </div>
                            <div className="text-white">
                                <h1 className="text-2xl font-bold">نظام التنبؤ بالسكري</h1>
                                <p className="text-sm text-white/80">Diabetes Prediction System</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                href="/login"
                                className="px-6 py-3 bg-white/20 backdrop-blur-lg text-white rounded-xl hover:bg-white/30 transition-all font-semibold border border-white/30"
                            >
                                تسجيل الدخول
                            </Link>
                            <Link
                                href="/signup"
                                className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-white/90 transition-all font-bold shadow-xl"
                            >
                                إنشاء حساب
                            </Link>
                        </div>
                    </nav>

                    {/* Hero Content */}
                    <div className="text-center mb-20">
                        <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
                            صحتكِ أمانة… راقبيها اليوم لأجل غدٍ أفضل
                            <br />
                            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                                بذكاء اصطناعي متقدم
                            </span>
                        </h2>
                        <p className="text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed" dir="rtl">
                            نظام متكامل لمراقبة المؤشرات الحيوية والتنبؤ بخطر الإصابة بالسكري باستخدام أحدث تقنيات التعلم الآلي وإنترنت الأشياء
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/signup"
                                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-400 text-gray-900 rounded-2xl hover:scale-105 transition-transform font-bold text-lg shadow-2xl"
                            >
                                ابدأ الآن مجاناً
                            </Link>
                            <button className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white rounded-2xl hover:bg-white/30 transition-all font-semibold border border-white/30">
                                تعرف على المزيد
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <div
                                    key={index}
                                    className="glass-card p-6 text-center hover:scale-105 transition-transform"
                                >
                                    <Icon className={`${stat.color} mx-auto mb-3`} size={40} />
                                    <div className="text-4xl font-bold text-white mb-2">{stat.valueAr}</div>
                                    <div className="text-white/80 font-medium">{stat.labelAr}</div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Features Grid */}
                    <div className="mb-20">
                        <h3 className="text-4xl font-bold text-white text-center mb-4">المميزات الرئيسية</h3>
                        <p className="text-white/80 text-center mb-12 text-lg">
                            نوفر لك أدوات متقدمة لمراقبة صحتك والحفاظ عليها
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon
                                return (
                                    <div
                                        key={index}
                                        className="glass-card p-8 hover:scale-105 transition-all group cursor-pointer"
                                    >
                                        <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                            <Icon className="text-white" size={32} />
                                        </div>
                                        <h4 className="text-2xl font-bold text-white mb-3" dir="rtl">
                                            {feature.titleAr}
                                        </h4>
                                        <p className="text-sm text-white/60 mb-2">{feature.titleEn}</p>
                                        <p className="text-white/90 leading-relaxed" dir="rtl">
                                            {feature.descAr}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="mb-20">
                        <h3 className="text-4xl font-bold text-white text-center mb-12">كيف يعمل النظام؟</h3>
                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                {
                                    step: '1',
                                    titleAr: 'إنشاء حساب',
                                    descAr: 'سجل بياناتك الأساسية مثل الطول والوزن والعمر',
                                    icon: Lock,
                                    color: 'from-blue-500 to-cyan-500',
                                },
                                {
                                    step: '2',
                                    titleAr: 'ربط الأجهزة',
                                    descAr: 'النظام يتصل تلقائياً بأجهزة ThingSpeak لقراءة البيانات',
                                    icon: Activity,
                                    color: 'from-green-500 to-emerald-500',
                                },
                                {
                                    step: '3',
                                    titleAr: 'تحليل البيانات',
                                    descAr: 'خوارزميات ذكية تحلل قراءاتك الصحية بدقة عالية',
                                    icon: BarChart3,
                                    color: 'from-purple-500 to-pink-500',
                                },
                                {
                                    step: '4',
                                    titleAr: 'الحصول على النتائج',
                                    descAr: 'استلم تنبؤات دقيقة مع توصيات صحية مخصصة',
                                    icon: Heart,
                                    color: 'from-pink-500 to-rose-500',
                                },
                            ].map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <div key={index} className="text-center">
                                        <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl`}>
                                            <span className="text-white text-2xl font-bold">{item.step}</span>
                                        </div>
                                        <Icon className="text-white/80 mx-auto mb-3" size={32} />
                                        <h4 className="text-xl font-bold text-white mb-2" dir="rtl">
                                            {item.titleAr}
                                        </h4>
                                        <p className="text-white/80" dir="rtl">
                                            {item.descAr}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="glass-card p-12 text-center">
                        <h3 className="text-4xl font-bold text-white mb-4" dir="rtl">
                            جاهز للبدء؟
                        </h3>
                        <p className="text-xl text-white/80 mb-8" dir="rtl">
                            انضم إلينا الآن واحصل على تنبؤات دقيقة لصحتك
                        </p>
                        <Link
                            href="/signup"
                            className="inline-block px-12 py-4 bg-gradient-to-r from-yellow-400 to-pink-400 text-gray-900 rounded-2xl hover:scale-105 transition-transform font-bold text-xl shadow-2xl"
                        >
                            إنشاء حساب مجاني
                        </Link>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 text-center text-white/60">
                        <p className="mb-2" dir="rtl">
                            © 2025 نظام التنبؤ بالسكري - جميع الحقوق محفوظة
                        </p>
                        <p className="text-sm">
                            Powered by Next.js • FastAPI • Firebase • ThingSpeak
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}
