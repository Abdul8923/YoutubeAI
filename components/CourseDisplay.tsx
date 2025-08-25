import React from 'react';
import type { Course } from '../types';
import CourseModule from './CourseModule';
import { CheckCircleIcon } from './icons';

interface CourseDisplayProps {
  course: Course;
  youtubeVideoId: string | null;
}

const CourseDisplay: React.FC<CourseDisplayProps> = ({ course, youtubeVideoId }) => {
  const contentBlocks = [
    { type: 'header', data: course },
    { type: 'video', data: youtubeVideoId },
    { type: 'takeaways', data: course.keyTakeaways },
    { type: 'modulesTitle', data: null },
    ...course.modules.map(module => ({ type: 'module', data: module }))
  ];
  
  return (
    <div className="space-y-6">
      {contentBlocks.map((block, index) => {
        if (!block.data && block.type !== 'modulesTitle') return null;
        
        const style = { animationDelay: `${index * 100}ms` };

        if (block.type === 'header') {
          return (
            <header key={index} style={style} className="bg-slate-800/50 p-8 rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700/60 animate-fade-in-up">
              <h1 className="text-3xl font-bold text-slate-100 tracking-tight">{course.title}</h1>
              <p className="mt-3 text-lg text-slate-300">{course.description}</p>
            </header>
          );
        }

        if (block.type === 'video' && youtubeVideoId) {
          return (
            <div key={index} style={style} className="bg-slate-800/50 p-4 rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700/60 animate-fade-in-up">
              <div className="relative" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                  <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                  ></iframe>
              </div>
            </div>
          );
        }

        if (block.type === 'takeaways') {
          return (
            <div key={index} style={style} className="bg-slate-800/50 p-8 rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700/60 animate-fade-in-up">
              <h2 className="text-2xl font-semibold text-slate-200 mb-4">Key Takeaways</h2>
              <ul className="space-y-3">
                {course.keyTakeaways.map((takeaway, tIndex) => (
                  <li key={tIndex} className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-slate-300">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        
        if (block.type === 'modulesTitle') {
            return (
                <h2 key={index} style={style} className="text-2xl font-semibold text-slate-200 pt-4 animate-fade-in-up">Course Modules</h2>
            );
        }

        if (block.type === 'module') {
          const moduleIndex = course.modules.findIndex(m => m.moduleTitle === (block.data as any).moduleTitle);
          return (
            <div key={index} style={style} className="animate-fade-in-up">
              <CourseModule module={block.data as any} index={moduleIndex} />
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
};

export default CourseDisplay;