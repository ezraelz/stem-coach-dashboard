import React from 'react'
import { useNavigate } from 'react-router-dom'

const BackButton = () => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    }

  return (
    <div 
        onClick={handleBack}
        className='mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer'>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Go Back
    </div>
  )
}

export default BackButton