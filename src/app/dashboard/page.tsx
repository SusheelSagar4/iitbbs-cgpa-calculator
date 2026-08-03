'use client'

import { useState, useEffect } from 'react'
import Onboarding from '@/components/Onboarding'
import CurriculumDashboard from '@/components/CurriculumDashboard'
import { getLocalTrackerData, TrackerData } from '@/lib/storage'

export default function DashboardPage() {
  const [trackerData, setTrackerData] = useState<TrackerData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const data = getLocalTrackerData()
    if (data) {
      setTrackerData(data)
    }
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
          <svg className="h-5 w-5 animate-spin text-teal-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading your academic tracker...
        </div>
      </div>
    )
  }

  if (!trackerData) {
    return (
      <Onboarding
        onCurriculumInitialized={(newData) => {
          setTrackerData(newData)
        }}
      />
    )
  }

  return (
    <CurriculumDashboard
      branchId={trackerData.branchId}
      initialSemesters={trackerData.semesters}
      onReset={() => setTrackerData(null)}
    />
  )
}
