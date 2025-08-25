import React, { useState } from 'react';
import type { CourseModule as TCourseModule } from '../types';
import Quiz from './Quiz';
import { ChevronDownIcon } from './icons';

interface CourseModuleProps {
  module: TCourseModule;
  index: number;
}

const CourseModule: React.FC<CourseModuleProps> = ({ module, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="bg-slate-800/50 rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700/60 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left p-6 hover:bg-slate-700/50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-900/70 rounded-full">
            <span className="text-lg font-bold text-indigo-300">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-200">{module.moduleTitle}</h3>
        </div>
        <ChevronDownIcon
          className={`h-6 w-6 text-slate-400 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 pb-6 pt-2 space-y-6">
          <div className="border-t border-slate-700 pt-4">
            <h4 className="font-semibold text-slate-300 mb-2">Summary</h4>
            <p className="text-slate-400 leading-relaxed prose prose-invert">{module.summary}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-300 mb-4">Knowledge Check</h4>
            <Quiz questions={module.quiz} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseModule;