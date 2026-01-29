import React, { useEffect, useState } from 'react'
import useUsers from '../../../hooks/useUsers';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const navigate = useNavigate();

  const { 
    users, 
    isLoading, 
    error,
    updateUser, 
    deleteUser,
    fetchUsers,
  } = useUsers();

  // Filter users based on search term
  const filteredUsers = users?.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle editing a user
  const handleEdit = (userId: number) => {
    const updatedData = { full_name: 'Updated Name' }
    updateUser(userId, updatedData)
  }

  // Handle deleting a user
  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Users</h3>
            <p className="text-gray-600">There was an issue fetching the user data. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Coach Management
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Manage your team members and their account permissions
              </p>
            </div>
            <div>
              <button
                onClick={() => navigate('/admin/users/add')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Add New User
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Coaches', value: users?.length || 0, color: 'blue', icon: '👥' },
            { label: 'Active Coaches', value: users?.filter(u => u.is_active === true).length || 0, color: 'green', icon: '✅' },
            { label: 'Admins', value: users?.filter(u => u.role_name === 'admin').length || 0, color: 'purple', icon: '👑' },
            { label: 'Pending Coaches', value: users?.filter(u => u.is_active === false).length || 0, color: 'yellow', icon: '⏳' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-2xl bg-${stat.color}-50`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-full`}
                    style={{ width: `${Math.min((stat.value / (users?.length || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 outline-none transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="mt-6 text-lg font-medium text-gray-700">Loading users...</p>
                <p className="text-gray-500 mt-2">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        User Information
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Joined Date
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <tr 
                          key={user.id} 
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                  {user.full_name?.charAt(0) || 'U'}
                                </div>
                                {user.is_active === true && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                  {user.full_name}
                                </h4>
                                <p className="text-gray-600 text-sm mt-1">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 ${
                              user?.role_name === 'admin' 
                                ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800' 
                                : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800'
                            }`}>
                              {user?.role_name === 'admin' ? '👑 ' : '👤 '}
                              {user?.role_name}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <span className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 ${
                                user.is_active === true
                                  ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800'
                                  : user.is_active === false
                                  ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800'
                                  : 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800'
                              }`}>
                                {user.is_active === true && '● '}
                                {user.is_active === false && '⏳ '}
                                {user.is_active === true ? 'Active' : user.is_active === false ? 'Inactive' : 'Pending'}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-gray-700 font-medium">
                              {user?.created_at &&
                                new Date(user.created_at).toLocaleString()}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {user?.created_at}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleEdit(user.id)}
                                className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200 hover:shadow-md transition-all duration-200 group/edit"
                                title="Edit user"
                              >
                                <svg className="w-5 h-5 group-hover/edit:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="p-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 hover:shadow-md transition-all duration-200 group/delete"
                                title="Delete user"
                              >
                                <svg className="w-5 h-5 group-hover/delete:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                              <button className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 hover:from-gray-100 hover:to-gray-200 hover:shadow-md transition-all duration-200 group/more">
                                <svg className="w-5 h-5 group-hover/more:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td  className="px-8 py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {searchTerm ? 'No matching users found' : 'No users available'}
                            </h3>
                            <p className="text-gray-600 max-w-md">
                              {searchTerm 
                                ? 'Try adjusting your search terms or clear the search to see all users.'
                                : 'Get started by adding your first user using the "Add New User" button above.'
                              }
                            </p>
                            {searchTerm && (
                              <button
                                onClick={() => setSearchTerm('')}
                                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
                              >
                                Clear Search
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredUsers.length > itemsPerPage && (
                <div className="px-8 py-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-gray-700 font-medium">
                      Showing <span className="text-gray-900">{startIndex + 1}</span> to{' '}
                      <span className="text-gray-900">
                        {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
                      </span>{' '}
                      of <span className="text-gray-900">{filteredUsers.length}</span> users
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-3 rounded-xl border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:border-gray-400 hover:shadow-sm transition-all duration-200 font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg transform scale-105'
                                : 'border-2 border-gray-300 hover:bg-white hover:border-gray-400 hover:shadow-sm'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-2 text-gray-500">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="px-5 py-3 rounded-xl border-2 border-gray-300 hover:bg-white hover:border-gray-400 hover:shadow-sm transition-all duration-200 font-medium"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-3 rounded-xl border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:border-gray-400 hover:shadow-sm transition-all duration-200 font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Users