import React from 'react';
import { BookOpen, Github } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">ScholarSync</h1>
              <p className="text-xs text-gray-500 font-medium">AI-Powered Research Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
               Powered by Gemini 2.5
             </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
