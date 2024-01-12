import React from 'react'
import LoadingSpinner from './ProgressBar'
import RainBowProgressBar from './RainBowProgressBar'

const AppIndicator = () => {
  return (
    <div className="bg-slate-100 flex items-center justify-center h-screen w-full">
    <RainBowProgressBar/>
  </div>
  )
}

export default AppIndicator