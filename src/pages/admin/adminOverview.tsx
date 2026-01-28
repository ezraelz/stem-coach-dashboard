import React, { useEffect, useState  } from 'react';
import { Link } from 'react-router-dom';
import useUsers from '../../hooks/useUsers';
import { useCourses } from '../../hooks/useCourse';
import { useLessons } from '../../hooks/useLessons';

const AdminOverview = () => {
  const [timeRange, setTimeRange] = useState('month');
  const { users, fetchUsers } = useUsers();
  const { courses } = useCourses();
  const { lessons, fetchLessons } = useLessons();
  
    useEffect(() => {
        fetchUsers();
        fetchLessons();
    }, []);

  // Mock data - replace with real data from your API
  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      change: '+12.5%',
      trend: 'up',
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      link: '/users'
    },
    {
      title: 'Active Courses',
      value: courses.length,
      change: '+8.2%',
      trend: 'up',
      icon: '📊',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      link: '/analytics'
    },
    {
      title: 'Lessons',
      value: lessons.length,
      change: '+5.3%',
      trend: 'up',
      icon: '✅',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      link: '/revenue'
    },
  ];

  const [statWidths] = useState(() => stats.map(() => Math.min(100, 70 + Math.random() * 30)));

  const quickActions = [
    { title: 'Add User', icon: '➕', description: 'Create new user account', link: '/users/add', color: 'bg-blue-100 text-blue-600' },
    { title: 'Generate Report', icon: '📈', description: 'Create analytics report', link: '/reports/generate', color: 'bg-green-100 text-green-600' },
    { title: 'Send Announcement', icon: '📢', description: 'Broadcast to all users', link: '/announcements', color: 'bg-purple-100 text-purple-600' },
    { title: 'System Check', icon: '⚙️', description: 'Run system diagnostics', link: '/system', color: 'bg-amber-100 text-amber-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform today.</p>
          </div>
          
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">from last {timeRange}</span>
                </div>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                  style={{ width: `${statWidths[index]}%` }}
                ></div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts & Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
              <div className="flex items-center space-x-2">
                {['Users', 'Sessions'].map((item) => (
                  <button
                    key={item}
                    className="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-gray-600">Interactive chart will appear here</p>
                <p className="text-sm text-gray-500 mt-1">Connect your analytics data</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              <Link to="/activities" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Projects */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className={`${action.color} p-3 rounded-lg mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <p className="font-medium text-gray-900 text-sm text-center">{action.title}</p>
                  <p className="text-xs text-gray-500 text-center mt-1">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminOverview;