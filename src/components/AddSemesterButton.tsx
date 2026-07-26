'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AddSemesterButtonProps {
  currentMaxSemesterNumber: number
  userId: string
}

export default function AddSemesterButton({
  currentMaxSemesterNumber,
  userId,
}: AddSemesterButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAddSemester = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    const nextSemesterNumber = currentMaxSemesterNumber + 1

    try {
      const { error } = await supabase.from('semesters').insert({
        semester_number: nextSemesterNumber,
        user_id: userId,
      })

      if (error) {
        console.error('Add semester error:', error)
        setErrorMessage(error.message)
      } else {
        router.refresh()
      }
    } catch (err: unknown) {
      console.error('Add semester error:', err)
      if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('An unexpected error occurred while adding the semester.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={handleAddSemester}
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-900/20 transition-all hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        {isLoading ? 'Adding...' : 'Add Semester'}
      </button>

      {errorMessage && (
        <p className="text-xs font-medium text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
