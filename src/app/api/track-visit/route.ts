import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const path = typeof body?.path === 'string' ? body.path : '/'

    const supabase = createClient()
    const { error } = await supabase
      .from('page_visits')
      .insert([{ path }])

    if (error) {
      console.error('Error inserting page visit:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unhandled track-visit error:', err)
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 })
  }
}
