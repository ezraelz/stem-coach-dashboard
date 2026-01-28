import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = 
    user?.role_name === 'admin' ? [
      { id: 1, label: 'Dashboard', to: '/admin',icon: '📊' },
      { id: 2, label: 'Coaches', to: '/admin/users', icon: '👩' },
      { id: 3, label: 'Courses', to: '/admin/courses', icon: '📁' },
      { id: 4, label: 'Lessons', to: '/admin/lessons', icon: '✅' },
      { id: 5, label: 'Calendar', to: '/admin/calendar', icon: '📅' },
      { id: 6, label: 'Messages', to: '/admin/messages', icon: '💬' },
      { id: 7, label: 'Settings', to: '/admin/settings', icon: '⚙️' },
    ] :
    user?.role_name === 'coach' ? [
      { id: 1, label: 'Dashboard', to: '/coach', icon: '📊' },
      { id: 2, label: 'My Courses', to: '/coach/courses', icon: '📁' },
      { id: 3, label: 'My Lessons', to: '/coach/lessons', icon: '✅' },
      { id: 4, label: 'Calendar', to: '/coach/calendar', icon: '📅' },
      { id: 5, label: 'Messages', to: '/coach/messages', icon: '💬' },
      { id: 6, label: 'Settings', to: '/coach/settings', icon: '⚙️' },
  ] : [];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`
        flex flex-col
        h-screen
        bg-gradient-to-b from-gray-800 to-gray-900
        text-white
        transition-all duration-300 ease-in-out
        shadow-xl
        ${isCollapsed ? 'w-20' : 'w-64'}
        relative z-40
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold whitespace-nowrap truncate">
            Navigation
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className={`
            flex items-center justify-center
            w-8 h-8
            rounded-full
            bg-gray-700 hover:bg-gray-600
            transition-all duration-200
            hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            ${isCollapsed ? 'mx-auto' : ''}
          `}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="text-sm">
            {isCollapsed ? '→' : '←'}
          </span>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            to={item.to}
            key={item.id}
            onClick={() => setActiveItem(item.label)}
            className={`
              flex items-center
              w-full
              px-4 py-3
              rounded-lg
              transition-all duration-200
              group
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              ${isCollapsed ? 'justify-center' : 'justify-start'}
              ${activeItem === item.label
                ? 'bg-blue-900/30 text-blue-400 border-l-4 border-blue-500'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }
            `}
            aria-label={item.label}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && (
              <span className="ml-3 font-medium truncate transition-opacity duration-200">
                {item.label}
              </span>
            )}
            {activeItem === item.label && !isCollapsed && (
              <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-700">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-900/30">
            <span className="text-lg">👤</span>
          </div>
          
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden transition-all duration-200">
              <p className="font-medium text-sm truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Hover Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full top-0 ml-2">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="
                absolute left-2
                px-3 py-2
                bg-gray-900
                text-white text-sm
                rounded-md
                shadow-lg
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition-all duration-200
                whitespace-nowrap
                z-50
              "
              style={{ top: `${(item.id - 1) * 56 + 100}px` }}
            >
              {item.label}
              <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2">
                <div className="w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-r-gray-900 border-t-transparent border-b-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;