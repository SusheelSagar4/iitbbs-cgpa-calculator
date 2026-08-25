import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const path = typeof body?.path === 'string' ? body.path : '/'

    const supabase = createClient()
    console.log('[api/track-visit] Attempting to insert visit for path:', path)

    const { error } = await supabase
      .from('page_visits')
      .insert([{ path }])

    if (error) {
      console.error('[api/track-visit] Supabase DB error:', error.message, error.details, error.hint)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[api/track-visit] Successfully inserted visit for path:', path)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('[api/track-visit] Unhandled exception:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
