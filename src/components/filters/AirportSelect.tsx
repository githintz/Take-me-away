import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Search } from 'lucide-react'
import { searchAirports, getAirport } from '@/utils/airports'
import type { Airport } from '@/types/flight'

interface Props {
  label: string
  selectedIatas: string[]
  onChange: (iatas: string[]) => void
  maxSelected?: number
}

export function AirportSelect({ label, selectedIatas, onChange, maxSelected = 5 }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = query.length >= 1 ? searchAirports(query) : []
  const selectedAirports = selectedIatas.map(iata => getAirport(iata)).filter(Boolean) as Airport[]

  const addAirport = useCallback(
    (iata: string) => {
      if (!selectedIatas.includes(iata) && selectedIatas.length < maxSelected) {
        onChange([...selectedIatas, iata])
      }
      setQuery('')
      setOpen(false)
      inputRef.current?.focus()
    },
    [selectedIatas, onChange, maxSelected],
  )

  const removeAirport = useCallback(
    (iata: string) => {
      onChange(selectedIatas.filter(i => i !== iata))
    },
    [selectedIatas, onChange],
  )

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = results[highlighted]
      if (item) addAirport(item.iata)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>

      {/* Selected pills */}
      {selectedAirports.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedAirports.map(a => (
            <span
              key={a.iata}
              className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full"
            >
              <span className="font-bold">{a.iata}</span>
              <span className="text-indigo-600">{a.city}</span>
              <button
                type="button"
                onClick={() => removeAirport(a.iata)}
                className="text-indigo-500 hover:text-indigo-700 ml-0.5"
                aria-label={`Remove ${a.city}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={selectedAirports.length === 0 ? 'Search city or airport code…' : 'Add another…'}
          disabled={selectedIatas.length >= maxSelected}
          onChange={e => {
            setQuery(e.target.value)
            setOpen(true)
            setHighlighted(0)
          }}
          onFocus={() => { if (query) setOpen(true) }}
          onKeyDown={handleKeyDown}
          className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-slate-50 disabled:text-slate-400"
        />
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {results.map((a, i) => (
            <button
              key={a.iata}
              type="button"
              onMouseDown={e => { e.preventDefault(); addAirport(a.iata) }}
              onMouseEnter={() => setHighlighted(i)}
              className={[
                'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
                i === highlighted ? 'bg-indigo-50' : 'hover:bg-slate-50',
                selectedIatas.includes(a.iata) ? 'opacity-40 pointer-events-none' : '',
              ].join(' ')}
            >
              <span className="font-mono font-bold text-sm text-indigo-700 w-10">{a.iata}</span>
              <span className="text-sm text-slate-700 truncate">
                {a.city} <span className="text-slate-400">· {a.name}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
