import React, { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { generateCourse } from './services/geminiService';
import type { CourseData } from './types';
import { URLInputForm } from './components/URLInputForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { CourseDisplay } from './components/CourseDisplay';
import { LogoIcon, BookOpenIcon, ArrowDownTrayIcon } from './components/icons';

export const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);

  const extractYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleDownloadPdf = useCallback(() => {
    if (!courseData) return;

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;
    let y = 20;

    const addPageIfNeeded = (spaceNeeded: number) => {
        if (y + spaceNeeded > 280) { // 297mm page height, with some margin
            doc.addPage();
            y = 20;
        }
    };

    const writeText = (text: string, options: any) => {
        doc.setFont(options.font || 'helvetica', options.style || 'normal');
        doc.setFontSize(options.size || 10);
        doc.setTextColor(options.color || '#000000');
        
        const lines = doc.splitTextToSize(text, maxLineWidth);
        const textHeight = doc.getTextDimensions(lines).h;
        
        addPageIfNeeded(textHeight);
        
        doc.text(lines, margin, y);
        y += textHeight + (options.spacing || 5);
    };

    writeText(courseData.title, { size: 22, style: 'bold', spacing: 10 });
    writeText(courseData.description, { size: 12, style: 'italic', spacing: 10 });

    addPageIfNeeded(20);
    y += 5;
    writeText('Key Takeaways', { size: 16, style: 'bold', spacing: 7 });
    courseData.keyTakeaways.forEach(takeaway => {
        writeText(`• ${takeaway}`, { size: 11, spacing: 4 });
    });

    courseData.modules.forEach((module, index) => {
        addPageIfNeeded(30);
        y += 10;
        writeText(`Module ${index + 1}: ${module.moduleTitle}`, { size: 16, style: 'bold', spacing: 7 });
        
        writeText('Summary:', { size: 12, style: 'bold', spacing: 4 });
        writeText(module.summary, { size: 11, spacing: 8 });

        writeText('Knowledge Check:', { size: 12, style: 'bold', spacing: 4 });
        module.quiz.forEach((q, qIndex) => {
            addPageIfNeeded(25);
            writeText(`${qIndex + 1}. ${q.question}`, { size: 11, style: 'bold', spacing: 4 });
            q.options.forEach(opt => {
                  writeText(`  - ${opt}`, { size: 10, spacing: 3 });
            });
            writeText(`Correct Answer: ${q.correctAnswer}`, { size: 10, style: 'italic', spacing: 6 });
        });
    });

    doc.save(`${courseData.title.replace(/\s+/g, '_').toLowerCase()}_course.pdf`);

  }, [courseData]);

  const handleGenerateCourse = useCallback(async ({ url, title }: { url: string; title: string }) => {
    if (!url) {
      setError('Please enter a valid YouTube URL.');
      return;
    }

    const videoId = extractYouTubeID(url);
    if (!videoId) {
        setError('Could not extract video ID. Please use a valid YouTube video URL.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setCourseData(null);
    setYoutubeVideoId(null);

    try {
      const data = await generateCourse(url, title);
      setCourseData(data);
      setYoutubeVideoId(videoId);
    } catch (err: any) {
      console.error(err);
      setError(`Failed to generate course. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    React.createElement('div', { className: "min-h-screen text-slate-300" },
      React.createElement('header', { className: "bg-slate-900/70 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-700/80" },
        React.createElement('div', { className: "container mx-auto px-4 sm:px-6 lg:px-8" },
          React.createElement('div', { className: "flex items-center justify-between h-16" },
            React.createElement('div', { className: "flex items-center space-x-3" },
              React.createElement(LogoIcon, { className: "h-8 w-8 text-indigo-400" }),
              React.createElement('h1', { className: "text-xl sm:text-2xl font-bold text-slate-100 tracking-tight" }, 'YouTubeCourse AI')
            ),
            courseData && !isLoading && React.createElement('button', {
              onClick: handleDownloadPdf,
              className: "flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-red-700 hover:to-rose-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transform hover:scale-[1.03] transition-all duration-200"
            },
              React.createElement(ArrowDownTrayIcon, { className: "h-5 w-5 mr-2" }),
              'Download PDF'
            )
          )
        )
      ),
      React.createElement('main', { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" },
        React.createElement('div', { className: "max-w-3xl mx-auto" },
          React.createElement('div', { className: "text-center mb-10" },
            React.createElement('h2', { className: "text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight" }, 'Transform Video into',
              React.createElement('span', { className: "block bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent" }, 'Actionable Knowledge')
            ),
            React.createElement('p', { className: "mt-4 text-lg text-slate-400 max-w-2xl mx-auto" }, 'Paste a YouTube link below. Adding the video title helps our AI create a more accurate course.')
          ),
          React.createElement('div', { className: "bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700/60" },
            React.createElement(URLInputForm, { onSubmit: handleGenerateCourse, isLoading: isLoading })
          ),
          React.createElement('div', { className: "mt-12" },
            isLoading && React.createElement('div', { className: "flex flex-col items-center justify-center text-center text-slate-400" },
              React.createElement(LoadingSpinner, null),
              React.createElement('p', { className: "mt-4 text-lg font-medium" }, 'Generating your course...'),
              React.createElement('p', { className: "text-sm" }, "This may take a moment. We're crafting the perfect learning path for you!")
            ),
            error && React.createElement('div', { className: "bg-red-900/50 border-l-4 border-red-600 text-red-300 p-4 rounded-md shadow-md", role: "alert" },
              React.createElement('p', { className: "font-bold" }, 'An Error Occurred'),
              React.createElement('p', null, error)
            ),
            courseData && youtubeVideoId && !isLoading && React.createElement(CourseDisplay, { course: courseData, youtubeVideoId: youtubeVideoId }),
            !courseData && !isLoading && !error && (
              React.createElement('div', { className: "text-center bg-slate-800/50 p-12 rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700/60" },
                React.createElement(BookOpenIcon, { className: "mx-auto h-16 w-16 text-slate-600" }),
                React.createElement('h3', { className: "mt-4 text-xl font-semibold text-slate-200" }, 'Your Course Awaits'),
                React.createElement('p', { className: "mt-2 text-slate-400" }, 'Enter a YouTube URL above to begin your learning journey.')
              )
            )
          )
        )
      )
    )
  );
};

export default App;
