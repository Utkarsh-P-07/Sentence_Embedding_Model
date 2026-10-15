import React, { useState } from 'react'
import { generateEmbedding } from '../api/apiClient'

export default function EmbeddingPanel() {
  const [sentence, setSentence] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!sentence.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await generateEmbedding(sentence.trim())
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const previewEmbedding = (embedding) => {
    if (!embedding || embedding.length === 0) return '[]'
    const preview = embedding.slice(0, 10).map((v) => v.toFixed(4))
    return `[${preview.join(', ')}${embedding.length > 10 ? ', ...' : ''}]`
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Sentence Embedding</h1>
      <p className="text-gray-500 mb-6">
        Convert a sentence into a dense 384-dimensional vector representation.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input Sentence
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          rows={3}
          placeholder="Enter a sentence..."
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !sentence.trim()}
          className="mt-3 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Embedding'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Result</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-indigo-50 rounded-lg p-3">
              <p className="text-xs text-indigo-400 font-medium">Model</p>
              <p className="text-sm font-semibold text-indigo-800">{result.model_name}</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3">
              <p className="text-xs text-indigo-400 font-medium">Version</p>
              <p className="text-sm font-semibold text-indigo-800">{result.model_version}</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3">
              <p className="text-xs text-indigo-400 font-medium">Dimensions</p>
              <p className="text-sm font-semibold text-indigo-800">{result.dimensions}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Embedding Vector (first 10 of {result.dimensions} dims)</p>
            <code className="block bg-gray-100 rounded-lg p-3 text-xs font-mono text-gray-700 break-all">
              {previewEmbedding(result.embedding)}
            </code>
          </div>
        </div>
      )}
    </div>
  )
}
