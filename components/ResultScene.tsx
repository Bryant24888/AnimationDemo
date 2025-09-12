
import React, { useState, useEffect } from 'react';

interface ResultSceneProps {
  variant: 'success' | 'fail';
}

const ResultScene: React.FC<ResultSceneProps> = ({ variant }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsAnimating(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const config = {
    success: {
      icon: '✓',
      title: 'Search Successful',
      message: 'The required results have been found.',
      iconClass: 'text-green-400',
    },
    fail: {
      icon: '✕',
      title: 'Search Failed',
      message: 'No relevant results were found.',
      iconClass: 'text-red-400',
    },
  }[variant];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-300">
      <div
        className={`text-7xl font-light border-4 rounded-full w-28 h-28 flex items-center justify-center transition-all duration-500 ease-out ${config.iconClass} ${isAnimating ? 'scale-100 opacity-100 border-opacity-100' : 'scale-50 opacity-0 border-opacity-0'}`}
        style={{ borderColor: 'currentColor' }}
      >
        {config.icon}
      </div>
      <h2 className={`mt-6 text-3xl font-bold transition-all duration-500 delay-100 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {config.title}
      </h2>
      <p className={`mt-2 text-slate-400 transition-all duration-500 delay-200 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {config.message}
      </p>
    </div>
  );
};

export default ResultScene;
