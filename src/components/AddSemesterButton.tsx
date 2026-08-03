'use client'

interface AddSemesterButtonProps {
  onAddSemester: () => void
  isLoading?: boolean
}

export default function AddSemesterButton({
  onAddSemester,
  isLoading = false,
}: AddSemesterButtonProps) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={onAddSemester}
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
    </div>
  )
}
