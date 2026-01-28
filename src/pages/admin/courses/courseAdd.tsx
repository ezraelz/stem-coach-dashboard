import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useCourses } from '../../../hooks/useCourse';
import type { CourseCreateProps, ErrorsType } from '../../../types/courseTypes';
import { useNavigate } from 'react-router-dom';
import { useCategory } from '../../../hooks/useCategory';

const CourseAdd = () => {
  const { addCourse } = useCourses();
  const { categories, fetchCategories } = useCategory();
  const [courseData, setCourseData] = useState<CourseCreateProps>({
    title: '',
    description: '',
    is_active: false,
    icon: null,
    color: '#F1B33E',
    instructor: '',
    duration: 0,
    level: '',
    category: '',
  });

  const [errors, setErrors] = useState<ErrorsType>({ message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [])

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setCourseData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number'
        ? parseFloat(value) || 0
        : value
    }));
    
    if (errors[name as keyof ErrorsType]) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: '' 
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCourseData(prev => ({
      ...prev,
      icon: file
    }));
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCourseData(prev => ({
      ...prev,
      color: e.target.value
    }));
  };

  const validateForm = (): ErrorsType => {
    const newErrors: ErrorsType = {};

    if (!courseData.title.trim()) {
      newErrors.title = 'Course name is required';
    } else if (courseData.title.length < 3) {
      newErrors.title = 'Course name must be at least 3 characters';
    }

    if (!courseData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (courseData.description.length < 2) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (courseData.duration < 0) {
      newErrors.duration = 'Duration cannot be negative';
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({ message: '' });

    const formData = new FormData();
      
      // Append all fields to FormData
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('is_active', courseData.is_active.toString());
      formData.append('color', courseData.color);
      formData.append('instructor', courseData.instructor);
      formData.append('duration', courseData.duration.toString());
      formData.append('level', courseData.level);
      formData.append('category', courseData.category);
      
      // Append file if exists
      if (courseData.icon && courseData.icon instanceof File) {
        formData.append('icon', courseData.icon);
      }
    
    try {
      await addCourse(formData);
      setSuccessMessage('Course added successfully!');
      
      setTimeout(() => {
        navigate('/admin/courses');
      }, 1000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setErrors({ 
        message: error.response?.data?.message || 'Failed to add course. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCourseData({
      title: '',
      description: '',
      is_active: false,
      icon: null,
      color: '#F1B33E',
      instructor: '',
      duration: 0,
      level: '',
      category: '',
    });
    setErrors({ message: '' });
    setSuccessMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Course</h1>
        <p className="text-gray-600 mt-1 md:mt-2">Fill in the details below to create a new course</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.message && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800">{errors.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-4 md:p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Course Name */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Course Name *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Introduction to Computer Science"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Level */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                id="level"
                name="level"
                value={courseData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                disabled={isSubmitting}
              >
                <option value="">Select Level</option>
                {levels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Instructor */}
            <div>
              <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
                Instructor
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={courseData.instructor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Dr. John Smith"
                disabled={isSubmitting}
              />
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (hours)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={courseData.duration || ''}
                onChange={handleChange}
                step="0.5"
                min="0"
                max="1000"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="e.g., 12.5"
                disabled={isSubmitting}
              />
              {errors.duration && (
                <p className="mt-1 text-xs text-red-600">{errors.duration}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={courseData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Picker */}
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                Course Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="color"
                  value={courseData.color}
                  onChange={handleColorChange}
                  className="w-10 h-10 cursor-pointer rounded border border-gray-300"
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  value={courseData.color}
                  onChange={handleColorChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
                  placeholder="#F1B33E"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Course Icon</h2>
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
              Icon (Optional)
            </label>
            <div className="mt-1 flex items-center">
              <label className={`w-full flex flex-col items-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                courseData.icon ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}>
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {courseData.icon ? courseData.icon.name : 'Click to upload icon'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 2MB</span>
                </div>
                <input
                  type="file"
                  id="icon"
                  name="icon"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.svg"
                  disabled={isSubmitting}
                />
              </label>
            </div>
            {courseData.icon && (
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span className="truncate">{courseData.icon.name}</span>
                <button
                  type="button"
                  onClick={() => setCourseData(prev => ({ ...prev, icon: null }))}
                  className="text-red-600 hover:text-red-800 text-xs font-medium"
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Description</h2>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Course Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={courseData.description}
              onChange={handleChange}
              rows={5}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Describe the course content, learning objectives, prerequisites, and any other relevant information..."
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
            <div className="mt-1 text-xs text-gray-500 text-right">
              {courseData.description.length} characters
            </div>
          </div>
        </div>

        {/* Active Status */}
        <div className="mb-8">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={courseData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
              <span className="font-medium">Publish course immediately</span>
              <p className="text-gray-500 text-xs mt-0.5">Course will be visible to students if checked</p>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding Course...
              </>
            ) : (
              'Add Course'
            )}
          </button>
        </div>
      </form>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-medium text-blue-900">Tips for creating a great course</h3>
            <ul className="mt-2 text-sm text-blue-800 space-y-1.5">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use a clear and descriptive course title</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Provide detailed description including learning outcomes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Choose an appropriate color for course branding</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Upload a high-quality icon that represents the course</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAdd;