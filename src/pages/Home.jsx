import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-10">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-2xl font-bold">O</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-6">
          <h1 className="text-4xl font-medium text-gray-900">Welcome to Owl</h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            Our platform provides intelligent tools designed to enhance your productivity and streamline your workflow.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/auth?mode=signup')}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
          >
            Get Started
          </button>
          
          <button 
            onClick={() => navigate('/auth?mode=login')}
            className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-all duration-200"
          >
            Log In
          </button>
        </div>

        {/* Additional Info */}
        <div className="pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Trusted by teams worldwide to manage their mapping solutions
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home