import React, { useEffect, useState } from 'react'
import { getModelInfo } from '../api/apiClient'

export default function EvaluationDashboard() {
  const [modelInfo, setModelInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getModelInfo()
      .then(setModelInfo)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const STS_RESULTS = {
    spearman: 0.8829,
    dataset: 'STS Benchmark',
    split: 'test',
    num_pairs: 1379,
    metric: 'cosine_similarity',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Evaluation Dashboard</h1>
      <p className="text-gray-500 mb-6">
        Model performance on the STS Benchmark test set.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">STS Benchmark Results</h2>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl font-bold text-indigo-600">{STS_RESULTS.spearman.toFixed(4)}</span>
            <div>
              <p className="text-sm font-medium text-gray-600">Spearman Correlation</p>
              <p className="text-xs text-gray-400">{STS_RESULTS.dataset} · {STS_RESULTS.split} split</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="h-3 rounded-full bg-indigo-500"
              style={{ width: `${Math.round(STS_RESULTS.spearman * 100)}%` }}
            />
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-gray-500">Dataset</dt>
              <dd className="font-medium">{STS_RESULTS.dataset}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Split</dt>
              <dd className="font-medium capitalize">{STS_RESULTS.split}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Pairs</dt>
              <dd className="font-medium">{STS_RESULTS.num_pairs.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Metric</dt>
              <dd className="font-medium">{STS_RESULTS.metric.replace(/_/g, ' ')}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Model Metadata</h2>
          {loading && <p className="text-gray-400 text-sm">Loading...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {modelInfo && (
            <dl className="space-y-3 text-sm">
              {[
                ['Model Name', modelInfo.model_name],
                ['Version', modelInfo.model_version],
                ['Dimensions', modelInfo.dimensions],
                ['Max Sequence Length', modelInfo.max_sequence_length],
                ['Pooling', modelInfo.pooling],
                ['Similarity Metric', modelInfo.similarity_metric],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="font-medium text-right">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-blue-800 mb-2">About STS Benchmark</h3>
        <p className="text-sm text-blue-700 leading-relaxed">
          The Semantic Textual Similarity Benchmark (STS-B) measures the degree to which two sentences are semantically equivalent.
          Human annotators rate sentence pairs on a scale of 0 (completely dissimilar) to 5 (completely equivalent).
          Spearman correlation measures the agreement between model-predicted cosine similarities and these human scores.
          A correlation of ≥0.88 is state-of-the-art for this model class.
        </p>
        <p className="text-xs text-blue-500 mt-3">
          To run a fresh evaluation: <code className="bg-blue-100 rounded px-1">cd backend &amp;&amp; python -m evaluation.evaluate_sts</code>
        </p>
      </div>
    </div>
  )
}
