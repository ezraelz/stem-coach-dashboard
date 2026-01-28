import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../components/sideBar'
const SideBarAny = SideBar as React.ComponentType<any>
import Heading from '../components/heading'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for mobile */}
      <div className={`lg:hidden ${sidebarOpen ? 'fixed inset-0 z-40' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64">
          <SideBarAny onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Static Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
        <SideBarAny />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header with mobile menu button */}
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
          <button
            type="button"
            className="lg:hidden -ml-2 p-2 text-gray-400 hover:text-gray-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-1">
            <Heading />
          </div>
        </header>

        {/* Page Content */}
        <main className="py-6">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout