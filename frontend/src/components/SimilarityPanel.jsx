import React, { useState } from 'react'
import { computeSimilarity } from '../api/apiClient'

function getLabel(score) {
  if (score > 0.8) return { label: 'Very Similar', color: 'text-green-600' }
  if (score > 0.6) return { label: 'Similar', color: 'text-blue-600' }
  if (score > 0.4) return { label: 'Somewhat Related', color: 'text-yellow-600' }
  return { label: 'Different', color: 'text-red-600' }
}

function getBarColor(score) {
  if (score > 0.8) return 'bg-green-500'
  if (score > 0.6) return 'bg-blue-500'
  if (score > 0.4) return 'bg-yellow-400'
  return 'bg-red-400'
}

export default function SimilarityPanel() {
  const [s1, setS1] = useState('')
  const [s2, setS2] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!s1.trim() || !s2.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await computeSimilarity(s1.trim(), s2.trim())
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Semantic Similarity</h1>
      <p className="text-gray-500 mb-6">
        Compare two sentences and compute their cosine similarity score.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sentence 1</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              rows={2}
              placeholder="Enter first sentence..."
              value={s1}
              onChange={(e) => setS1(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sentence 2</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              rows={2}
              placeholder="Enter second sentence..."
              value={s2}
              onChange={(e) => setS2(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !s1.trim() || !s2.trim()}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Comparing...' : 'Compare'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4 text-sm">
          {error}
        </div>
      )}

      {result && (() => {
        const score = result.similarity_score
        const { label, color } = getLabel(score)
        const pct = Math.round(score * 100)
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Result</h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl font-bold text-gray-800">{score.toFixed(4)}</span>
              <span className={`text-lg font-semibold ${color}`}>{label}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${getBarColor(score)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">Model: {result.model_name} v{result.model_version}</p>
          </div>
        )
      })()}
    </div>
  )
}
