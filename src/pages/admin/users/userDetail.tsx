import React, { useEffect, useState } from 'react'
import useUsers from '../../../hooks/useUsers';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../../components/ui/backButton';

interface EditableUser {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  department: string;
  role_name: string;
  is_active: boolean;
}

const UserDetail: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'documents' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<EditableUser | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    user,
    userDetail,
    updateUser,
    isLoading: userLoading,
    error: userError
  } = useUsers();

  useEffect(() => {
    userDetail();
  }, []);

  // Initialize editedUser when user data loads
  useEffect(() => {
    if (user && !editedUser) {
      setEditedUser({
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        department: user.department || '',
        role_name: user.role_name || '',
        is_active: user.is_active || false
      });
    }
  }, [user, editedUser]);

  const handleInputChange = (field: keyof EditableUser, value: string | boolean) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value
      });
    }
  };

  const handleSave = async () => {
    if (!editedUser || !user) return;
    
    setSaving(true);
    try {
      await updateUser(user.id, editedUser);
      setIsEditing(false);
      // Optionally refresh user data
      await userDetail();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditedUser({
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        department: user.department || '',
        role_name: user.role_name || '',
        is_active: user.is_active || false
      });
    }
    setIsEditing(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Loading state
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading user details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (userError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-gray-600 mb-6">{userError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No user
  if (!user || !editedUser) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">User Not Found</h3>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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

  const getInitials = (name: string) => {
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

  const statusBadge = getStatusBadge(user.is_active);

  const handleBack = () => {
    navigate(-1);
  };

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
                  {getInitials(editedUser.full_name)}
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="text-2xl font-bold text-gray-900 bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-700 w-full"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{editedUser.full_name || 'No Name Provided'}</h1>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={editedUser.role_name}
                          onChange={(e) => handleInputChange('role_name', e.target.value)}
                          className="text-gray-600 bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-700 w-32"
                          placeholder="Role"
                        />
                        <span className="text-gray-400">•</span>
                        <input
                          type="text"
                          value={editedUser.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="text-gray-600 bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-700 w-32"
                          placeholder="Department"
                        />
                      </>
                    ) : (
                      <p className="text-gray-600">
                        {editedUser.role_name || 'No Role'} • {editedUser.department || 'No Department'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={editedUser.is_active}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-14 h-7 rounded-full transition-colors ${editedUser.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${editedUser.is_active ? 'left-8' : 'left-1'}`} />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {editedUser.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.className}`}>
                    {statusBadge.text}
                  </span>
                )}
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
                    {getInitials(editedUser.full_name)}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    User since {formatDate(user.date_joined)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">✉️</span>
                        <div className="flex-1">
                          <p className="text-gray-500 text-xs">Email</p>
                          {isEditing ? (
                            <input
                              type="email"
                              value={editedUser.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="w-full bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-700 py-1"
                            />
                          ) : (
                            <p className="text-gray-900 break-words">{editedUser.email || 'Not set'}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">📱</span>
                        <div className="flex-1">
                          <p className="text-gray-500 text-xs">Phone</p>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editedUser.phone_number}
                              onChange={(e) => handleInputChange('phone_number', e.target.value)}
                              className="w-full bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-700 py-1"
                            />
                          ) : (
                            <p className="text-gray-900">{editedUser.phone_number || 'Not set'}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">📍</span>
                        <div className="flex-1">
                          <p className="text-gray-500 text-xs">Address</p>
                          {isEditing ? (
                            <textarea
                              value={editedUser.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              className="w-full bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-700 py-1 resize-none"
                              rows={2}
                            />
                          ) : (
                            <p className="text-gray-900">{editedUser.address || 'Not set'}</p>
                          )}
                        </div>
                      </div>
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
                      {isEditing && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-blue-700 text-sm">
                            You are currently editing this profile. Changes will be saved when you click "Save Changes".
                          </p>
                        </div>
                      )}
                      {/* Additional profile fields can be added here */}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h2>
                    {/* Statistics content */}
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No activity data available</p>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📄</div>
                    <p>No document data available</p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">User Settings</h2>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="text-gray-600 mb-4">
                      User settings are managed by administrators. Contact your system administrator to modify user settings.
                    </p>
                    {!isEditing && (
                      <button
                        onClick={handleEditProfile}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Request Edit Permission
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                User ID: {user.id} • Last updated: {formatDate(user.last_login || user.date_joined)}
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-6 py-2.5 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetail;