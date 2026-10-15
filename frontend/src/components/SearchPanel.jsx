import React, { useState } from 'react'
import { semanticSearch } from '../api/apiClient'

const DEFAULT_CANDIDATES = [
  'The cat sat on the mat.',
  'Machine learning is transforming industries.',
  'Python is a popular programming language.',
  'The quick brown fox jumps over the lazy dog.',
  'Natural language processing enables computers to understand text.',
]

export default function SearchPanel() {
  const [query, setQuery] = useState('')
  const [candidates, setCandidates] = useState(DEFAULT_CANDIDATES)
  const [newCandidate, setNewCandidate] = useState('')
  const [topK, setTopK] = useState(5)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addCandidate = () => {
    if (newCandidate.trim() && !candidates.includes(newCandidate.trim())) {
      setCandidates([...candidates, newCandidate.trim()])
      setNewCandidate('')
    }
  }

  const removeCandidate = (idx) => {
    setCandidates(candidates.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim() || candidates.length === 0) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await semanticSearch(query.trim(), candidates, topK)
      setResults(data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Semantic Search</h1>
      <p className="text-gray-500 mb-6">
        Rank candidate sentences by semantic relevance to your query.
      </p>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Query</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your search query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Candidates ({candidates.length})
            </label>
            <div className="space-y-2 mb-3">
              {candidates.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded px-3 py-1.5">{c}</span>
                  <button
                    type="button"
                    onClick={() => removeCandidate(i)}
                    className="text-red-400 hover:text-red-600 text-xs font-bold px-2"
                    aria-label="Remove candidate"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Add a candidate sentence..."
                value={newCandidate}
                onChange={(e) => setNewCandidate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCandidate())}
              />
              <button
                type="button"
                onClick={addCandidate}
                className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700">Top-K:</label>
            <input
              type="number"
              min={1}
              max={candidates.length}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-20 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim() || candidates.length === 0}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4 text-sm">
          {error}
        </div>
      )}

      {results && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
          <div className="space-y-3">
            {results.results.map((r) => (
              <div key={r.rank} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  {r.rank}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 mb-1">{r.sentence}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${Math.round(r.score * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-500">{r.score.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">Model: {results.model_name} v{results.model_version}</p>
        </div>
      )}
    </div>
  )
}
