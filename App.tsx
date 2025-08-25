import React, { useState, useCallback } from 'react';
import type { Course } from './types';
import { generateCourse } from './services/geminiService';
import URLInputForm from './components/URLInputForm';
import LoadingSpinner from './components/LoadingSpinner';
import CourseDisplay from './components/CourseDisplay';
import { BookOpenIcon, LogoIcon } from './components/icons';

const extractYouTubeID = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return null;
};


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);

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
    } catch (err) {
      console.error(err);
      setError('Failed to generate course. Please check the URL or try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen text-slate-300">
      <header className="bg-slate-900/70 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-700/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <LogoIcon className="h-8 w-8 text-indigo-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                YouTubeCourse AI
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
              Transform Video into
              <span className="block bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">Actionable Knowledge</span>
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Paste a YouTube link below. Adding the video title helps our AI create a more accurate course.
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700/60">
            <URLInputForm onSubmit={handleGenerateCourse} isLoading={isLoading} />
          </div>

          <div className="mt-12">
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-center text-slate-400">
                <LoadingSpinner />
                <p className="mt-4 text-lg font-medium">Generating your course...</p>
                <p className="text-sm">This may take a moment. We're crafting the perfect learning path for you!</p>
              </div>
            )}
            {error && (
              <div className="bg-red-900/50 border-l-4 border-red-600 text-red-300 p-4 rounded-md shadow-md" role="alert">
                <p className="font-bold">An Error Occurred</p>
                <p>{error}</p>
              </div>
            )}
            {courseData && youtubeVideoId && !isLoading && <CourseDisplay course={courseData} youtubeVideoId={youtubeVideoId} />}
            {!courseData && !isLoading && !error && (
               <div className="text-center bg-slate-800/50 p-12 rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700/60">
                  <BookOpenIcon className="mx-auto h-16 w-16 text-slate-600"/>
                  <h3 className="mt-4 text-xl font-semibold text-slate-200">Your Course Awaits</h3>
                  <p className="mt-2 text-slate-400">
                    Enter a YouTube URL above to begin your learning journey.
                  </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;