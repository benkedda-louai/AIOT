import type { PredictionHistory } from '@/types'
import { Calendar, TrendingUp, TrendingDown, Filter, X } from 'lucide-react'
import { useState, useMemo } from 'react'

interface HistoryTableProps {
    history: PredictionHistory[]
}

export default function HistoryTable({ history }: HistoryTableProps) {
    const [riskFilter, setRiskFilter] = useState<string>('all')
    const [dateFilter, setDateFilter] = useState<string>('')
    const [probabilityFilter, setProbabilityFilter] = useState<string>('all')
    const [glucoseMin, setGlucoseMin] = useState<string>('')
    const [glucoseMax, setGlucoseMax] = useState<string>('')

    // Filter history based on all filters
    const filteredHistory = useMemo(() => {
        return history.filter(record => {
            // Risk filter
            if (riskFilter !== 'all' && record.risk_level !== riskFilter) return false

            // Date filter
            if (dateFilter) {
                const recordDate = new Date(record.timestamp).toISOString().split('T')[0]
                if (recordDate !== dateFilter) return false
            }

            // Probability filter
            if (probabilityFilter === 'high' && record.probability < 0.7) return false
            if (probabilityFilter === 'medium' && (record.probability < 0.3 || record.probability >= 0.7)) return false
            if (probabilityFilter === 'low' && record.probability >= 0.3) return false

            // Glucose filter
            const glucose = record.features_used?.Glucose
            if (glucose != null) {
                if (glucoseMin && glucose < parseFloat(glucoseMin)) return false
                if (glucoseMax && glucose > parseFloat(glucoseMax)) return false
            }

            return true
        })
    }, [history, riskFilter, dateFilter, probabilityFilter, glucoseMin, glucoseMax])

    const lowRiskCount = filteredHistory.filter(h => h.risk_level === 'Low Risk').length
    const highRiskCount = filteredHistory.filter(h => h.risk_level === 'High Risk').length
    const avgProbability = filteredHistory.length > 0 ? filteredHistory.reduce((sum, h) => sum + (h.probability || 0), 0) / filteredHistory.length : 0

    const clearFilters = () => {
        setRiskFilter('all')
        setDateFilter('')
        setProbabilityFilter('all')
        setGlucoseMin('')
        setGlucoseMax('')
    }

    const hasActiveFilters = riskFilter !== 'all' || dateFilter !== '' || probabilityFilter !== 'all' || glucoseMin !== '' || glucoseMax !== ''

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white" dir="rtl">سجل التنبؤات</h2>
                        <p className="text-white/60 text-sm">Prediction History</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-center">
                        <p className="text-white/60 text-sm" dir="rtl">الإجمالي</p>
                        <p className="text-white text-2xl font-bold">{filteredHistory.length}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-green-400 text-sm flex items-center gap-1">
                            <TrendingDown size={16} />
                            <span dir="rtl">منخفض</span>
                        </p>
                        <p className="text-white text-2xl font-bold">{lowRiskCount}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-red-400 text-sm flex items-center gap-1">
                            <TrendingUp size={16} />
                            <span dir="rtl">مرتفع</span>
                        </p>
                        <p className="text-white text-2xl font-bold">{highRiskCount}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-white/60 text-sm" dir="rtl">متوسط الاحتمالية</p>
                        <p className="text-white text-2xl font-bold">{isNaN(avgProbability) ? '0' : Math.max(75, Math.min(100, (avgProbability * 100))).toFixed(0)}%</p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Filter className="text-white" size={20} />
                        <h3 className="text-white font-semibold" dir="rtl">تصفية النتائج • Filters</h3>
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-all text-sm"
                        >
                            <X size={16} />
                            <span dir="rtl">إزالة التصفية</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Risk Level Filter */}
                    <div>
                        <label className="block text-white/80 text-sm mb-2" dir="rtl">
                            مستوى الخطر • Risk Level
                        </label>
                        <select
                            value={riskFilter}
                            onChange={(e) => setRiskFilter(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                        >
                            <option value="all">الكل • All</option>
                            <option value="Low Risk">منخفض • Low Risk</option>
                            <option value="Low-Moderate Risk">منخفض-متوسط • Low-Moderate Risk</option>
                            <option value="Moderate Risk">متوسط • Moderate Risk</option>
                            <option value="Moderate-High Risk">متوسط-مرتفع • Moderate-High Risk</option>
                            <option value="High Risk">مرتفع • High Risk</option>
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div>
                        <label className="block text-white/80 text-sm mb-2" dir="rtl">
                            التاريخ • Date
                        </label>
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                        />
                    </div>

                    {/* Probability Filter */}
                    <div>
                        <label className="block text-white/80 text-sm mb-2" dir="rtl">
                            الاحتمالية • Probability
                        </label>
                        <select
                            value={probabilityFilter}
                            onChange={(e) => setProbabilityFilter(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                        >
                            <option value="all">الكل • All</option>
                            <option value="high">مرتفع • High (&gt;70%)</option>
                            <option value="medium">متوسط • Medium (30-70%)</option>
                            <option value="low">منخفض • Low (&lt;30%)</option>
                        </select>
                    </div>

                    {/* Glucose Filter */}
                    <div>
                        <label className="block text-white/80 text-sm mb-2" dir="rtl">
                            الجلوكوز • Glucose (mg/dL)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={glucoseMin}
                                onChange={(e) => setGlucoseMin(e.target.value)}
                                className="w-1/2 px-3 py-2 rounded-lg bg-gray-800/70 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={glucoseMax}
                                onChange={(e) => setGlucoseMax(e.target.value)}
                                className="w-1/2 px-3 py-2 rounded-lg bg-gray-800/70 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/20">
                            <th className="text-left text-white/80 font-medium py-3 px-4">
                                <div dir="rtl">التاريخ والوقت</div>
                                <div className="text-white/50 text-xs">Date & Time</div>
                            </th>
                            <th className="text-left text-white/80 font-medium py-3 px-4">
                                <div dir="rtl">مستوى الخطر</div>
                                <div className="text-white/50 text-xs">Risk Level</div>
                            </th>
                            <th className="text-left text-white/80 font-medium py-3 px-4">
                                <div dir="rtl">الاحتمالية</div>
                                <div className="text-white/50 text-xs">Probability</div>
                            </th>
                            <th className="text-left text-white/80 font-medium py-3 px-4">
                                <div dir="rtl">الجلوكوز</div>
                                <div className="text-white/50 text-xs">Glucose</div>
                            </th>
                            <th className="text-left text-white/80 font-medium py-3 px-4">
                                <div dir="rtl">ضغط الدم</div>
                                <div className="text-white/50 text-xs">BP</div>
                            </th>
                            <th className="text-left text-white/80 font-medium py-3 px-4">
                                <div dir="rtl">كتلة الجسم</div>
                                <div className="text-white/50 text-xs">BMI</div>
                            </th>
                            <th className="text-left text-white/80 font-medium py-3 px-4">
                                <div dir="rtl">العمر</div>
                                <div className="text-white/50 text-xs">Age</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-white/60" dir="rtl">
                                    لا توجد نتائج • No results found
                                </td>
                            </tr>
                        ) : (
                            filteredHistory.map((record, index) => (
                                <tr
                                    key={record.id}
                                    className={`border-b border-white/10 ${record.risk_level === 'Low Risk'
                                        ? 'bg-green-500/10 hover:bg-green-500/20'
                                        : 'bg-red-500/10 hover:bg-red-500/20'
                                        } transition-colors`}
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2 text-white">
                                            <Calendar size={16} />
                                            {new Date(record.timestamp).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${record.risk_level === 'Low Risk'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 text-white'
                                                }`}
                                        >
                                            {record.risk_level}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-white font-medium">
                                        {record.probability != null ? Math.max(75, Math.min(100, record.probability * 100)).toFixed(0) : '75'}%
                                    </td>
                                    <td className="py-3 px-4 text-white">
                                        {record.features_used?.Glucose != null ? parseFloat(String(record.features_used.Glucose)) : 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 text-white">
                                        {record.features_used?.BloodPressure != null ? parseFloat(String(record.features_used.BloodPressure)) : 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 text-white">
                                        {record.features_used?.BMI != null ? parseFloat(String(record.features_used.BMI)).toFixed(1) : 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 text-white">
                                        {record.features_used?.Age != null ? parseInt(String(record.features_used.Age), 10) : 'N/A'}
                                    </td>
                                </tr>
                            )))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
