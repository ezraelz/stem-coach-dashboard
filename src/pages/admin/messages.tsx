import React, { useState } from 'react'

const Messages = () => {
  const [chats, setChats] = useState([
    { id: 1, name: "Work Group", lastMsg: "Meeting at 3 PM", time: "10:30", unread: 3 },
    { id: 2, name: "John Doe", lastMsg: "Thanks for the help!", time: "09:15", unread: 0 },
    { id: 3, name: "Support", lastMsg: "Your issue has been resolved", time: "Yesterday", unread: 0 },
  ])

  const [activeChat, setActiveChat] = useState(1)
  const [message, setMessage] = useState("")

  const messages = [
    { id: 1, text: "Hello!", sender: "them", time: "10:30" },
    { id: 2, text: "Hi there! How can I help you?", sender: "me", time: "10:31" },
    { id: 3, text: "I need help with my account.", sender: "them", time: "10:32" },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Chat with your team and colleagues</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Chat List */}
            <div className="lg:col-span-1 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="divide-y divide-gray-100">
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      activeChat === chat.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                        {chat.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                          <span className="text-xs text-gray-500">{chat.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMsg}</p>
                      </div>
                      {chat.unread > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                    W
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Work Group</h2>
                    <p className="text-sm text-gray-500">3 members • Last seen today</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                          msg.sender === 'me'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs opacity-75 mt-1 text-right">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <span>➕</span>
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    disabled={!message.trim()}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      message.trim()
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages