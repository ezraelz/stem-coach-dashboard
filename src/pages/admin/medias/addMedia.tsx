import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../../components/ui/backButton';
import { useMedias } from '../../../hooks/useMedias';
import type { FileCreateProps} from '../../../types/mediaTypes';
import { useLessons } from '../../../hooks/useLessons';

const AddMedia: React.FC = () => {
  const { media,
    error,
    addMedias} = useMedias();
  const { lessons, fetchLessons } = useLessons();
  const [ selectedLesson, setSelectedLesson ] = useState<number>(1);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [mediaForm, setMediaForm] = useState<FileCreateProps>({
    type: '',
    lesson: 1,
    file: null,
    uploaded_at: new Date().toISOString(),
    is_active: false,
  });

   // Fetch lesson detail on component mount
  useEffect(() => {
    fetchLessons();
    }, []);

  // Handle form field changes
  const handleInputChange = (field: keyof typeof mediaForm, value: string | number | boolean) => {
    setMediaForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const item = e.target.files?.[0] || null;
    setMediaForm(prev => ({
      ...prev,
      file: item
    }));
  };

  const handleSave = async () => {
    setIsEditing(true);
    
    try {
      // Format the data for API submission
      const formData = new FormData();
      formData.append('lesson', selectedLesson.toString());
      formData.append('type', mediaForm.type);
      formData.append('uploaded_at', mediaForm.uploaded_at);
      formData.append('is_active', mediaForm.is_active.toString());
      
      if (mediaForm.file) {
        formData.append('file', mediaForm.file);
      }
      await addMedias(formData);
      navigate('/admin/medias');
    } catch (error) {
      console.error('Error updating media:', error);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (media) {
      // Use setTimeout to defer state update
      setTimeout(() => {
        setMediaForm({
            type: '',
            lesson: selectedLesson,
            file: null,
            uploaded_at: new Date().toISOString(),
            is_active: false,
        });
      }, 0);
    } else {
      setIsEditing(false);
    }
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

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error loading Media: {error.message}</p>
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
                <h2 className="text-xl font-bold text-gray-800">Upload File</h2>
                <span className="mx-3 text-sm text-gray-600">
                  Course: {lessons.find(l => l.id === selectedLesson)?.course_name || 'Unknown'}
                </span>
              </div>
              <div className="flex space-x-3">
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {isEditing ? 'Saving' : 'Save File'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
              </div>
            </div>
            <div className="p-6 overflow-auto">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="text-6xl mb-4">{getIcon(mediaForm.type)}</div>
                </div>
                <div className="flex-grow">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Details</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">File Name</div>
                              <select
                                value={selectedLesson}
                                onChange={(e) => setSelectedLesson(parseInt(e.target.value))}
                                className="block w-xl border-none rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                <option value="">Select Lesson</option>
                                {lessons.map((lesson) => (
                                  <option value={lesson.id}>{lesson.title}</option>
                                ))}
                              </select>
                          </div>
                          <div className='items-center text-center'>
                            <div className="text-sm text-gray-500">Type</div>
                                <select
                                  value={mediaForm.type}
                                  onChange={(e) => handleInputChange('type', e.target.value)}
                                  className="block w-xl border-none rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  >
                                  <option value="">Select Type</option>
                                  <option value="video">Video</option>
                                  <option value="audio">Audio</option>
                                  <option value="image">Image</option>
                                  <option value="document">Document</option>
                                </select>
                            </div>
                       
                          <div>
                            <div className="text-sm text-gray-500">Upload Date</div>
                            <div className="font-medium">{formatDate(mediaForm.uploaded_at)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Status</div>
                              <input
                                type="checkbox"
                                checked={mediaForm.is_active}
                                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                                className="block w-xl border-none rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                          </div>

                          {/* File Upload */}
                          <div className="mb-8">
                            <div>
                              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                                FILE (Optional)
                              </label>
                              <div className="mt-1 flex items-center">
                                <label className={`w-full flex flex-col items-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                  mediaForm.file ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                }`}>
                                  <div className="flex flex-col items-center">
                                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="text-sm text-gray-600">
                                      {mediaForm.file ? 
                                        mediaForm.file.name
                                      : 
                                      'Click to upload file'}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">DOCX, PDF, PNG, JPG, SVG up to 50MB</span>
                                  </div>
                                  <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".docx,.pdf,.jpeg,.svg,png"
                                    disabled={isEditing}
                                  />
                                </label>
                              </div>
                              {mediaForm.file && (
                                <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                                  <span className="truncate">{mediaForm.file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => setMediaForm(prev => ({ ...prev, file: null }))}
                                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                                    disabled={isEditing}
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t p-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedia;