import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons';
import type { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
}

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectAnswer = (questionIndex: number, option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const getOptionClass = (question: QuizQuestion, questionIndex: number, option: string) => {
    if (!isSubmitted) {
      return selectedAnswers[questionIndex] === option
        ? 'bg-indigo-500/30 border-indigo-500 ring-2 ring-indigo-500/50'
        : 'bg-slate-700/40 border-slate-600 hover:bg-slate-600/60 hover:border-slate-500';
    }

    const isCorrect = option === question.correctAnswer;
    const isSelected = selectedAnswers[questionIndex] === option;

    if (isCorrect) return 'bg-green-500/20 border-green-500';
    if (isSelected && !isCorrect) return 'bg-red-500/20 border-red-500';
    return 'bg-slate-700/20 border-slate-700 opacity-60';
  };

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return React.createElement('div', { className: "space-y-6" },
    questions.map((q, qIndex) => (
      React.createElement('div', { key: qIndex, className: "p-4 bg-slate-900/30 border border-slate-700 rounded-lg" },
        React.createElement('p', { className: "font-semibold text-slate-200 mb-3" }, `${qIndex + 1}. ${q.question}`),
        React.createElement('div', { className: "space-y-2" },
          q.options.map((option, oIndex) => (
            React.createElement('button', {
              key: oIndex,
              onClick: () => handleSelectAnswer(qIndex, option),
              disabled: isSubmitted,
              className: `w-full text-left p-3 rounded-md border transition-all duration-150 flex items-center justify-between ${getOptionClass(q, qIndex, option)}`
            },
              React.createElement('span', { className: "text-slate-300" }, option),
              isSubmitted && option === q.correctAnswer && React.createElement(CheckCircleIcon, { className: "h-5 w-5 text-green-400" }),
              isSubmitted && selectedAnswers[qIndex] === option && option !== q.correctAnswer && React.createElement(XCircleIcon, { className: "h-5 w-5 text-red-400" })
            )
          ))
        )
      )
    )),
    React.createElement('div', { className: "mt-6 flex justify-end" },
      !isSubmitted ? (
        React.createElement('button', {
          onClick: () => setIsSubmitted(true),
          disabled: !allAnswered,
          className: "px-6 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:bg-slate-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all"
        }, 'Submit Quiz')
      ) : (
        React.createElement('button', {
          onClick: () => {
            setIsSubmitted(false);
            setSelectedAnswers({});
          },
          className: "px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg shadow-sm hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-400 transition-colors"
        }, 'Try Again')
      )
    )
  );
};
