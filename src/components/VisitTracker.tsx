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
        await fetch('/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: pathname }),
        })
      } catch {
        // Fail silently without disrupting page rendering or throwing errors
      }
    }

    track()
  }, [pathname])

  return null
}
