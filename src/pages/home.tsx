import React from 'react';

const Home = () => {
  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6">
                Unlock Your Potential in{' '}
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  STEM
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Personalized coaching from industry experts to help you excel in Science, Technology, Engineering, and Mathematics.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Find Your Coach
                </button>
                <button className="px-8 py-4 bg-transparent text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300">
                  Explore Programs
                </button>
              </div>
              <div className="flex gap-8">
                <div>
                  <span className="block text-3xl font-bold text-gray-900">500+</span>
                  <span className="text-gray-600">Expert Coaches</span>
                </div>
                <div>
                  <span className="block text-3xl font-bold text-gray-900">10K+</span>
                  <span className="text-gray-600">Students Mentored</span>
                </div>
                <div>
                  <span className="block text-3xl font-bold text-gray-900">95%</span>
                  <span className="text-gray-600">Success Rate</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4 h-96">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl row-span-2 transform hover:scale-105 transition-transform"></div>
                <div className="bg-gradient-to-br from-red-500 to-orange-400 rounded-2xl transform hover:scale-105 transition-transform"></div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl transform hover:scale-105 transition-transform"></div>
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl transform hover:scale-105 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Empowering Future Innovators
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide personalized guidance to help students excel in STEM fields
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'Personalized Learning', desc: 'Customized coaching plans tailored to your goals' },
              { icon: '👥', title: 'Expert Coaches', desc: 'Learn from industry professionals with real-world experience' },
              { icon: '💡', title: 'Hands-on Projects', desc: 'Build practical skills through real-world STEM projects' },
              { icon: '📊', title: 'Progress Tracking', desc: 'Monitor your improvement with detailed analytics' },
              { icon: '🕒', title: 'Flexible Scheduling', desc: 'Learn at your own pace with sessions that fit your schedule' },
              { icon: '🏆', title: 'Career Guidance', desc: 'Get mentorship on career paths in STEM' }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase mb-4 block">
              Our Programs
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive STEM Coaching
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our range of specialized programs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Science Program */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-6">
                <span className="text-5xl block mb-3">🔬</span>
                <h3 className="text-2xl font-bold text-gray-900">Science Excellence</h3>
              </div>
              <p className="text-gray-600 mb-6">Biology, Chemistry, Physics coaching with lab experiments</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">✓ One-on-one mentoring</li>
                <li className="flex items-center text-gray-600">✓ Lab practice sessions</li>
                <li className="flex items-center text-gray-600">✓ Research paper guidance</li>
                <li className="flex items-center text-gray-600">✓ Competition preparation</li>
              </ul>
              <button className="w-full py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                Learn More
              </button>
            </div>

            {/* Tech Program - Featured */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-600 transform scale-105 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="text-center mb-6">
                <span className="text-5xl block mb-3">💻</span>
                <h3 className="text-2xl font-bold text-gray-900">Tech Mastery</h3>
              </div>
              <p className="text-gray-600 mb-6">Programming, Web Development, AI, and Data Science</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">✓ Coding bootcamps</li>
                <li className="flex items-center text-gray-600">✓ Project-based learning</li>
                <li className="flex items-center text-gray-600">✓ Tech stack mastery</li>
                <li className="flex items-center text-gray-600">✓ Interview preparation</li>
              </ul>
              <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Learn More
              </button>
            </div>

            {/* Engineering Program */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-6">
                <span className="text-5xl block mb-3">⚙️</span>
                <h3 className="text-2xl font-bold text-gray-900">Engineering Path</h3>
              </div>
              <p className="text-gray-600 mb-6">Mechanical, Electrical, and Civil engineering fundamentals</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">✓ CAD training</li>
                <li className="flex items-center text-gray-600">✓ Design thinking</li>
                <li className="flex items-center text-gray-600">✓ Prototype development</li>
                <li className="flex items-center text-gray-600">✓ Industry projects</li>
              </ul>
              <button className="w-full py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase mb-4 block">
              Success Stories
            </span>
            <h2 className="text-4xl font-bold text-gray-900">
              What Our Students Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                rating: '★★★★★',
                text: "The personalized coaching helped me understand complex physics concepts. My coach was patient and knowledgeable.",
                author: "Sarah Johnson",
                role: "Physics Student",
                avatar: "👩‍🔬"
              },
              {
                rating: '★★★★★',
                text: "Thanks to STEM Coaches, I landed my dream internship at a tech company. The coding sessions were incredibly helpful.",
                author: "Michael Chen",
                role: "Computer Science",
                avatar: "👨‍💻"
              },
              {
                rating: '★★★★★',
                text: "The engineering projects I worked on gave me real-world experience that set me apart in college applications.",
                author: "Emily Rodriguez",
                role: "Engineering Prep",
                avatar: "👩‍🏗️"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-yellow-400 text-xl mb-4">{testimonial.rating}</div>
                <p className="text-gray-700 italic mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase mb-4 block">
              Expert Mentors
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Learn From The Best
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Dr. Lisa Wong', title: 'PhD in Physics, MIT', specialty: 'Physics & Astronomy', avatar: '👩‍🔬' },
              { name: 'James Peterson', title: 'Senior Software Engineer, Google', specialty: 'Computer Science', avatar: '👨‍💻' },
              { name: 'Prof. Sarah Miller', title: 'PhD in Chemical Engineering', specialty: 'Chemical Engineering', avatar: '👩‍🏭' },
              { name: 'Dr. Robert Chen', title: 'Research Scientist, BioTech', specialty: 'Biotechnology', avatar: '👨‍🔬' }
            ].map((coach, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white mb-4">
                  {coach.avatar}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{coach.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{coach.title}</p>
                <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  {coach.specialty}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
              Meet All Coaches
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your STEM Journey?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join thousands of successful students who transformed their careers with our coaching
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-lg">
              Book Free Consultation
            </button>
            <button className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300">
              View Pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;