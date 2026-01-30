import React, { useState } from 'react'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState('month') // 'month', 'week', 'day'

  // Generate days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = new Date(year, month, 1).getDay()
    
    const days = []
    
    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isToday: false
      })
    }
    
    // Current month days
    const today = new Date()
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getDate() === today.getDate() && 
                 date.getMonth() === today.getMonth() && 
                 date.getFullYear() === today.getFullYear()
      })
    }
    
    // Next month days
    const totalCells = 42 // 6 weeks
    const nextMonthDays = totalCells - days.length
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
      })
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()
  const events = [
    { id: 1, title: 'Team Meeting', date: new Date(new Date().getFullYear(), new Date().getMonth(), 15), color: 'bg-blue-500', time: '10:00 AM' },
    { id: 2, title: 'Lunch with Client', date: new Date(new Date().getFullYear(), new Date().getMonth(), 15), color: 'bg-green-500', time: '12:30 PM' },
    { id: 3, title: 'Project Deadline', date: new Date(new Date().getFullYear(), new Date().getMonth(), 20), color: 'bg-red-500', time: 'All day' },
    { id: 4, title: 'Conference Call', date: new Date(new Date().getFullYear(), new Date().getMonth(), 22), color: 'bg-purple-500', time: '3:00 PM' },
  ]

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-2">Manage your schedule and events</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Calendar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-xl">←</span>
                  </button>
                  <button
                    onClick={goToToday}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-xl">→</span>
                  </button>
                </div>
              </div>

              {/* View Selector */}
              <div className="inline-flex bg-gray-100 p-1 rounded-lg">
                {['month', 'week', 'day'].map((viewType) => (
                  <button
                    key={viewType}
                    onClick={() => setView(viewType)}
                    className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                      view === viewType
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {viewType}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Calendar Grid */}
            <div className="flex-1 p-6">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="text-center font-medium text-gray-500 text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  const dayEvents = events.filter(event => 
                    event.date.getDate() === day.date.getDate() &&
                    event.date.getMonth() === day.date.getMonth() &&
                    event.date.getFullYear() === day.date.getFullYear()
                  )

                  const isSelected = selectedDate && 
                    selectedDate.getDate() === day.date.getDate() &&
                    selectedDate.getMonth() === day.date.getMonth() &&
                    selectedDate.getFullYear() === day.date.getFullYear()

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(day.date)}
                      className={`min-h-32 p-2 border rounded-lg transition-colors cursor-pointer ${
                        day.isCurrentMonth
                          ? 'bg-white border-gray-200 hover:bg-gray-50'
                          : 'bg-gray-50 border-gray-100 text-gray-400'
                      } ${
                        day.isToday
                          ? 'border-blue-500 border-2'
                          : ''
                      } ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500'
                          : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`font-medium ${
                          day.isToday ? 'text-blue-600' : 
                          !day.isCurrentMonth ? 'text-gray-400' : 
                          isSelected ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {day.date.getDate()}
                        </span>
                        {day.isToday && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      
                      {/* Events for this day */}
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`${event.color} text-white text-xs px-2 py-1 rounded truncate`}
                            title={`${event.title} - ${event.time}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sidebar - Events & Details */}
            <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Events</h4>
                    {events.filter(event => 
                      event.date.getDate() === selectedDate.getDate() &&
                      event.date.getMonth() === selectedDate.getMonth() &&
                      event.date.getFullYear() === selectedDate.getFullYear()
                    ).length > 0 ? (
                      <div className="space-y-3">
                        {events.filter(event => 
                          event.date.getDate() === selectedDate.getDate() &&
                          event.date.getMonth() === selectedDate.getMonth() &&
                          event.date.getFullYear() === selectedDate.getFullYear()
                        ).map(event => (
                          <div key={event.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start space-x-3">
                              <div className={`w-3 h-3 ${event.color} rounded-full mt-1`}></div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{event.title}</h5>
                                <p className="text-sm text-gray-500 mt-1">{event.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">📅</div>
                        <p>No events scheduled</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Add New Event</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Event title"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="time"
                          className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                        Add Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className={`w-4 h-4 ${event.color} rounded-full mt-1`}></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        weekday: 'short' 
                      })} • {event.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar