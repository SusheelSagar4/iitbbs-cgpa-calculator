import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.rpc('get_visit_stats')

    if (error) {
      console.error('Error fetching visit stats:', error)
      return NextResponse.json(
        { totalVisits: 0, todayVisits: 0, weekVisits: 0, error: error.message },
        { status: 500 }
      )
    }

    const stats =
      typeof data === 'object' && data !== null
        ? data
        : { totalVisits: 0, todayVisits: 0, weekVisits: 0 }

    return NextResponse.json(stats)
  } catch (err) {
    console.error('Unhandled visit-stats error:', err)
    return NextResponse.json(
      { totalVisits: 0, todayVisits: 0, weekVisits: 0 },
      { status: 500 }
    )
  }
}
