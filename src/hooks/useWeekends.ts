import { useMemo } from 'react'
import { getUpcomingWeekends } from '@/utils/dateUtils'
import type { WeekendPair } from '@/utils/dateUtils'

export function useWeekends(count = 6): WeekendPair[] {
  return useMemo(() => getUpcomingWeekends(count), [count])
}
