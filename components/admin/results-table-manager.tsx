"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Upload, Plus, Trash2, Edit2, Save, X, Medal, Clock, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Result {
    id: string
    rank: number
    bibNumber: string
    name: string
    category: 'long' | 'short'
    ageGroup: string
    finishTime: string
    avgSpeed: string
}

// Sample results data
const sampleResults: Result[] = [
    { id: '1', rank: 1, bibNumber: '1001', name: 'Mehmet Yıldız', category: 'long', ageGroup: '30-39', finishTime: '2:45:32', avgSpeed: '35.5 km/s' },
    { id: '2', rank: 2, bibNumber: '1023', name: 'Ahmet Kaya', category: 'long', ageGroup: '25-29', finishTime: '2:48:15', avgSpeed: '34.9 km/s' },
    { id: '3', rank: 3, bibNumber: '1045', name: 'Fatih Demir', category: 'long', ageGroup: '30-39', finishTime: '2:51:08', avgSpeed: '34.3 km/s' },
    { id: '4', rank: 1, bibNumber: '2001', name: 'Ayşe Yılmaz', category: 'short', ageGroup: '25-29', finishTime: '1:35:22', avgSpeed: '34.7 km/s' },
    { id: '5', rank: 2, bibNumber: '2015', name: 'Zeynep Özkan', category: 'short', ageGroup: '20-24', finishTime: '1:38:45', avgSpeed: '33.5 km/s' },
]

export function ResultsTableManager() {
    const [results, setResults] = useState<Result[]>(sampleResults)
    const [filter, setFilter] = useState<'all' | 'long' | 'short'>('all')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Result | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newResult, setNewResult] = useState<Partial<Result>>({
        category: 'long',
        ageGroup: '30-39'
    })

    const filteredResults = results
        .filter(r => filter === 'all' || r.category === filter)
        .sort((a, b) => {
            if (a.category !== b.category) return a.category === 'long' ? -1 : 1
            return a.rank - b.rank
        })

    const handleEdit = (result: Result) => {
        setEditingId(result.id)
        setEditForm({ ...result })
    }

    const handleSaveEdit = () => {
        if (!editForm) return
        setResults(results.map(r => r.id === editForm.id ? editForm : r))
        setEditingId(null)
        setEditForm(null)
    }

    const handleDelete = (id: string) => {
        if (confirm('Bu sonucu silmek istediğinizden emin misiniz?')) {
            setResults(results.filter(r => r.id !== id))
        }
    }

    const handleAddResult = () => {
        if (!newResult.name || !newResult.bibNumber || !newResult.finishTime) return

        const categoryResults = results.filter(r => r.category === newResult.category)
        const maxRank = Math.max(0, ...categoryResults.map(r => r.rank))

        const result: Result = {
            id: Date.now().toString(),
            rank: (newResult.rank || maxRank + 1),
            bibNumber: newResult.bibNumber || '',
            name: newResult.name || '',
            category: newResult.category as 'long' | 'short',
            ageGroup: newResult.ageGroup || '30-39',
            finishTime: newResult.finishTime || '',
            avgSpeed: newResult.avgSpeed || '-'
        }

        setResults([...results, result])
        setShowAddModal(false)
        setNewResult({ category: 'long', ageGroup: '30-39' })
    }

    const getRankBadge = (rank: number) => {
        if (rank === 1) return <Medal className="h-5 w-5 text-yellow-400" />
        if (rank === 2) return <Medal className="h-5 w-5 text-slate-300" />
        if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
        return <span className="text-slate-400">{rank}</span>
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Trophy className="h-8 w-8 text-emerald-400" />
                        Sonuç Tablosu
                    </h1>
                    <p className="text-slate-400 mt-1">Yarış sonuçlarını yönetin</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-white/10">
                        <Upload className="h-4 w-4 mr-2" />
                        CSV Yükle
                    </Button>
                    <Button
                        className="bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => setShowAddModal(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Sonuç Ekle
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {[
                    { value: 'all', label: 'Tümü' },
                    { value: 'long', label: 'Uzun Parkur (98km)' },
                    { value: 'short', label: 'Kısa Parkur (55km)' },
                ].map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value as typeof filter)}
                        className={`px-4 py-2 rounded-lg transition-all ${filter === f.value
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Results Table */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Sıra</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Bib</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Katılımcı</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Parkur</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Yaş Grubu</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Bitiş Süresi</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Ort. Hız</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredResults.map((result) => (
                            <tr key={result.id} className="hover:bg-slate-800/50 transition-colors">
                                {editingId === result.id ? (
                                    <>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                value={editForm?.rank || ''}
                                                onChange={(e) => setEditForm({ ...editForm!, rank: parseInt(e.target.value) })}
                                                className="w-16 bg-slate-800 border border-white/20 rounded px-2 py-1 text-white"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={editForm?.bibNumber || ''}
                                                onChange={(e) => setEditForm({ ...editForm!, bibNumber: e.target.value })}
                                                className="w-20 bg-slate-800 border border-white/20 rounded px-2 py-1 text-white"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={editForm?.name || ''}
                                                onChange={(e) => setEditForm({ ...editForm!, name: e.target.value })}
                                                className="w-full bg-slate-800 border border-white/20 rounded px-2 py-1 text-white"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={editForm?.category || 'long'}
                                                onChange={(e) => setEditForm({ ...editForm!, category: e.target.value as 'long' | 'short' })}
                                                className="bg-slate-800 border border-white/20 rounded px-2 py-1 text-white"
                                            >
                                                <option value="long">Uzun</option>
                                                <option value="short">Kısa</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={editForm?.ageGroup || ''}
                                                onChange={(e) => setEditForm({ ...editForm!, ageGroup: e.target.value })}
                                                className="w-20 bg-slate-800 border border-white/20 rounded px-2 py-1 text-white"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={editForm?.finishTime || ''}
                                                onChange={(e) => setEditForm({ ...editForm!, finishTime: e.target.value })}
                                                className="w-24 bg-slate-800 border border-white/20 rounded px-2 py-1 text-white"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={editForm?.avgSpeed || ''}
                                                onChange={(e) => setEditForm({ ...editForm!, avgSpeed: e.target.value })}
                                                className="w-24 bg-slate-800 border border-white/20 rounded px-2 py-1 text-white"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" onClick={handleSaveEdit} className="bg-emerald-500 hover:bg-emerald-600">
                                                    <Save className="h-3 w-3" />
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center w-8 h-8">
                                                {getRankBadge(result.rank)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-emerald-400 font-mono">#{result.bibNumber}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-medium">{result.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2 py-1 rounded ${result.category === 'long'
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-cyan-500/20 text-cyan-400'
                                                }`}>
                                                {result.category === 'long' ? '98km' : '55km'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{result.ageGroup}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-mono flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-slate-500" />
                                                {result.finishTime}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{result.avgSpeed}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => handleEdit(result)}>
                                                    <Edit2 className="h-3 w-3" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => handleDelete(result.id)}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredResults.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Henüz sonuç eklenmemiş</p>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Yeni Sonuç Ekle</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-slate-400 block mb-1">Sıra</label>
                                    <input
                                        type="number"
                                        value={newResult.rank || ''}
                                        onChange={(e) => setNewResult({ ...newResult, rank: parseInt(e.target.value) })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 block mb-1">Bib No</label>
                                    <input
                                        type="text"
                                        value={newResult.bibNumber || ''}
                                        onChange={(e) => setNewResult({ ...newResult, bibNumber: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 block mb-1">İsim</label>
                                <input
                                    type="text"
                                    value={newResult.name || ''}
                                    onChange={(e) => setNewResult({ ...newResult, name: e.target.value })}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-slate-400 block mb-1">Parkur</label>
                                    <select
                                        value={newResult.category || 'long'}
                                        onChange={(e) => setNewResult({ ...newResult, category: e.target.value as 'long' | 'short' })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                                    >
                                        <option value="long">Uzun (98km)</option>
                                        <option value="short">Kısa (55km)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 block mb-1">Yaş Grubu</label>
                                    <input
                                        type="text"
                                        value={newResult.ageGroup || ''}
                                        onChange={(e) => setNewResult({ ...newResult, ageGroup: e.target.value })}
                                        placeholder="ör: 30-39"
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-slate-400 block mb-1">Bitiş Süresi</label>
                                    <input
                                        type="text"
                                        value={newResult.finishTime || ''}
                                        onChange={(e) => setNewResult({ ...newResult, finishTime: e.target.value })}
                                        placeholder="ör: 2:45:32"
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 block mb-1">Ort. Hız</label>
                                    <input
                                        type="text"
                                        value={newResult.avgSpeed || ''}
                                        onChange={(e) => setNewResult({ ...newResult, avgSpeed: e.target.value })}
                                        placeholder="ör: 35.5 km/s"
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                                İptal
                            </Button>
                            <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600" onClick={handleAddResult}>
                                Ekle
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    )
}
