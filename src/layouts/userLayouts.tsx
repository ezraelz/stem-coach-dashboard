import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Nav from '../components/navs/Nav'

const UserLayouts = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <Nav />

      {/* Main Content */}
      <main className="container mx-auto px-4 mt-6">

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Outlet />
        </div>

        {/* Optional: Quick Actions Bar */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Need help?</h3>
              <p className="text-sm text-gray-600 mt-1">Check our FAQ or contact support</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Link 
                to="/help" 
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Visit Help Center
              </Link>
              <Link 
                to="/contact" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">U</span>
                </div>
                <span className="text-xl font-bold text-gray-900">UserApp</span>
              </Link>
              <p className="text-gray-600 text-sm">
                Making your experience better every day.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-600 hover:text-blue-600 text-sm">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-blue-600 text-sm">Pricing</Link></li>
                <li><Link to="/releases" className="text-gray-600 hover:text-blue-600 text-sm">Releases</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm">About</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-blue-600 text-sm">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 text-sm">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-600 hover:text-blue-600 text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-blue-600 text-sm">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-gray-600 hover:text-blue-600 text-sm">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} UserApp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}


export default UserLayouts