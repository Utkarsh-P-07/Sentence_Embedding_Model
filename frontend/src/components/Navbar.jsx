import React from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/embed', label: 'Embedding' },
  { to: '/similarity', label: 'Similarity' },
  { to: '/search', label: 'Search' },
  { to: '/evaluation', label: 'Evaluation' },
  { to: '/model-card', label: 'Model Card' },
]

export default function Navbar() {
  return (
    <nav className="bg-indigo-700 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <span className="text-white font-bold text-lg tracking-tight">
          🧠 Sentence Embedding Model
        </span>
        <div className="flex gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
