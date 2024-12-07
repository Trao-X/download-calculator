import React, { useState, useEffect } from 'react'
import DownloadCalculator from './components/DownloadCalculator'
import { MoonIcon, SunIcon } from 'lucide-react'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference
    const savedMode = localStorage.getItem('theme')
    if (savedMode) return savedMode === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Update theme and local storage
  useEffect(() => {
    const htmlElement = document.documentElement
    if (isDarkMode) {
      htmlElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      htmlElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="relative">
        <button 
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="absolute -top-2 -left-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
        >
          {isDarkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-500" />
          ) : (
            <MoonIcon className="w-6 h-6 text-brand-blue" />
          )}
        </button>
      </div>
      <h1 
        className="text-3xl font-bold text-center mb-6 text-brand-blue dark:text-brand-blue/80"
        id="page-title"
      >
        Download Time Calculator
      </h1>
      <DownloadCalculator />
    </div>
  )
}

export default App