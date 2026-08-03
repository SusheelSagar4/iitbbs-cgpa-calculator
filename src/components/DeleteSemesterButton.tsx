'use client'

import { useState } from 'react'

interface DeleteSemesterButtonProps {
  onDeleteSemester: () => void
}

export default function DeleteSemesterButton({
  onDeleteSemester,
}: DeleteSemesterButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this semester and all its courses?'
    )
    if (!confirmed) return

    setLoading(true)
    onDeleteSemester()
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/40 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        {loading ? 'Deleting...' : 'Delete Semester'}
      </button>
    </div>
  )
}
