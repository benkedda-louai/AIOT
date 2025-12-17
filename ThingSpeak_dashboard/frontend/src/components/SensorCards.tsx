import type { ThingSpeakData } from '@/types'
import { Activity, Droplet, Ruler, Syringe, TrendingUp } from 'lucide-react'

interface SensorCardsProps {
    data: ThingSpeakData
}

export default function SensorCards({ data }: SensorCardsProps) {
    const cards = [
        {
            icon: Droplet,
            label: 'الجلوكوز',
            labelEn: 'Glucose',
            value: data.Glucose ?? 0,
            unit: 'mg/dL',
            color: 'from-cyan-400 to-blue-500',
        },
        {
            icon: Activity,
            label: 'ضغط الدم',
            labelEn: 'Blood Pressure',
            value: data.BloodPressure ?? 0,
            unit: 'mm Hg',
            color: 'from-red-400 to-pink-500',
        },
        {
            icon: Ruler,
            label: 'سمك الجلد',
            labelEn: 'Skin Thickness',
            value: data.SkinThickness ?? 0,
            unit: 'mm',
            color: 'from-yellow-400 to-orange-500',
        },
        {
            icon: Syringe,
            label: 'الأنسولين',
            labelEn: 'Insulin',
            value: data.Insulin ?? 0,
            unit: 'μU/mL',
            color: 'from-green-400 to-emerald-500',
        },
        {
            icon: TrendingUp,
            label: 'وظيفة النسب الوراثي',
            labelEn: 'DPF',
            value: data.DiabetesPedigreeFunction ? data.DiabetesPedigreeFunction.toFixed(3) : '0.000',
            unit: '',
            color: 'from-purple-400 to-indigo-500',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            {cards.map((card, index) => {
                const Icon = card.icon
                return (
                    <div key={index} className="glass-card p-6 hover:scale-105 transition-all hover:shadow-2xl">
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.color} mb-4 shadow-lg`}>
                            <Icon className="text-white" size={24} />
                        </div>
                        <h3 className="text-white text-base font-semibold mb-1" dir="rtl">{card.label}</h3>
                        <p className="text-white/60 text-xs mb-2">{card.labelEn}</p>
                        <p className="text-white text-2xl font-bold">
                            {card.value} <span className="text-lg text-white/60">{card.unit}</span>
                        </p>
                    </div>
                )
            })}
        </div>
    )
}
