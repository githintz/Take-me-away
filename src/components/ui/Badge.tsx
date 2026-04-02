import type { ReactNode } from 'react'
import type { ItineraryTag } from '@/types/flight'

interface BadgeProps {
  variant: ItineraryTag | 'stops' | 'neutral'
  children: ReactNode
}

const variantClasses: Record<BadgeProps['variant'], string> = {
  'best-weekend': 'bg-amber-100 text-amber-800 border border-amber-300',
  'best-value':   'bg-green-100 text-green-800 border border-green-300',
  'fastest':      'bg-blue-100 text-blue-800 border border-blue-300',
  'direct':       'bg-emerald-100 text-emerald-800 border border-emerald-300',
  'stops':        'bg-slate-100 text-slate-600 border border-slate-200',
  'neutral':      'bg-slate-100 text-slate-600 border border-slate-200',
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  )
}
