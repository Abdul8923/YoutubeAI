import React, { useState } from 'react';
import { LinkIcon, ArrowRightIcon, TagIcon } from './icons';

interface URLInputFormProps {
  onSubmit: (data: { url: string, title: string }) => void;
  isLoading: boolean;
}

const URLInputForm: React.FC<URLInputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ url, title });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div className="relative flex-grow w-full">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full pl-11 pr-4 py-3 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-150 ease-in-out shadow-sm placeholder:text-slate-500"
            required
            disabled={isLoading}
          />
        </div>
         <div className="relative flex-grow w-full">
          <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Video Title (optional, improves accuracy)"
            className="w-full pl-11 pr-4 py-3 bg-slate-700/50 rounded-lg border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-150 ease-in-out shadow-sm placeholder:text-slate-500"
            disabled={isLoading}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200"
      >
        {isLoading ? (
          'Generating...'
        ) : (
          <>
            <span>Create Course</span>
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </>
        )}
      </button>
    </form>
  );
};

export default URLInputForm;