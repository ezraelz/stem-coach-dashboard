import React, { useState } from 'react'

type FileType = 'video' | 'audio' | 'image' | 'document';

interface FileItem {
  name: string;
  type: FileType;
  size: string;
  date: string;
}

const Medias = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  
  const tabs = ['All', 'Recent', 'Videos', 'Audio', 'Images']
  const files: FileItem[] = [
    { name: 'video-production.mp4', type: 'video', size: '2.4 GB', date: '2024-01-15' },
    { name: 'podcast-episode.mp3', type: 'audio', size: '45 MB', date: '2024-01-14' },
    { name: 'product-shot.jpg', type: 'image', size: '3.2 MB', date: '2024-01-13' },
    { name: 'presentation.pdf', type: 'document', size: '12 MB', date: '2024-01-12' },
  ]

  const icons: Record<FileType, string> = {
    video: '🎬',
    audio: '🎵',
    image: '🖼️',
    document: '📄'
  }

  const handleView = (file: FileItem) => {
    setSelectedFile(file)
    // In a real app, you might open a modal or navigate to a viewer page
    console.log('Viewing file:', file)
  }

  const handleDownload = (file: FileItem) => {
    alert(`Downloading: ${file.name}`)
    // In a real app: window.open(file.url, '_blank')
  }

  const handleDelete = (file: FileItem) => {
    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      alert(`Deleted: ${file.name}`)
      // In a real app: API call to delete file
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Files</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Upload New
        </button>
      </div>

      <div className="flex space-x-2 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${activeTab === tab.toLowerCase() ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b font-semibold text-gray-700">
          <div className="col-span-4">Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>
        
        {files.map((file, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
            <div className="col-span-4 flex items-center space-x-3">
              <span className="text-xl">{icons[file.type]}</span>
              <span className="truncate">{file.name}</span>
            </div>
            <div className="col-span-2">
              <span className="capitalize px-3 py-1 bg-gray-100 rounded-full text-sm">
                {file.type}
              </span>
            </div>
            <div className="col-span-2 text-gray-600">{file.size}</div>
            <div className="col-span-2 text-gray-600">{file.date}</div>
            <div className="col-span-2 flex items-center justify-center space-x-2">
              <button 
                onClick={() => handleView(file)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
                title="View File"
              >
                👁️
              </button>
              <button 
                onClick={() => handleDownload(file)}
                className="text-green-600 hover:text-green-800 font-medium text-sm px-3 py-1.5 rounded hover:bg-green-50 transition-colors"
                title="Download File"
              >
                ⬇️
              </button>
              <button 
                onClick={() => handleDelete(file)}
                className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1.5 rounded hover:bg-red-50 transition-colors"
                title="Delete File"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Section */}
      {selectedFile && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Preview: {selectedFile.name}</h2>
            <button 
              onClick={() => setSelectedFile(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ Close
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{icons[selectedFile.type]}</div>
            <div>
              <p><strong>Type:</strong> {selectedFile.type}</p>
              <p><strong>Size:</strong> {selectedFile.size}</p>
              <p><strong>Date:</strong> {selectedFile.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Medias