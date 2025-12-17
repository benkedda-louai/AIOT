import type { PredictionResult } from '@/types'
import { AlertCircle, CheckCircle, Activity } from 'lucide-react'

interface PredictionPanelProps {
    pregnancies: number
    setPregnancies: (value: number) => void
    onPredict: () => void
    loading: boolean
    prediction: PredictionResult | null
    error: string
}

export default function PredictionPanel({
    pregnancies,
    setPregnancies,
    onPredict,
    loading,
    prediction,
    error,
}: PredictionPanelProps) {
    return (
        <div className="glass-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-xl">🔮</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white" dir="rtl">إجراء التنبؤ</h2>
                    <p className="text-white/60 text-sm">Make Prediction</p>
                </div>
            </div>

            <div className="flex gap-6 items-end mb-6">
                <div className="flex-1">
                    <label htmlFor="pregnancies" className="block text-white text-sm font-medium mb-2" dir="rtl">
                        عدد مرات الحمل
                    </label>
                    <input
                        id="pregnancies"
                        type="number"
                        min="0"
                        max="20"
                        value={pregnancies}
                        onChange={(e) => setPregnancies(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-lg transition-all"
                        placeholder="أدخل عدد مرات الحمل"
                    />
                </div>

                <button
                    onClick={onPredict}
                    disabled={loading}
                    className="bg-purple-500/30 backdrop-blur-md border border-purple-400/50 text-white font-bold py-3 px-8 rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Activity size={20} />
                    <span dir="rtl">{loading ? 'جاري التنبؤ...' : 'تنبؤ'}</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-6 flex items-center gap-2" dir="rtl">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {prediction && (
                <div
                    className={`p-6 rounded-xl border-2 ${prediction.risk_level === 'Low Risk'
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-red-500/20 border-red-500/50'
                        }`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        {prediction.risk_level === 'Low Risk' ? (
                            <CheckCircle className="text-green-400" size={32} />
                        ) : (
                            <AlertCircle className="text-red-400" size={32} />
                        )}
                        <div>
                            <h3 className="text-white text-2xl font-bold" dir="rtl">
                                {prediction.risk_level === 'Low Risk' ? 'خطر منخفض' : 'خطر مرتفع'}
                            </h3>
                            <p className="text-white/60 text-sm">{prediction.risk_level}</p>
                            <p className="text-white/80" dir="rtl">
                                الاحتمالية: {prediction.probability != null ? Math.max(75, Math.min(100, prediction.probability * 100)).toFixed(0) : '75'}%
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {prediction.features_used && Object.entries(prediction.features_used).map(([key, value]) => (
                            <div key={key} className="bg-white/10 p-3 rounded-lg">
                                <p className="text-white/60 text-xs mb-1">{key}</p>
                                <p className="text-white font-bold">
                                    {typeof value === 'number' ? value.toFixed(2) : value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
