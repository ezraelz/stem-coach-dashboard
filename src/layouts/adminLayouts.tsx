import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SideBar from '../components/sideBar'
const SideBarAny = SideBar as React.ComponentType<any>
import Heading from '../components/heading'
import BackButton from '../components/ui/backButton'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const location = useLocation()

  // Close mobile sidebar on route change
  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous state updates during render
    const timer = setTimeout(() => {
      setSidebarOpen(false)
    }, 0)
    
    return () => clearTimeout(timer)
  }, [location.pathname])

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // On desktop, ensure sidebar is visible
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate main content width based on sidebar state
  const getMainContentClasses = () => {
    if (sidebarOpen) {
      return 'lg:pl-64' // Mobile sidebar open
    }
    
    if (isSidebarCollapsed) {
      return 'lg:pl-20' // Desktop sidebar collapsed
    }
    
    return 'lg:pl-64' // Desktop sidebar expanded
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden ${sidebarOpen ? 'fixed inset-0 z-40' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
        
        {/* Sidebar Panel */}
        <div className="fixed inset-y-0 left-0 z-50 flex max-w-xs w-full">
          <div className="relative flex-1 flex flex-col bg-gray-900">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SideBarAny 
              onClose={() => setSidebarOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      </div>

      {/* Static Desktop Sidebar */}
      <div className={`
        hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 
        ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        transition-all duration-300 ease-in-out
      `}>
        <SideBarAny 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* Main Content Area */}
      <div className={`
        flex-1 flex flex-col min-w-0
        transition-all duration-300 ease-in-out
        ${getMainContentClasses()}
      `}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center flex-1">
              {/* Mobile Menu Button */}
              <button
                type="button"
                className="lg:hidden -ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {/* Heading - Takes remaining space */}
              <div className="flex-1">
                <Heading />
              </div>

            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb - Optional */}
              <nav className="hidden lg:flex mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <div className="flex">
                      <a href="/admin" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                        Dashboard
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-4 text-sm font-medium text-gray-700">
                        {location.pathname.split('/').pop()?.charAt(0).toUpperCase() + location.pathname.split('/').pop()?.slice(1) || 'Page'}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>

              {/* Main Content */}
              <Outlet />
            </div>
          </div>
        </main>

      </div>
    </div>
  )
}

export default AdminLayout