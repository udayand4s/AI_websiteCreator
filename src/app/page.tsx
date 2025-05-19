'use client';
import { useState } from 'react';
import { Search, Settings, Home, List, Plus, Calendar, Clock, Star, ChevronDown, Code, Wand2, Bell, ShoppingBag, CheckSquare } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSubmit =async () => {
    try {
      const response= await axios.post('/api/responseGeneration', {
      prompt: prompt.trim(),})
      router.push('/pages/generator')
    console.log(response.data);
    } catch (error) {
      console.error('Error generating response:', error);
    }
    
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 p-5 border-r border-zinc-800 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold flex items-center">
            <Wand2 className="mr-2" />
            CodeCraft
          </h1>
        </div>

        <nav className="mb-8">
          <ul className="space-y-3">
            <li>
              <a href="#" className="flex items-center text-white hover:text-zinc-300 font-medium">
                <Home className="w-5 h-5 mr-3" />
                Home
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-zinc-400 hover:text-zinc-300">
                <Search className="w-5 h-5 mr-3" />
                Search
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-zinc-400 hover:text-zinc-300">
                <List className="w-5 h-5 mr-3" />
                My Projects
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-zinc-400 hover:text-zinc-300">
                <Calendar className="w-5 h-5 mr-3" />
                Recent
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-4 mb-6 border-t border-zinc-800 pt-6">
          <h2 className="text-sm uppercase font-semibold text-zinc-500 mb-4">Recent Projects</h2>
          <ul className="space-y-3">
            <li>
              <a href="#" className="flex items-center text-zinc-400 hover:text-zinc-300">
                <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center mr-3">
                  <CheckSquare className="w-3 h-3" />
                </div>
                Todo Calculator
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-zinc-400 hover:text-zinc-300">
                <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center mr-3">
                  <Code className="w-3 h-3" />
                </div>
                Authentication API
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-zinc-400 hover:text-zinc-300">
                <div className="w-6 h-6 rounded-md bg-zinc-600 flex items-center justify-center mr-3">
                  <Code className="w-3 h-3" />
                </div>
                Portfolio Website
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-zinc-400 hover:text-zinc-300 group">
                <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center mr-3">
                  <Plus className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                </div>
                <span className="text-zinc-500 group-hover:text-zinc-300">New Project</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-auto">
          <a href="#" className="flex items-center text-zinc-400 hover:text-zinc-300">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top header */}
        <header className="p-5 flex justify-between items-center border-b border-zinc-800 sticky top-0 bg-black z-10">
          <div className="w-32"></div> {/* Empty spacer */}
          <div className="flex-1">
            {/* This will be moved to the center section */}
          </div>
          <div className="relative">
            <button 
              className="flex items-center space-x-2 bg-zinc-900 rounded-full pr-4 pl-1 py-1 hover:bg-zinc-800"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                DC
              </div>
              <span>DevCoder</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 rounded-md shadow-lg overflow-hidden z-20">
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800">Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800">Subscription</a>
                  <a href="#" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800">Sign out</a>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6 flex flex-col">
          {/* Centered search bar */}
          <div className="flex justify-center items-center my-12">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Create something amazing..."
                className="w-full bg-zinc-900 text-white px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-12 text-lg"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 h-6 w-6" />
              
              <button onClick={handleSubmit} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white rounded-lg px-5 py-2 hover:bg-indigo-700 transition">
                Generate
              </button>
              
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Project Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Example project cards */}
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-xl p-5 hover:shadow-lg hover:shadow-indigo-900/30 transition duration-300 cursor-pointer">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-indigo-600 rounded-lg">
                    <CheckSquare className="h-6 w-6" />
                  </div>
                  <Star className="h-5 w-5 text-zinc-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Todo App</h3>
                <p className="text-zinc-300 mb-4">Create a beautiful todo application with persistent storage</p>
                <div className="flex items-center">
                  <span className="text-xs bg-indigo-600/50 px-2 py-1 rounded-full">Popular</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-800 to-amber-600 rounded-xl p-5 hover:shadow-lg hover:shadow-amber-800/30 transition duration-300 cursor-pointer">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-amber-600 rounded-lg">
                    <Bell className="h-6 w-6" />
                  </div>
                  <Star className="h-5 w-5 text-zinc-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Alarm App</h3>
                <p className="text-zinc-300 mb-4">Build a customizable alarm clock with sound options</p>
                <div className="flex items-center">
                  <span className="text-xs bg-amber-600/50 px-2 py-1 rounded-full">Beginner</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-xl p-5 hover:shadow-lg hover:shadow-emerald-900/30 transition duration-300 cursor-pointer">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-emerald-600 rounded-lg">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <Star className="h-5 w-5 text-zinc-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ecommerce Website</h3>
                <p className="text-zinc-300 mb-4">Create a full-featured online store with cart and checkout</p>
                <div className="flex items-center">
                  <span className="text-xs bg-emerald-600/50 px-2 py-1 rounded-full">Advanced</span>
                </div>
              </div>
            </div>
          </section>

          
        </main>
      </div>
    </div>
  );
}