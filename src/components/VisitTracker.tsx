'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || lastTrackedPath.current === pathname) return

    lastTrackedPath.current = pathname

    const track = async () => {
      try {
        console.log('[VisitTracker] Tracking page visit for path:', pathname)
        const res = await fetch('/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: pathname }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          console.error('[VisitTracker] API returned error status:', res.status, data)
        } else {
          console.log('[VisitTracker] Successfully recorded visit for path:', pathname)
        }
      } catch (err) {
        console.error('[VisitTracker] Network error sending tracking request:', err)
      }
    }

    track()
  }, [pathname])

  return null
}
