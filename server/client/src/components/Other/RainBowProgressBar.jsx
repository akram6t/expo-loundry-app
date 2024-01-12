import React from 'react'

const RainBowProgressBar = () => {
    return (
        <div class="flex justify-center items-center p-5">
            <div class="relative w-16 h-16 animate-spin rounded-full bg-gradient-to-r from-purple-400 via-blue-500 to-red-400 ">
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border-2 border-white"></div>
            </div>
        </div>
    )
}

export default RainBowProgressBar