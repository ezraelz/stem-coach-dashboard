import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../../components/ui/backButton';
import { useMedias } from '../../../hooks/useMedias';
import type { FileProps } from '../../../types/mediaTypes';
import { useLessons } from '../../../hooks/useLessons';

const MediaDetail: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const { media,
    isLoading,
    error,
    fetchMediaDetail,
    updateMedia,
    deleteMedia } = useMedias();
  const { lessons, fetchLessons } = useLessons();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    type: '',
    lesson: 1,
    course: '', // course as string
    is_active: false,
  });

   // Fetch lesson detail on component mount
  useEffect(() => {
    if(id){
      fetchMediaDetail();
      fetchLessons();
    }
  }, [id]);

  // Memoize the initialization function to avoid unnecessary recreations
  const initializeMediaData = useCallback((media: FileProps) => {
    setEditForm({
      type: media.type || '',
      course: String(media.course_name), // ensure course is string
      lesson: media.lesson.id || 0,
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
      await updateMedia({ ...editForm, course: String(editForm.course) });
      setIsEditing(false);
      // Optionally, refetch media details to ensure UI is up-to-date
      fetchMediaDetail();
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
            course: media.course_name,
            lesson: media.lesson.id || 0,
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

  // Handle form field changes
  const handleInputChange = (field: keyof typeof editForm, value: string | number | boolean) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  // Utitlity functions for display
  const icons: Record<string, string> = {
    video: '🎬',
    audio: '🎵',
    image: '🖼️',
    document: '📄'
  }

  const getIcon = (fileType: string): string => {
    return icons[fileType] || '📁';
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getFileTypeLabel = (fileType: string): string => {
    const labels: Record<string, string> = {
      video: 'Video',
      audio: 'Audio',
      image: 'Image',
      document: 'Document'
    };
    return labels[fileType] || fileType.charAt(0).toUpperCase() + fileType.slice(1);
  };

  const handleDownload = (file: FileProps) => {
    if (file.url) {
      window.open(file.url, '_blank');
    } else {
      alert(`Download URL not available for: ${file.lesson_name}`);
    }
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
      {/* Lesson Details */}
      <div className="grid grid-cols-1 lg:grid-cols-1">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-1">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <div className="block justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">Preview: {media.lesson_name}</h2>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  media.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {media.is_active ? 'Published' : 'Draft'}
                </span>
                <span className="mx-3 text-sm text-gray-600">
                  Course: {media.course_name}
                </span>
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
            <div className="p-6 overflow-auto">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="text-6xl mb-4">{getIcon(media.type)}</div>
                </div>
                <div className="flex-grow">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Details</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">File Name</div>
                             {isEditing ? 
                                <select
                                  value={editForm.lesson}
                                  onChange={(e) => handleInputChange('lesson', e.target.value)}
                                  className="block w-xl border-none rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  >
                                  <option value="">Select Lesson</option>
                                  {lessons.map((lesson) => (
                                   <option value={lesson.id}>{lesson.title}</option>
                                  ))}
                                </select>
                              : 
                                <div className="font-medium">{media.lesson_name}</div>
                              }
                            
                          </div>
                          <div className='items-center text-center'>
                            <div className="text-sm text-gray-500">Type</div>
                              {isEditing ? 
                                <select
                                  value={editForm.type}
                                  onChange={(e) => handleInputChange('type', e.target.value)}
                                  className="block w-xl border-none rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  >
                                  <option value="">Select Type</option>
                                  <option value="video">Video</option>
                                  <option value="audio">Audio</option>
                                  <option value="image">Image</option>
                                  <option value="document">Document</option>
                                </select>
                              : 
                              <div className="font-medium">{getFileTypeLabel(media.type)}</div>
                              }
                            </div>
                       
                          <div>
                            <div className="text-sm text-gray-500">Upload Date</div>
                            <div className="font-medium">{formatDate(media.uploaded_at)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Status</div>
                            {isEditing ? 
                                <input
                                  type="checkbox"
                                  checked={editForm.is_active}
                                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                                  className="block w-xl border-none rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              : 
                              <div className={`font-medium ${media.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                {media.is_active ? 'Active' : 'Inactive'}
                              </div>
                              }
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {media.lesson.content && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-1">Description</h3>
                        <p className="text-gray-600">{media.lesson.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t p-6 flex justify-end gap-3">
              <button
                onClick={() => window.open(media.download_url, '_blank')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetail;