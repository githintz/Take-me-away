import { ExternalLink } from 'lucide-react'

interface Props {
  deepLinks: {
    googleFlights?: string
    skyscanner?: string
    kiwi?: string
  }
}

const LINKS = [
  {
    key: 'googleFlights' as const,
    label: 'Google Flights',
    color: 'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700',
    dot: 'bg-blue-500',
  },
  {
    key: 'skyscanner' as const,
    label: 'Skyscanner',
    color: 'hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700',
    dot: 'bg-sky-500',
  },
  {
    key: 'kiwi' as const,
    label: 'Kiwi',
    color: 'hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700',
    dot: 'bg-orange-500',
  },
]

export function AggregatorLinks({ deepLinks }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {LINKS.map(({ key, label, color, dot }) => {
        const href = deepLinks[key]
        if (!href) return null
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium',
              'border border-slate-200 rounded-lg text-slate-600 bg-white',
              'transition-all hover:shadow-sm',
              color,
            ].join(' ')}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
            {label}
            <ExternalLink size={11} className="opacity-60" />
          </a>
        )
      })}
    </div>
  )
}
