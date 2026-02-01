import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../../hooks/useCourse';
import { useLessons } from '../../../hooks/useLessons';

// Mock data - replace with your actual data fetching
const mockCourseData = {
  id: 'course-001',
  title: 'Advanced Web Development',
  subtitle: 'Master React, Node.js, and Modern JavaScript',
  instructor: 'Dr. Sarah Johnson',
  instructorTitle: 'Senior Full-Stack Developer',
  instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  category: 'Web Development',
  level: 'Intermediate',
  duration: '8 weeks',
  studentsCount: 1245,
  rating: 4.8,
  reviewsCount: 342,
  price: '$299.99',
  discountedPrice: '$199.99',
  isDiscounted: true,
  description: 'This comprehensive course takes you from intermediate to advanced web development skills. Learn to build modern web applications with React, Node.js, and Express while implementing best practices for scalability and performance.',
  modules: [
    {
      id: 'module-1',
      title: 'React Fundamentals',
      duration: '2 weeks',
      lessons: 12,
      completed: true,
      topics: ['Components & Props', 'State & Lifecycle', 'Hooks', 'Context API']
    },
    {
      id: 'module-2',
      title: 'Advanced React Patterns',
      duration: '2 weeks',
      lessons: 10,
      completed: true,
      topics: ['Higher-Order Components', 'Render Props', 'Custom Hooks', 'Performance Optimization']
    },
    {
      id: 'module-3',
      title: 'Node.js Backend Development',
      duration: '2 weeks',
      lessons: 14,
      completed: false,
      topics: ['Express.js', 'REST APIs', 'Authentication', 'Database Integration']
    },
    {
      id: 'module-4',
      title: 'Full Stack Project',
      duration: '2 weeks',
      lessons: 8,
      completed: false,
      topics: ['Project Setup', 'Deployment', 'Testing', 'Code Review']
    }
  ],
  syllabus: [
    { week: 1, topic: 'Introduction to Modern JavaScript & ES6+' },
    { week: 2, topic: 'React Component Architecture' },
    { week: 3, topic: 'State Management & Data Flow' },
    { week: 4, topic: 'Routing & Navigation' },
    { week: 5, topic: 'Server-Side Development with Node.js' },
    { week: 6, topic: 'Database Integration & ORM' },
    { week: 7, topic: 'Authentication & Authorization' },
    { week: 8, topic: 'Deployment & DevOps' }
  ]
};

const CourseSinglePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');
  const { course, fetchCourseDetail } = useCourses();
  const { lessons, fetchLessons } = useLessons();

  useEffect(() => {
    fetchCourseDetail();
    fetchLessons();
  },[]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };


  const filteredLessons = useMemo(() => {
    if (!course) return lessons;

    return lessons.filter(
      lesson => Number(lesson.course) === course.id
    );
  }, [lessons, course]);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div 
        style={{backgroundColor: course?.color}}
        className={`bg-gradient-to-r from-blue-600 to-purple-700 text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Courses
          </button>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3">
                {course?.category ?  course.category_name : mockCourseData.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course?.title ? course.title : mockCourseData.title}</h1>
              <div className="flex flex-wrap items-center gap-4">
                
                <div className="flex items-center">
              <p className="text-lg text-blue-100 mb-4">{course?.level ? course.level : mockCourseData.subtitle}</p>

                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course?.duration ? course.duration : mockCourseData.duration}hrs</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'curriculum', label: 'Curriculum' },
              { id: 'instructor', label: 'Instructor' },
              { id: 'reviews', label: 'Reviews' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Course Description */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Description</h2>
                  <p className="text-gray-700 mb-6">{course?.description ? course.description : mockCourseData.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {filteredLessons.length}
                      </div>
                      <div className="text-sm text-gray-600">Lessons</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{course?.duration ? course.duration : mockCourseData.duration}</div>
                      <div className="text-sm text-gray-600">Duration</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{course?.level ? course.level : mockCourseData.level}</div>
                      <div className="text-sm text-gray-600">Level</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                    <p className="text-gray-600 mt-1">
                      {mockCourseData.modules.reduce((acc, module) => acc + module.lessons, 0)} lessons • {mockCourseData.duration}
                    </p>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {mockCourseData.modules.map((module, index) => (
                      <div key={module.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-500 mr-3">Module {index + 1}</span>
                              {module.completed && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                  Completed
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mt-1">{module.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{module.lessons} lessons • {module.duration}</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={module.completed ? "M5 13l4 4L19 7" : "M9 5l7 7-7 7"} />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Topics Covered:</h4>
                          <div className="flex flex-wrap gap-2">
                            {module.topics.map((topic) => (
                              <span
                                key={topic}
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <img
                    src={mockCourseData.instructorAvatar}
                    alt={mockCourseData.instructor}
                    className="w-24 h-24 rounded-full"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{mockCourseData.instructor}</h2>
                    <p className="text-gray-600 mt-1">{mockCourseData.instructorTitle}</p>
                    <div className="flex items-center mt-3">
                      {renderStars(4.9)}
                      <span className="mx-4 text-gray-300">•</span>
                      <span className="text-gray-700">
                        <span className="font-semibold">45,892</span> students
                      </span>
                      <span className="mx-4 text-gray-300">•</span>
                      <span className="text-gray-700">
                        <span className="font-semibold">12</span> courses
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">About the Instructor</h3>
                  <p className="text-gray-700">
                    Dr. Sarah Johnson is a Senior Full-Stack Developer with over 10 years of experience in web development. 
                    She has worked with Fortune 500 companies and startups alike, specializing in React, Node.js, and cloud 
                    architecture. Sarah is passionate about teaching and has helped thousands of students advance their 
                    careers through her comprehensive courses.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">10+</div>
                      <div className="text-sm text-gray-600">Years Experience</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">45k+</div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">4.9</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-gray-600">Courses</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Overall Rating */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
                  
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900">{mockCourseData.rating}</div>
                      {renderStars(mockCourseData.rating)}
                      <p className="text-gray-600 mt-2">{mockCourseData.reviewsCount} reviews</p>
                    </div>
                    
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-600 w-8">{stars}★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mx-3">
                            <div 
                              className="h-full bg-yellow-400"
                              style={{ width: `${(stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1)}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12">
                            {stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '7%' : stars === 2 ? '2%' : '1%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-4">
                  {/* Sample Reviews */}
                  {[
                    { name: 'Alex Johnson', rating: 5, date: '2 weeks ago', comment: 'Excellent course! The content is well-structured and the instructor explains complex concepts in an easy-to-understand way.' },
                    { name: 'Maria Garcia', rating: 5, date: '1 month ago', comment: 'This course transformed my career. The projects are real-world applicable and the support from the community is amazing.' },
                    { name: 'David Chen', rating: 4, date: '2 months ago', comment: 'Great content overall. Would love to see more advanced topics in future updates.' }
                  ].map((review, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.name}</h4>
                              <div className="flex items-center">
                                {renderStars(review.rating)}
                                <span className="text-gray-500 text-sm ml-3">{review.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Course Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl font-bold">{course?.title.toUpperCase()}</div>
                      <div className="text-lg">{course?.level}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Course Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Category</span>
                        <span className="font-medium">{course?.category_name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Level</span>
                        <span className="font-medium">{course?.level}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">{course?.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Language</span>
                        <span className="font-medium">English</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Certificate</span>
                        <span className="font-medium text-green-600">Included</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-bold text-gray-900 text-lg mb-3">Share This Course</h3>
                    <div className="flex space-x-3">
                      <button className="flex-1 py-2 px-4 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                        Share
                      </button>
                      <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Syllabus Preview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Course Syllabus</h3>
                <div className="space-y-3">
                  {filteredLessons.map((item) => (
                    <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                        {item.title}
                      </div>
                      <span className="text-gray-700">{item.content}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2.5 text-blue-600 font-medium hover:text-blue-800 transition-colors">
                  View Full Syllabus →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CourseSinglePage;