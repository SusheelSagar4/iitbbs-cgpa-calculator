'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CurriculumDashboard from '@/components/CurriculumDashboard'
import DashboardLayout from '@/app/dashboard/layout'
import {
  getLocalTrackerData,
  initializeLocalCurriculum,
  clearLocalTrackerData,
  TrackerData,
} from '@/lib/storage'

interface PageProps {
  params: {
    branch: string
  }
}

const SLUG_TO_BRANCH_ID: Record<string, string> = {
  mechanical: 'ME',
  cse: 'CS',
  ee: 'EE',
  ece: 'ECE',
  civil: 'CE',
  metallurgy: 'MM',
  me: 'ME',
  cs: 'CS',
  ce: 'CE',
  mm: 'MM',
  mems: 'MM',
  ep: 'EP',
}

export default function CalculatorPage({ params }: PageProps) {
  const router = useRouter()
  const branchParam = params.branch.toLowerCase()
  const branchId = SLUG_TO_BRANCH_ID[branchParam] || 'CS'

  const [trackerData, setTrackerData] = useState<TrackerData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let data = getLocalTrackerData()
    if (!data || data.branchId !== branchId) {
      data = initializeLocalCurriculum(branchId)
    }
    setTrackerData(data)
    setIsLoaded(true)
  }, [branchId])

  const handleReset = () => {
    clearLocalTrackerData()
    router.push('/select-branch')
  }

  if (!isLoaded || !trackerData) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-3 text-[var(--text-muted)] text-sm font-bold">
            <svg className="h-5 w-5 animate-spin text-[var(--color-gold)]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading 8-semester curriculum calculator...
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <CurriculumDashboard
        branchId={trackerData.branchId}
        initialSemesters={trackerData.semesters}
        onReset={handleReset}
      />
    </DashboardLayout>
  )
}
