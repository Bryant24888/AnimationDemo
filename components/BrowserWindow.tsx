
import React from 'react';
import { AnimationState } from '../types';

interface BrowserWindowProps {
  state: AnimationState;
  typedText: string;
  contentRef: React.RefObject<HTMLDivElement>;
  highlightRef: React.RefObject<HTMLDivElement>;
}

const TrafficLights: React.FC = () => (
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
    <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
  </div>
);

const BlinkingCursor: React.FC = () => (
  <span className="inline-block w-0.5 h-4 bg-slate-400 animate-pulse ml-0.5"></span>
);

const SkeletonCard: React.FC<React.PropsWithChildren<{ id?: string; className?: string }>> = ({ id, className, children }) => (
    <div className="p-7">
        <div id={id} className={`bg-slate-800 border border-slate-700 rounded-2xl p-5 ${className}`}>
            {children}
        </div>
    </div>
);

const SkeletonElement: React.FC<{ id?: string; className?: string }> = ({ id, className }) => (
    <div id={id} className={`animate-shimmer rounded-lg bg-slate-700 ${className}`}></div>
);

const BrowserWindow: React.FC<BrowserWindowProps> = ({ state, typedText, contentRef, highlightRef }) => {
  const isWindowVisible = state >= AnimationState.PoppingUp;
  const isContentVisible = state >= AnimationState.FadingInContent;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`w-full h-full transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isWindowVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="flex flex-col w-full h-full bg-slate-950 border border-slate-700 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
              {/* Unified Top Bar */}
              <div className="flex items-center gap-2 p-3 border-b border-slate-700/80">
                  <TrafficLights />
                  <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-slate-400 text-sm min-h-[28px]">
                      <span>{typedText}</span>
                      {state === AnimationState.Typing && <BlinkingCursor />}
                  </div>
              </div>

              {/* Scrollable Content */}
              <div ref={contentRef} className={`relative flex-1 overflow-y-auto transition-opacity duration-300 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
                 <SkeletonCard>
                    <SkeletonElement id="sec-hero" className="h-20 mb-4" />
                    <SkeletonElement className="h-5 mb-2.5" />
                    <SkeletonElement className="h-5 w-3/4" />
                 </SkeletonCard>
                 <SkeletonCard>
                    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5">
                        <SkeletonElement id="sec-thumb" className="h-40" />
                        <div>
                            <SkeletonElement id="sec-l1" className="h-5 mb-2.5" />
                            <SkeletonElement id="sec-l2" className="h-5 mb-2.5" />
                            <SkeletonElement id="sec-l3" className="h-5 w-3/4 mb-2.5" />
                            <SkeletonElement id="sec-l4" className="h-5" />
                        </div>
                    </div>
                 </SkeletonCard>
                 <div className="h-[420px]"></div>
                  <SkeletonCard>
                      <SkeletonElement id="sec-footer" className="h-5 mb-2.5" />
                      <SkeletonElement className="h-5 mb-2.5" />
                      <SkeletonElement className="h-5" />
                  </SkeletonCard>
                 <div className="h-[420px]"></div>
                 <div ref={highlightRef} className="absolute border-2 border-blue-400 rounded-xl shadow-lg shadow-blue-500/20 opacity-0 transition-all duration-300 pointer-events-none"></div>
              </div>
          </div>
        </div>
    </div>
  );
};

export default BrowserWindow;
