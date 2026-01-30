import React, { useEffect, useState } from 'react'
import useUsers from '../../../hooks/useUsers';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../../components/ui/backButton';

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userDetail, user, loading: userLoading, error: userError } = useUsers(); 

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        await userDetail(Number(userId));
      } catch (err) {
        setError('Failed to load user details. Please try again.');
        console.error('Error loading user details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, userDetail]);

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'activity', label: 'Activity' },
    { id: 'documents', label: 'Documents' },
    { id: 'settings', label: 'Settings' }
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return 'Never logged in';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateTimeString;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusBadge = (isActive?: boolean) => {
    if (isActive) {
      return {
        text: 'Active',
        className: 'bg-green-100 text-green-800'
      };
    }
    return {
      text: 'Inactive',
      className: 'bg-gray-100 text-gray-800'
    };
  };

  const statusBadge = getStatusBadge(user?.is_active);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Handle edit profile
  const handleEditProfile = () => {
    // Navigate to edit page or open edit modal
    console.log('Edit profile clicked');
  };

  // Loading state
  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading user details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || userError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-gray-600 mb-6">{error || userError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No user data
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">User Not Found</h3>
              <p className="text-gray-600 mb-6">The requested user could not be found.</p>
              <button
                onClick={handleBack}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {getInitials(user.full_name)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.full_name || 'No Name Provided'}</h1>
                  <p className="text-gray-600">
                    {user.role_name || 'No Role'} • {user.department || 'No Department'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.className}`}>
                  {statusBadge.text}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-8 border-b border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
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

          <div className="flex flex-col lg:flex-row">
            {/* Left Column - User Info */}
            <div className="lg:w-1/3 p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                    {getInitials(user.full_name)}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    User since {formatDate(user.created_at)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      {user.email && (
                        <div className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-1">✉️</span>
                          <div>
                            <p className="text-gray-500 text-xs">Email</p>
                            <p className="text-gray-900 break-words">{user.email}</p>
                          </div>
                        </div>
                      )}
                      {user.phone_number && (
                        <div className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-1">📱</span>
                          <div>
                            <p className="text-gray-500 text-xs">Phone</p>
                            <p className="text-gray-900">{user.phone_number}</p>
                          </div>
                        </div>
                      )}
                      {user.address && (
                        <div className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-1">📍</span>
                          <div>
                            <p className="text-gray-500 text-xs">Address</p>
                            <p className="text-gray-900">{user.address}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="font-medium text-gray-900 mb-3">Account Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-500 text-xs">User ID</p>
                        <p className="text-gray-900 font-mono">{user.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Username</p>
                        <p className="text-gray-900">{user.username || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Last Login</p>
                        <p className="text-gray-900">{formatDateTime(user.last_login)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="flex-1 p-8">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                    <div className="space-y-6">
                      {user.bio && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Bio</h3>
                          <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                        </div>
                      )}
                      
                      {(user.skills || user.expertise) && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-3">Skills & Expertise</h3>
                          <div className="flex flex-wrap gap-2">
                            {user.skills && typeof user.skills === 'string' && user.skills.split(',').map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                            {user.expertise && typeof user.expertise === 'string' && user.expertise.split(',').map((exp, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                              >
                                {exp.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                        <div className="text-blue-600 text-3xl font-bold">
                          {user.projects_count || user.assigned_projects || 0}
                        </div>
                        <div className="text-blue-800 font-medium mt-2">Projects</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                        <div className="text-green-600 text-3xl font-bold">
                          {user.tasks_completed || user.completed_tasks || 0}
                        </div>
                        <div className="text-green-800 font-medium mt-2">Tasks Completed</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                        <div className="text-purple-600 text-3xl font-bold">
                          {user.performance_score ? `${user.performance_score}%` : 'N/A'}
                        </div>
                        <div className="text-purple-800 font-medium mt-2">Performance</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                  {user.recent_activity ? (
                    <div className="space-y-4">
                      {Array.isArray(user.recent_activity) && user.recent_activity.length > 0 ? (
                        user.recent_activity.map((activity: any, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-gray-900">{activity.description || activity.action}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {formatDateTime(activity.timestamp || activity.created_at)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-4xl mb-2">📊</div>
                          <p>No recent activity found</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📊</div>
                      <p>No activity data available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
                  {user.documents ? (
                    <div className="space-y-3">
                      {Array.isArray(user.documents) && user.documents.length > 0 ? (
                        user.documents.map((doc: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600">📄</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{doc.name || doc.file_name}</p>
                                <p className="text-sm text-gray-500">
                                  {doc.type || doc.file_type} • {formatDate(doc.uploaded_at || doc.created_at)}
                                </p>
                              </div>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <span>⬇️</span>
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-4xl mb-2">📄</div>
                          <p>No documents uploaded</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📄</div>
                      <p>No document data available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">User Settings</h2>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="text-gray-600 mb-4">
                      User settings are managed by administrators. Contact your system administrator to modify user settings.
                    </p>
                    <button
                      onClick={handleEditProfile}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Request Edit Permission
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                User ID: {user.id} • Last updated: {formatDate(user.last_login || user.created_at)}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleEditProfile}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetail;