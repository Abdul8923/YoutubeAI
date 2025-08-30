import React from 'react';
import { CourseModule } from './CourseModule';
import { CheckCircleIcon } from './icons';
import type { CourseData } from '../types';

interface CourseDisplayProps {
  course: CourseData;
  youtubeVideoId: string;
}

export const CourseDisplay: React.FC<CourseDisplayProps> = ({ course, youtubeVideoId }) => {
  const contentBlocks = [
    { type: 'header', data: course },
    { type: 'video', data: youtubeVideoId },
    { type: 'takeaways', data: course.keyTakeaways },
    { type: 'modulesTitle', data: null },
    ...course.modules.map(module => ({ type: 'module', data: module }))
  ];

  return (
    React.createElement('div', { className: "space-y-6" },
      contentBlocks.map((block, index) => {
        if (!block.data && block.type !== 'modulesTitle') return null;

        const style = { animationDelay: `${index * 100}ms` };

        switch (block.type) {
          case 'header':
            return React.createElement('header', { key: index, style: style, className: "bg-slate-800/50 p-8 rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700/60 animate-fade-in-up" },
              React.createElement('h1', { className: "text-3xl font-bold text-slate-100 tracking-tight" }, course.title),
              React.createElement('p', { className: "mt-3 text-lg text-slate-300" }, course.description)
            );
          case 'video':
            return youtubeVideoId && React.createElement('div', { key: index, style: style, className: "bg-slate-800/50 p-4 rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700/60 animate-fade-in-up" },
              React.createElement('div', { className: "relative", style: { paddingTop: '56.25%' } },
                React.createElement('iframe', {
                  className: "absolute top-0 left-0 w-full h-full rounded-lg",
                  src: `https://www.youtube.com/embed/${youtubeVideoId}`,
                  title: "YouTube video player",
                  frameBorder: "0",
                  allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                  allowFullScreen: true
                })
              )
            );
          case 'takeaways':
            return React.createElement('div', { key: index, style: style, className: "bg-slate-800/50 p-8 rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700/60 animate-fade-in-up" },
              React.createElement('h2', { className: "text-2xl font-semibold text-slate-200 mb-4" }, 'Key Takeaways'),
              React.createElement('ul', { className: "space-y-3" },
                course.keyTakeaways.map((takeaway, tIndex) => (
                  React.createElement('li', { key: tIndex, className: "flex items-start" },
                    React.createElement(CheckCircleIcon, { className: "h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" }),
                    React.createElement('span', { className: "text-slate-300" }, takeaway)
                  )
                ))
              )
            );
          case 'modulesTitle':
            return React.createElement('h2', { key: index, style: style, className: "text-2xl font-semibold text-slate-200 pt-4 animate-fade-in-up" }, 'Course Modules');
          case 'module':
            const moduleIndex = course.modules.findIndex(m => m.moduleTitle === (block.data as any).moduleTitle);
            return React.createElement('div', { key: index, style: style, className: "animate-fade-in-up" },
              React.createElement(CourseModule, { module: block.data as any, index: moduleIndex })
            );
          default:
            return null;
        }
      })
    )
  );
};
