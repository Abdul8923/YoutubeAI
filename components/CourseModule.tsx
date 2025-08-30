import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';
import { Quiz } from './Quiz';
import type { CourseModuleData } from '../types';

interface CourseModuleProps {
  module: CourseModuleData;
  index: number;
}

export const CourseModule: React.FC<CourseModuleProps> = ({ module, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    React.createElement('div', { className: "bg-slate-800/50 rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700/60 overflow-hidden transition-all duration-300" },
      React.createElement('button', {
        onClick: () => setIsOpen(!isOpen),
        className: "w-full flex justify-between items-center text-left p-6 hover:bg-slate-700/50 transition-colors duration-200"
      },
        React.createElement('div', { className: "flex items-center space-x-4" },
          React.createElement('div', { className: "flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-900/70 rounded-full" },
            React.createElement('span', { className: "text-lg font-bold text-indigo-300" }, String(index + 1).padStart(2, '0'))
          ),
          React.createElement('h3', { className: "text-xl font-semibold text-slate-200" }, module.moduleTitle)
        ),
        React.createElement(ChevronDownIcon, {
          className: `h-6 w-6 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`
        })
      ),
      React.createElement('div', {
        className: `transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`
      },
        React.createElement('div', { className: "px-6 pb-6 pt-2 space-y-6" },
          React.createElement('div', { className: "border-t border-slate-700 pt-4" },
            React.createElement('h4', { className: "font-semibold text-slate-300 mb-2" }, 'Summary'),
            React.createElement('p', { className: "text-slate-400 leading-relaxed prose prose-invert" }, module.summary)
          ),
          React.createElement('div', null,
            React.createElement('h4', { className: "font-semibold text-slate-300 mb-4" }, 'Knowledge Check'),
            React.createElement(Quiz, { questions: module.quiz })
          )
        )
      )
    )
  );
};
