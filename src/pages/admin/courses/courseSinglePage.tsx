import React, { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../../hooks/useCourse';
import { useLessons } from '../../../hooks/useLessons';
import type { CourseUpdateProps } from '../../../types/courseTypes';
import { useCategory } from '../../../hooks/useCategory';

interface Lesson {
  id: number;
  title: string;
  content: string;
  course: number;
  order?: number;
}

interface InstructorData {
  name: string;
  title: string;
  bio: string;
  experience: string;
  students: string;
  rating: number;
  courses: number;
}

const CourseSinglePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');
  const { course, fetchCourseDetail, updateCourse, isLoading: courseLoading } = useCourses();
  const { lessons, fetchLessons} = useLessons();
  const { categories, fetchCategories } = useCategory();
  const [ selectedCategory, setSelectedCategory ] = useState('');
   // Editable states
  const [editedCourse, setEditedCourse] = useState<CourseUpdateProps | null>(null);

  const [editedLessons, setEditedLessons] = useState<Record<number, Partial<Lesson>>>({});
  const [editedInstructor, setEditedInstructor] = useState<Partial<InstructorData>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    useEffect(() => {
      fetchCourseDetail();
      fetchLessons();
      fetchCategories();
  }, []);

  // Initialize edited course when original course load
  const initializeCourseData = useCallback((course: CourseUpdateProps)=> {
      setEditedCourse({
        title: course?.title,
        description: course?.description,
        category: selectedCategory,
        level: course?.level,
        duration: course?.duration,
        instructor: course?.instructor,
        icon: course?.icon,
        color: course?.color,
        is_active: course?.is_active
      })
  }, [selectedCategory]);
  
  // Determine which course to display
  const displayCourse = course || editedCourse;

  // Instructor data (you might want to fetch this from an API)
  const [instructorData, setInstructorData] = useState<InstructorData>({
    name: course?.instructor || 'Dr. Sarah Johnson',
    title: 'Senior Full-Stack Developer',
    bio: 'Dr. Sarah Johnson is a Senior Full-Stack Developer with over 10 years of experience in web development. She has worked with Fortune 500 companies and startups alike, specializing in React, Node.js, and cloud architecture. Sarah is passionate about teaching and has helped thousands of students advance their careers through her comprehensive courses.',
    experience: '10+',
    students: '45k+',
    rating: 4.9,
    courses: 12
  });

  // Initialize edited lessons when original lessons load
  const initializeLessonData = useCallback(() => {
    if (lessons && lessons.length > 0) {
      const lessonEdits: Record<number, Partial<Lesson>> = {};
      lessons.forEach(lesson => {
        lessonEdits[lesson.id] = {
          title: lesson.title,
          content: lesson.content
        };
      });
      setEditedLessons(lessonEdits);
    }
  }, [lessons]);

  // Handle course field changes
  const handleCourseChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (editedCourse) {
      setEditedCourse({
        ...editedCourse,
        [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number'
        ? parseFloat(value) || 0
        : value
      });
    }
  };

  // Handle lesson field changes
  const handleLessonChange = (lessonId: number, field: keyof Lesson, value: string) => {
    setEditedLessons(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        [field]: value
      }
    }));
  };

  // Start editing
  const startEditing = () => {
    if (!course) return;
    
    setIsEditing(true);
    setSaveStatus('idle');
    initializeCourseData(course)
  };

  // Save all changes
  const saveAllChanges = async () => {
    setSaveStatus('saving');
    
    try {
      // Save course changes
      if (editedCourse && JSON.stringify(editedCourse) !== JSON.stringify(course)) {
        await updateCourse(editedCourse);
      }
            
      // Update instructor data (if you have an API for this)
      if (Object.keys(editedInstructor).length > 0) {
        setInstructorData(prev => ({
          ...prev,
          ...editedInstructor
        }));
        setEditedInstructor({});
      }
      
      setSaveStatus('success');
      setIsEditing(false);
      
      // Refresh data
      await fetchCourseDetail();
      await fetchLessons();
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Error saving changes:', error);
      setSaveStatus('error');
      
      // Reset error message after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Discard changes
  const discardChanges = () => {
    if (course) {
      setEditedCourse({
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        icon: course.icon,
        instructor: course.instructor,
        duration: course.duration,
        color: course.color,
        is_active: course.is_active
      });
    }
    
    if (lessons) {
      const lessonEdits: Record<number, Partial<Lesson>> = {};
      lessons.forEach(lesson => {
        lessonEdits[lesson.id] = {
          title: lesson.title,
          content: lesson.content
        };
      });
      setEditedLessons(lessonEdits);
    }
    
    setEditedInstructor({});
    setIsEditing(false);
    setSaveStatus('idle');
  };

  
  // Filter lessons for this course
  const filteredLessons = useMemo(() => {
    if (!lessons || !course) return [];
    return lessons.filter(lesson => Number(lesson.course) === course.id);
  }, [lessons, course]);

  if (courseLoading && !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Course not found</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div 
        style={{backgroundColor: displayCourse?.color || '#4F46E5'}}
        className="bg-gradient-to-r from-blue-600 to-purple-700 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Courses
            </button>
            
            {/* Edit/Save buttons */}
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={startEditing}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  Edit Course
                </button>
              ) : (
                <>
                  {saveStatus === 'saving' && (
                    <div className="flex items-center text-white bg-white/20 px-4 py-2 rounded-lg">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  )}
                  {saveStatus === 'success' && (
                    <div className="flex items-center text-green-400 bg-white/20 px-4 py-2 rounded-lg">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Saved!
                    </div>
                  )}
                  {saveStatus === 'error' && (
                    <div className="flex items-center text-red-400 bg-white/20 px-4 py-2 rounded-lg">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Error saving
                    </div>
                  )}
                  <button
                    onClick={discardChanges}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    onClick={saveAllChanges}
                    disabled={saveStatus === 'saving'}
                    className="px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-black/20 rounded-full text-sm font-medium mb-3">
                {isEditing ? (
                  <select
                  id="category"
                  name="category"
                  value={selectedCategory}
                  onChange={(e)=> setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg transition-colors bg-transparent outline-none color-black"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                ) : (
                  course.category_name
                )}
              </span>
              
              {isEditing ? (
                <input
                  type="text"
                  name='title'
                  value={editedCourse?.title}
                  onChange={handleCourseChange}
                  className="text-3xl md:text-4xl font-bold mb-3 block bg-transparent border-b border-white/50 focus:border-white outline-none w-full text-white"
                  placeholder="Course title"
                />
              ) : (
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{displayCourse?.title.toUpperCase()}</h1>
              )}
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  {isEditing ? (
                    <input
                      type="text"
                      name='level'
                      value={editedCourse?.level}
                      onChange={handleCourseChange}
                      className="text-lg text-blue-100 bg-transparent border-b border-white/50 focus:border-white outline-none w-24"
                    />
                  ) : (
                    <span className="text-lg text-blue-100">{displayCourse?.level}</span>
                  )}
                  <svg className="w-5 h-5 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {isEditing ? (
                    <input
                      type="number"
                      name='duration'
                      value={editedCourse?.duration}
                      onChange={handleCourseChange}
                      className="w-16 text-white bg-transparent border-b border-white/50 focus:border-white outline-none"
                    />
                  ) : (
                    <span className="text-white">{displayCourse?.duration}</span>
                  )}
                  <span className="ml-1 text-white">hrs</span>
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
                  {isEditing ? (
                    <textarea
                      value={editedCourse?.description || ''}
                      onChange={(e) => handleCourseChange('description', e.target.value)}
                      className="w-full text-gray-700 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      rows={4}
                      placeholder="Enter course description..."
                    />
                  ) : (
                    <p className="text-gray-700">{displayCourse?.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {filteredLessons.length}
                      </div>
                      <div className="text-sm text-gray-600">Lessons</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {displayCourse?.duration}
                      </div>
                      <div className="text-sm text-gray-600">Hours</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {displayCourse?.level}
                      </div>
                      <div className="text-sm text-gray-600">Level</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {displayCourse?.is_active ? 'Active' : 'Inactive'}
                      </div>
                      <div className="text-sm text-gray-600">Status</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      + Add Lesson
                    </button>
                  </div>
                  
                  {/* Lessons List */}
                  <div className="divide-y divide-gray-200">
                    {filteredLessons.map((lesson, index) => (
                      <div key={lesson.id} className="p-6">
                        <div className="mb-2">
                          <span className="text-sm text-gray-500">Lesson {index + 1}</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedLessons[lesson.id]?.title || lesson.title}
                            onChange={(e) => handleLessonChange(lesson.id, 'title', e.target.value)}
                            className="font-semibold text-gray-900 w-full border-b border-gray-300 focus:border-blue-500 outline-none pb-1"
                          />
                        ) : (
                          <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                        )}
                        
                        {isEditing ? (
                          <textarea
                            value={editedLessons[lesson.id]?.content || lesson.content}
                            onChange={(e) => handleLessonChange(lesson.id, 'content', e.target.value)}
                            className="text-gray-600 text-sm mt-2 w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            rows={3}
                          />
                        ) : (
                          <p className="text-gray-600 text-sm mt-2">{lesson.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-1">
                    {isEditing ? 
                      <input
                        type="text"
                        name='instructor'
                        value={editedCourse?.instructor}
                        onChange={handleCourseChange}
                        className="text-lg text-blue-100 bg-transparent border-b border-white/50 focus:border-white outline-none w-24"
                      />
                    :
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{instructorData.name || course.instructor}</h2>
                    }
                    <p className="text-gray-600 mb-4">{instructorData.title}</p>
                    <p className="text-gray-700">{instructorData.bio}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{instructorData.experience}</div>
                        <div className="text-sm text-gray-600">Experience</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{instructorData.students}</div>
                        <div className="text-sm text-gray-600">Students</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{instructorData.rating}</div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{instructorData.courses}</div>
                        <div className="text-sm text-gray-600">Courses</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Review List */}
                <div className="space-y-4">
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
                                <span className="text-gray-500 text-sm">{review.date}</span>
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
                  <div 
                     style={{backgroundColor: `${displayCourse?.color}`}}
                     className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl font-bold">
                        {displayCourse?.title?.toUpperCase()}
                      </div>
                      <div className="text-lg">{displayCourse?.level}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Course Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Category</span>
                        <span className="font-medium">{course.category_name || course.category}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Level</span>
                        <span className="font-medium">{course.level}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">{course.duration} hrs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Language</span>
                        <span className="font-medium">English</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Certificate</span>
                        <span className="font-medium text-green-600">Included</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium">{course.is_active ? 'Active' : 'Inactive'}</span>
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
                  {filteredLessons.slice(0, 5).map((lesson) => (
                    <div key={lesson.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                        {(editedLessons[lesson.id]?.title || lesson.title).charAt(0).toUpperCase()}
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedLessons[lesson.id]?.title || lesson.title}
                          onChange={(e) => handleLessonChange(lesson.id, 'title', e.target.value)}
                          className="text-gray-700 flex-1 border-b border-gray-300 focus:border-blue-500 outline-none"
                        />
                      ) : (
                        <span className="text-gray-700">{editedLessons[lesson.id]?.title || lesson.title}</span>
                      )}
                    </div>
                  ))}
                </div>
                {filteredLessons.length > 5 && (
                  <button className="w-full mt-4 py-2.5 text-blue-600 font-medium hover:text-blue-800 transition-colors">
                    View Full Syllabus →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .editable-field {
          cursor: pointer;
          border: 1px solid transparent;
          padding: 2px 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .editable-field:hover {
          border-color: #93c5fd;
          background-color: #eff6ff;
        }
        
        .editable-field.editing {
          border-color: #3b82f6;
          background-color: white;
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .editable-field[contenteditable="true"] {
          cursor: text;
        }
        
        .editable-field[contenteditable="true"]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default CourseSinglePage;