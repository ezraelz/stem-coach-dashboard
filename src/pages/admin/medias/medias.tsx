import React, { useEffect, useState, useMemo } from 'react'
import { useMedias } from '../../../hooks/useMedias';
import type { FileProps } from '../../../types/mediaTypes';
import { useCourses } from '../../../hooks/useCourse';

// More robust type definition
type FileType = 'video' | 'audio' | 'image' | 'document' | string;

interface TabItem {
  id: string;
  label: string;
}

const Medias = () => {
  const { medias, fetchMedias, deleteMedia, refetch } = useMedias();
  const { courses, fetchCourses } = useCourses();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFile, setSelectedFile] = useState<FileProps | null>(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const tabs: TabItem[] = [
    { id: 'all', label: 'All' },
    { id: 'recent', label: 'Recent' },
    { id: 'video', label: 'Videos' },
    { id: 'audio', label: 'Audio' },
    { id: 'image', label: 'Images' },
    { id: 'document', label: 'Documents' }
  ];

  const icons: Record<string, string> = {
    video: '🎬',
    audio: '🎵',
    image: '🖼️',
    document: '📄'
  }

  useEffect(() => {
    fetchMedias();
    fetchCourses();
  }, []);

  // Filter and sort medias
  const filteredMedias = useMemo(() => {
    let filtered = medias || [];

    // Filter by course
    if (selectedCourse && selectedCourse !== 'all') {
      filtered = filtered.filter(media => 
        media?.lesson?.course_name
          ?.toLowerCase()
          .includes(selectedCourse.toLowerCase())
      );
    }

    // Filter by active tab
    if (activeTab !== 'all') {
      if (activeTab === 'recent') {
        // Show files from last 7 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(media => 
          new Date(media.uploaded_at) > oneWeekAgo
        );
      } else {
        filtered = filtered.filter(media => 
          media.type === activeTab
        );
      }
    }

    // Sort medias
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
        case 'oldest':
          return new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime();
        case 'name':
          return a.lesson_name.localeCompare(b.lesson_name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [medias, selectedCourse, activeTab, sortBy]);

  const handleView = (file: FileProps) => {
    setSelectedFile(file);
    // Consider using a modal library like react-modal or a custom modal component
  };

  const handleDownload = (file: FileProps) => {
    if (file.url) {
      window.open(file.url, '_blank');
    } else {
      alert(`Download URL not available for: ${file.lesson_name}`);
    }
  };

  const handleDelete = async (file: FileProps) => {
    if (!window.confirm(`Are you sure you want to delete "${file.lesson_name}"?`)) {
      return;
    }

    setIsDeleting(file.id);
    try {
      await deleteMedia(file.id);
      // Optionally show success message
      alert(`Successfully deleted: ${file.lesson_name}`);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete file. Please try again.');
    } finally {
      setIsDeleting(null);
    }
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

  const getIcon = (fileType: string): string => {
    return icons[fileType] || '📁';
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Media Files</h1>
          <p className="text-gray-600 mt-1">
            Total: {filteredMedias.length} file{filteredMedias.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="appearance-none px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white pr-10 w-48"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id || course.title} value={course.title}>
                  {course.title}
                </option>
              ))}
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
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white pr-10"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          <button
            onClick={refetch}
            disabled={isDeleting !== null}
            className="px-5 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Media Table */}
      {filteredMedias.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No media files found</h3>
          <p className="text-gray-500 mb-6">
            {selectedCourse !== 'all' 
              ? `No files found for the selected course filter.`
              : `No files match your current filters. Try adjusting your search criteria.`}
          </p>
          <button 
            onClick={() => {
              setSelectedCourse('all');
              setActiveTab('all');
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b font-semibold text-gray-700 bg-gray-50">
            <div className="col-span-4">Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Date Uploaded</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
          
          {filteredMedias.map((file) => (
            <div 
              key={file.id} 
              className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center transition-colors"
            >
              <div className="col-span-4 flex items-center space-x-3">
                <span className="text-2xl">{getIcon(file.type)}</span>
                <div className="truncate">
                  <div className="font-medium truncate">{file.lesson_name}</div>
                  {file.lesson.title && (
                    <div className="text-sm text-gray-500 truncate">{file.lesson.content}</div>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <span className="capitalize px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {getFileTypeLabel(file.type)}
                </span>
              </div>
              <div className="col-span-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  file.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {file.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="col-span-2 text-gray-600">{formatDate(file.uploaded_at)}</div>
              <div className="col-span-2 flex items-center justify-center space-x-2">
                <button 
                  onClick={() => handleView(file)}
                  className="text-blue-600 hover:text-blue-800 font-medium p-2 rounded hover:bg-blue-50 transition-colors"
                  title="View File"
                >
                  👁️
                </button>
                <button 
                  onClick={() => handleDownload(file)}
                  className="text-green-600 hover:text-green-800 font-medium p-2 rounded hover:bg-green-50 transition-colors"
                  title="Download File"
                  disabled={!file.url}
                >
                  ⬇️
                </button>
                <button 
                  onClick={() => handleDelete(file)}
                  disabled={Number(isDeleting) === file.id}
                  className="text-red-600 hover:text-red-800 font-medium p-2 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete File"
                >
                  {Number(isDeleting) === file.id ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview/Modal Section */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Preview: {selectedFile.lesson_name}</h2>
              <button 
                onClick={() => setSelectedFile(null)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-auto">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="text-6xl mb-4">{getIcon(selectedFile.type)}</div>
                </div>
                <div className="flex-grow">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Details</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">File Name</div>
                            <div className="font-medium">{selectedFile.lesson_name}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Type</div>
                            <div className="font-medium">{getFileTypeLabel(selectedFile.type)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Upload Date</div>
                            <div className="font-medium">{formatDate(selectedFile.uploaded_at)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Status</div>
                            <div className={`font-medium ${selectedFile.is_active ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedFile.is_active ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedFile.lesson.content && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-1">Description</h3>
                        <p className="text-gray-600">{selectedFile.lesson.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t p-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedFile)}
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
      )}
    </div>
  );
};

export default Medias;