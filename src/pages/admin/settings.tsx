import React, { useState } from 'react'

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const settingItems = [
    {
      title: "Appearance",
      icon: "🎨",
      settings: [
        {
          label: "Dark Mode",
          value: darkMode,
          onChange: setDarkMode,
          type: "toggle"
        }
      ]
    },
    {
      title: "Notifications",
      icon: "🔔",
      settings: [
        {
          label: "Push Notifications",
          value: notifications,
          onChange: setNotifications,
          type: "toggle"
        }
      ]
    }
  ]

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Customize your experience</p>
      </div>

      <div className="space-y-6">
        {settingItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{section.icon}</span>
                <h2 className="font-semibold text-gray-900">{section.title}</h2>
              </div>
            </div>
            
            <div className="p-4">
              {section.settings.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between py-3">
                  <span className="text-gray-700">{item.label}</span>
                  {item.type === "toggle" && (
                    <button
                      onClick={() => item.onChange(!item.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        item.value ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors">
          Cancel
        </button>
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default Settings