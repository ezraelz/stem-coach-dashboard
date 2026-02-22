import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../../hooks/useCourse';
import BackButton from '../../../components/ui/backButton';
import { useMedias } from '../../../hooks/useMedias';

const MediaDetail = () => {
  const { media,
    isLoading,
    error,
    setMedia,
    fetchMediaDetail,
    updateMedia,
    deleteMedia } = useMedias();
  const { courses, fetchCourses } = useCourses();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    type: '',
    lesson: 1,
    course: 1,
    is_active: false,
  });

   // Fetch lesson detail on component mount
  useEffect(() => {
    fetchMediaDetail();
    fetchCourses();
  }, []);

  // Memoize the initialization function to avoid unnecessary recreations
  const initializeMediaData = useCallback((media: any) => {
    setEditForm({
      type: media.type || '',
      course: media.course,
      lesson: media.lesson || 0,
      is_active: media.is_active || false,
    });
  }, []);

  const handleEdit = () => {
    if (!media) return;

    initializeMediaData(media);
    setIsEditing(true);
    };


  const handleSave = async () => {
    if (!media) return;
    
    try {
      await updateMedia(media, editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  const handleCancel = () => {
    if (media) {
      // Use setTimeout to defer state update
      setTimeout(() => {
        setEditForm({
            type: media.type || '',
            course: media.course,
            lesson: media.lesson || 0,
            is_active: media.is_active || false,
        });
        setIsEditing(false);
      }, 0);
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!media) return;
    
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteMedia(media.id);
        navigate('/admin/lessons');
      } catch (error) {
        console.error('Error deleting lesson:', error);
      }
    }
  };

  const handleStatusToggle = async () => {
    if (!media) return;
    
    const newStatus = !editForm.is_active;
    
    // Update local state optimistically
    setEditForm(prev => ({ ...prev, is_active: newStatus }));
    
    try {
      await updateMedia(media.id, { is_active: newStatus });
      setMedia(prev => prev ? { ...prev, is_active: newStatus } : null);
    } catch (error) {
      console.error('Error updating media status:', error);
      // Revert on error
      setEditForm(prev => ({ ...prev, is_active: !newStatus }));
    }
  };

  // Handle form field changes
  const handleInputChange = (field: keyof typeof editForm, value: string | number | boolean) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error loading Media: {error.message}</p>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>File not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-1">
      {/* Header */}
      <BackButton />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? (
              <input
                type="text"
                value={editForm.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="text-3xl font-bold border border-gray-300 rounded-md px-3 py-2 w-full max-w-2xl"
              />
            ) : (
              media.type
            )}
          </h1>
          <div className="mt-2 flex items-center space-x-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              media.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {media.is_active ? 'Published' : 'Draft'}
            </span>
            <span className="text-sm text-gray-600">
              Course: {media.course_name}
            </span>
            <span className="text-sm text-gray-600">
              Uploaded At: {media.uploaded_at}
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          {!isEditing ? (
            <>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Edit File
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete File
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lesson Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
            <h2 className="text-xl font-semibold mb-4">Lesson Files</h2>
            <div className="space-y-6">
              {media.file ? (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a 
                        href={`/lesson_files/${media.file}`} // Assuming you have a file download endpoint
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium truncate block"
                        download={media.file.split('/').pop()} // Adds download attribute with filename
                      >
                        {media.file.split('/').pop()} {/* Shows just filename, not full path */}
                      </a>
                      <p className="text-sm text-gray-500 mt-1">
                        Click to download
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2">No files available for this lesson.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Media Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Publication Status</span>
                <button
                  onClick={handleStatusToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    editForm.is_active ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    editForm.is_active ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {editForm.is_active 
                    ? 'This lesson is visible to students.'
                    : 'This lesson is in draft mode and not visible to students.'}
                </p>
              </div>
            </div>
          </div>

          {/* Lesson Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Lesson Information</h3>
            <div className="space-y-3">
              {isEditing ? (
                <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Course *
                  </label>
                  <select
                    name="course"
                    value={editForm.course}
                    onChange={(e)=> handleInputChange('course', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 p-2">
                    Type 
                  </label>
                  <input
                    type="text"
                    value={editForm.type}
                    onChange={(e) => handleInputChange('type', parseFloat(e.target.value) || 0)}
                    step="0.5"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                </>
              ) : (
                <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-sm font-medium">{media.type}</span>
                </div>
                </>
              )}
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Course</span>
                <span className="text-sm font-medium">{media.course_name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Instructor</span>
                <span className="text-sm font-medium">Coach</span>
              </div>
              
              {media.created_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(media.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/medias')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-left"
              >
                ← Back to Files
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors text-left"
              >
                Delete Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetail;