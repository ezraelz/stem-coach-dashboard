import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLessons } from '../../../hooks/useLessons';

const LessonDetail = () => {
  const { lesson, setLesson,error, isLoading, fetchLessonDetail, updateLesson, deleteLesson } = useLessons();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    day: 0,
    duration: 0,
    content: '',
    is_active: false,
  });

   // Fetch lesson detail on component mount
  useEffect(() => {
    fetchLessonDetail();
  }, []);

  // Memoize the initialization function to avoid unnecessary recreations
  const initializeLessonData = useCallback((lesson: any) => {
    setEditForm({
      title: lesson.title || '',
      day: lesson.day || 0, // Fixed: use description field
      duration: lesson.duration || 0,
      content: lesson.content || '',
      is_active: lesson.is_active || false,
    });
  }, []);

  const handleEdit = () => {
    if (!lesson) return;

    initializeLessonData(lesson);
    setIsEditing(true);
    };


  const handleSave = async () => {
    if (!lesson) return;
    
    try {
      await updateLesson(lesson.id, editForm);
      setIsEditing(false);
      // Optionally show a success message or refresh data
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleCancel = () => {
    if (lesson) {
      // Use setTimeout to defer state update
      setTimeout(() => {
        setEditForm({
          title: lesson.title || '',
          day: lesson.day || 0,
          duration: lesson.duration || 0,
          content: lesson.content || '',
          is_active: lesson.is_active || false,
        });
        setIsEditing(false);
      }, 0);
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!lesson) return;
    
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteLesson(lesson.id);
        navigate('/admin/lessons');
      } catch (error) {
        console.error('Error deleting lesson:', error);
      }
    }
  };

  const handleStatusToggle = async () => {
    if (!lesson) return;
    
    const newStatus = !editForm.is_active;
    
    // Update local state optimistically
    setEditForm(prev => ({ ...prev, is_active: newStatus }));
    
    try {
      await updateLesson(lesson.id, { is_active: newStatus });
      setLesson(prev => prev ? { ...prev, is_active: newStatus } : null);
    } catch (error) {
      console.error('Error updating lesson status:', error);
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
        <p>Error loading lesson: {error.message}</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Lesson not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? (
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-3xl font-bold border border-gray-300 rounded-md px-3 py-2 w-full max-w-2xl"
              />
            ) : (
              lesson.title
            )}
          </h1>
          <div className="mt-2 flex items-center space-x-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              lesson.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {lesson.is_active ? 'Published' : 'Draft'}
            </span>
            <span className="text-sm text-gray-600">
              Course: {lesson.course_name}
            </span>
            <span className="text-sm text-gray-600">
              Duration: {lesson.duration} hr
            </span>
            <span className="text-sm text-gray-600">
              Day: {lesson.day}
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
                Edit Lesson
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Lesson
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
            
            {isEditing ? (
              <div className="space-y-4">    
                <div>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                
                {lesson.content && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Content</h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{lesson.content}</p>
                    </div>
                  </div>
                )}
                
                {(!lesson.content) && (
                  <div className="text-center py-8 text-gray-500">
                    No content available for this lesson.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Lesson Status</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1 p-2">
                    Day 
                  </label>
                  <input
                    type="number"
                    value={editForm.day}
                    onChange={(e) => handleInputChange('day', parseFloat(e.target.value) || 0)}
                    step="0.5"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    value={editForm.duration}
                    onChange={(e) => handleInputChange('duration', parseFloat(e.target.value) || 0)}
                    step="0.5"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                </>
              ) : (
                <>
                {lesson.day && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Day</span>
                    <span className="text-gray-700">{lesson.day}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-medium">{lesson.duration} hour(s)</span>
                </div>
                </>
              )}
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Course</span>
                <span className="text-sm font-medium">{lesson.course_name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Instructor</span>
                <span className="text-sm font-medium">Coach</span>
              </div>
              
              {lesson.created_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(lesson.created_at).toLocaleDateString()}
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
                onClick={() => navigate('/admin/lessons')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-left"
              >
                ← Back to Lessons
              </button>
              <button
                onClick={() => navigate(`/admin/lessons/${lesson.id}/edit`)}
                className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-left"
              >
                Edit in Full Screen
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

export default LessonDetail;