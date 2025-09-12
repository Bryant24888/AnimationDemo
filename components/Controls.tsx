
import React from 'react';

interface ControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onSuccess: () => void;
  onFail: () => void;
  isPaused: boolean;
  isPlaying: boolean;
}

const Button: React.FC<React.PropsWithChildren<{ onClick: () => void; className?: string }>> = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 cursor-pointer hover:border-slate-500 hover:bg-slate-700 transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);


const Controls: React.FC<ControlsProps> = ({ onPlay, onPause, onSuccess, onFail, isPaused, isPlaying }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={onPlay}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
        {isPlaying ? 'Replay' : 'Play'}
      </Button>
      <Button onClick={onPause}>
        {isPaused ? 
         (<><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>Resume</>) : 
         (<><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5A1.5 1.5 0 0 1 5.5 3.5zm4 0A1.5 1.5 0 0 1 11 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>Pause</>)
        }
      </Button>
      <Button onClick={onSuccess} className="text-green-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
        Trigger Success
      </Button>
      <Button onClick={onFail} className="text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
        Trigger Fail
      </Button>
    </div>
  );
};

export default Controls;
