'use client'

import { useTheme } from './ThemeProvider'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle Light and Dark Mode"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl glass-button-secondary transition-all hover:scale-105 active:scale-95"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  )
}
