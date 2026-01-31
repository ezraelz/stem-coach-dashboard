import React, { useEffect, useState } from 'react'
import { useCourses } from '../../../hooks/useCourse'
import { useNavigate } from 'react-router-dom'

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('all') 
  const [sortBy, setSortBy] = useState('newest') 
  const navigate = useNavigate();
  const itemsPerPage = 9

  const { 
    courses, 
    isLoading, 
    error, 
    updateCourse, 
    deleteCourse,
    refetch,
    fetchCourses
  } = useCourses()

  useEffect(()=> {
    fetchCourses();
  }, []);

  // Filter and sort courses
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = 
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'active' ? course.is_active === true :
      filter === 'completed' ? course.is_active === false :
      filter === 'draft' ? course.is_active === false : true

    return matchesSearch && matchesFilter
  }) || []

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch(sortBy) {
        case 'newest': 
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest': 
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'name': 
        return a.title.localeCompare(b.title)
        default: 
        return 0
    }
    })

  // Pagination logic
  const totalPages = Math.ceil(sortedCourses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCourses = sortedCourses.slice(startIndex, startIndex + itemsPerPage)

  // Handle adding a new course
  const handleAddCourse = () => {
    navigate('/admin/courses/add')
  }

  // Handle deleting a course
  const handleDeleteCourse = (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(courseId)
    }
  }

  // Format date
    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Courses</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error.message}</p>
            <button
              onClick={refetch}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Try Again
            </button>
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                Course Management
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Create, manage, and track your educational courses
              </p>
            </div>
            <button
              onClick={handleAddCourse}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Course
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { 
              label: 'Total Courses', 
              value: courses?.length || 0, 
              color: 'blue', 
              icon: '📚',
              trend: '+12%'
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-green-600 text-sm font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {stat.trend}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">from last month</span>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl bg-${stat.color}-50`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search courses by title, description, or instructor..."
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

            {/* Filter and Sort Buttons */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 outline-none transition-all duration-200 bg-white pr-10"
                >
                  <option value="all">All Courses</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 outline-none transition-all duration-200 bg-white pr-10"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">A to Z</option>
                  <option value="students">Most Students</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                onClick={refetch}
                className="px-5 py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="mt-6 text-lg font-medium text-gray-700">Loading courses...</p>
              <p className="text-gray-500 mt-2">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : (
          <>
            {paginatedCourses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {paginatedCourses.map((course) => (
                    <div 
                      onClick={()=> navigate(`/admin/courses/detail/${course.id}`)}
                      key={course.id} 
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer">
                      {/* Course Image/Header */}
                      <div className="relative">
                        <div style={{ backgroundColor: course.color }}
                            className="h-48 flex items-center justify-center">
                          <div className="text-white text-center p-6">
                            <span className="text-4xl mb-2 block">📘</span>
                            <h3 className="text-xl font-bold">{course.title}</h3>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.is_active === true 
                              ? 'bg-green-100 text-green-800' 
                              : course.is_active === false
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {course.is_active === true ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="p-6">
                        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium">Instructor:</span>
                            <span className="ml-2">{course.instructor}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Duration:</span>
                            <span className="ml-2">{course.duration}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span className="font-medium">Level:</span>
                            <span className="ml-2">{course.level}</span>
                          </div>
                        </div>

                        {/* Progress Bar (for active courses) */}
                        {course.is_active === true && (
                          <div className="mb-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Progress</span>
                              <span>65%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                                style={{ width: '65%' }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                          <div className="text-sm text-gray-500">
                            Created {formatDate(course.created_at)}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCourse(course.id, { is_active: true })}
                              className="p-2 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200 hover:shadow-md transition-all duration-200"
                              title="Edit course"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-2 rounded-xl bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 hover:shadow-md transition-all duration-200"
                              title="Delete course"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {sortedCourses.length > itemsPerPage && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-gray-700 font-medium">
                        Showing <span className="text-gray-900">{startIndex + 1}</span> to{' '}
                        <span className="text-gray-900">
                          {Math.min(startIndex + itemsPerPage, sortedCourses.length)}
                        </span>{' '}
                        of <span className="text-gray-900">{sortedCourses.length}</span> courses
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
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm ? 'No matching courses found' : 'No courses available'}
                  </h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    {searchTerm 
                      ? 'Try adjusting your search terms or clear the filters to see all courses.'
                      : 'Get started by creating your first course using the "Create New Course" button above.'
                    }
                  </p>
                  {searchTerm ? (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setFilter('all')
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      Clear All Filters
                    </button>
                  ) : (
                    <button
                      onClick={handleAddCourse}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      Create Your First Course
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Courses