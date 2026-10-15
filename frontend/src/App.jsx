import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import EmbeddingPanel from './components/EmbeddingPanel'
import SimilarityPanel from './components/SimilarityPanel'
import SearchPanel from './components/SearchPanel'
import EvaluationDashboard from './components/EvaluationDashboard'
import ModelCard from './components/ModelCard'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/embed" replace />} />
            <Route path="/embed" element={<EmbeddingPanel />} />
            <Route path="/similarity" element={<SimilarityPanel />} />
            <Route path="/search" element={<SearchPanel />} />
            <Route path="/evaluation" element={<EvaluationDashboard />} />
            <Route path="/model-card" element={<ModelCard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
