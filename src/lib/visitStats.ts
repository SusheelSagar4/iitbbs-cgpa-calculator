export interface VisitStats {
  totalVisits: number
  todayVisits: number
  weekVisits: number
}

export async function getVisitStats(): Promise<VisitStats> {
  try {
    const res = await fetch('/api/visit-stats', { cache: 'no-store' })
    if (!res.ok) {
      return { totalVisits: 0, todayVisits: 0, weekVisits: 0 }
    }
    const data = await res.json()
    return {
      totalVisits: Number(data.totalVisits || 0),
      todayVisits: Number(data.todayVisits || 0),
      weekVisits: Number(data.weekVisits || 0),
    }
  } catch (err) {
    console.error('Failed to load visit stats:', err)
    return { totalVisits: 0, todayVisits: 0, weekVisits: 0 }
  }
}
