import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../../hooks/useCourse';
import type { ErrorsType, LessonCreateProps } from '../../../types/lessonTypes';
import { useLessons } from '../../../hooks/useLessons';
import BackButton from '../../../components/ui/backButton';

const LessonAdd = () => {
  const navigate = useNavigate();
  const { courses, isLoading: coursesLoading, fetchCourses } = useCourses();
  const { addLesson } = useLessons();
  
  const [lessonData, setLessonData] = useState<LessonCreateProps>({
    title: '',
    content: '',
    course: 1,
    day: 0,
    is_active: false,
  });

  const [errors, setErrors] = useState<ErrorsType>({message: ''});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setLessonData(prev => ({
        ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number'
        ? parseFloat(value) || 0
        : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof ErrorsType]) {
        setErrors(prev => ({ 
        ...prev, 
        [name]: '' 
        }));
    }
  };

  const validateForm = (): ErrorsType => {
    const newErrors: ErrorsType = {};
    
    if (!lessonData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!lessonData.course) {
      newErrors.course = 'Please select a course';
    }
    
    if (!lessonData.content.trim()) {
      newErrors.content = 'Description is required';
    }

    return newErrors
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Format the data for API submission
      const formData = new FormData;
      formData.append('title', lessonData.title);
      formData.append('course', lessonData.course.toString());
      formData.append('day', lessonData.day.toString());
      formData.append('content', lessonData.content);
      formData.append('is_active', lessonData.is_active.toString());
      
      
      // Replace with your actual API endpoint
     await addLesson(formData);
      
      // Redirect to lessons list or view page
      navigate(`/admin/lessons`);
      
    } catch (err) {
      setSubmitError(err.message || 'An error occurred while creating the lesson');
      console.error('Error creating lesson:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/lessons');
  };

  if (coursesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BackButton />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Lesson</h1>
        <p className="text-gray-600 mt-2">Create a new lesson for your course</p>
      </div>

      {submitError && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Basic Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lesson Title *
              </label>
              <input
                type="text"
                name="title"
                value={lessonData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter lesson title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Course *
              </label>
              <select
                name="course_id"
                value={lessonData.course}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.course ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {errors.course && (
                <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days *
              </label>
              <input
                type="number"
                name="day"
                value={lessonData.day}
                onChange={handleChange}
                step="0.5"
                min="0.5"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.day ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 1.5"
              />
              {errors.day && (
                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>

          </div>

          {/* Content */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              name="content"
              value={lessonData.content}
              onChange={handleChange}
              rows="3"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Brief description of the lesson"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Lesson'
            )}
          </button>
        </div>
      </form>

      {/* Form Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Tips for creating effective lessons:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keep titles clear and descriptive</li>
          <li>• Provide comprehensive content with examples</li>
          <li>• Include video content when possible for better engagement</li>
          <li>• Set appropriate duration for lesson completion</li>
          <li>• Consider the lesson's position in the course sequence</li>
        </ul>
      </div>
    </div>
  );
};

export default LessonAdd;