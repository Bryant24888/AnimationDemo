import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimationState } from './types';
import Controls from './components/Controls';
import BrowserWindow from './components/BrowserWindow';
import ResultScene from './components/ResultScene';

// Helper function to get an element's offset relative to a specific parent container.
const getOffsetRelativeToParent = (element: HTMLElement, parent: HTMLElement) => {
  let top = 0;
  let left = 0;
  let el: HTMLElement | null = element;
  while (el && el !== parent) {
    top += el.offsetTop;
    left += el.offsetLeft;
    el = el.offsetParent as HTMLElement | null;
  }
  return { top, left };
};


const App: React.FC = () => {
  const [animationState, setAnimationState] = useState<AnimationState>(AnimationState.Idle);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const timeoutIds = useRef<number[]>([]);

  const cleanup = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, []);

  const reset = useCallback(() => {
    cleanup();
    setAnimationState(AnimationState.Idle);
    setIsPaused(false);
    setTypedText('');
    setIsThinking(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
    if (highlightRef.current) {
      highlightRef.current.style.opacity = '0';
    }
  }, [cleanup]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  // Use refs for state inside async loops to get the latest value
  const animationStateRef = useRef(animationState);
  animationStateRef.current = animationState;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const runTypingAnimation = useCallback(async () => {
    const targetText = 'scsfjt.com 集团新闻';
    for (let i = 0; i < targetText.length; i++) {
      if (animationStateRef.current !== AnimationState.Typing) return;
      while (isPausedRef.current) await new Promise(res => setTimeout(res, 100));
      setTypedText(targetText.substring(0, i + 1));
      await new Promise(res => timeoutIds.current.push(setTimeout(res, Math.random() * 80 + 50)));
    }
    await new Promise(res => timeoutIds.current.push(setTimeout(res, 500)));
    if (animationStateRef.current === AnimationState.Typing) {
        setAnimationState(AnimationState.Searching);
    }
  }, []);
  
  const smoothScroll = useCallback((targetY: number) => {
    if (!contentRef.current) return;
    const startY = contentRef.current.scrollTop;
    const distance = targetY - startY;
    let startTime: number | null = null;
    const duration = 800;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const easedProgress = ease(Math.min(progress / duration, 1));
      
      if (contentRef.current) {
        contentRef.current.scrollTop = startY + distance * easedProgress;
      }

      if (progress < duration && animationStateRef.current === AnimationState.Searching && !isPausedRef.current) {
        animationFrameId.current = requestAnimationFrame(step);
      }
    };
    animationFrameId.current = requestAnimationFrame(step);
  }, []);


  const runSearchingAnimation = useCallback(async () => {
    const elementsToHighlight = ['#sec-hero', '#sec-thumb', '#sec-l1', '#sec-l2', '#sec-l3', '#sec-sq1', '#sec-sq2', '#sec-gallery', '#sec-footer'];
    const contentEl = contentRef.current;
    const highlightEl = highlightRef.current;

    if (!contentEl || !highlightEl) return;

    for (const selector of elementsToHighlight) {
      if (animationStateRef.current !== AnimationState.Searching) return;
      while (isPausedRef.current) await new Promise(res => timeoutIds.current.push(setTimeout(res, 100)));

      const targetEl = contentEl.querySelector<HTMLElement>(selector);
      if (targetEl) {
        const { top, left } = getOffsetRelativeToParent(targetEl, contentEl);
        const targetScrollY = top - contentEl.clientHeight / 3;
        smoothScroll(targetScrollY);
        await new Promise(res => timeoutIds.current.push(setTimeout(res, 800)));
        
        Object.assign(highlightEl.style, {
          left: `${left - 8}px`,
          top: `${top - 8}px`,
          width: `${targetEl.offsetWidth + 16}px`,
          height: `${targetEl.offsetHeight + 16}px`,
          opacity: '1'
        });
        await new Promise(res => timeoutIds.current.push(setTimeout(res, 480)));
      }
    }

    if (animationStateRef.current === AnimationState.Searching) {
      setIsThinking(true);
    }
  }, [smoothScroll]);
  
  useEffect(() => {
    const handleStateChange = async () => {
      if (animationState === AnimationState.PoppingUp) {
        await new Promise(res => timeoutIds.current.push(setTimeout(res, 1100)));
        if(animationStateRef.current === AnimationState.PoppingUp) setAnimationState(AnimationState.FadingInContent);
      } else if (animationState === AnimationState.FadingInContent) {
        await new Promise(res => timeoutIds.current.push(setTimeout(res, 400)));
        if(animationStateRef.current === AnimationState.FadingInContent) setAnimationState(AnimationState.Typing);
      } else if (animationState === AnimationState.Typing) {
        runTypingAnimation();
      } else if (animationState === AnimationState.Searching) {
        runSearchingAnimation();
      }
    };
    handleStateChange();
  }, [animationState, runTypingAnimation, runSearchingAnimation]);

  const handlePlay = () => {
    reset();
    setTimeout(() => setAnimationState(AnimationState.PoppingUp), 100);
  };

  const handlePause = () => setIsPaused(p => !p);
  
  const isPlaying = animationState > AnimationState.Idle && animationState < AnimationState.Success;
  
  const handleSuccess = () => {
    if (isPlaying) {
      cleanup();
      setIsThinking(false);
      setAnimationState(AnimationState.Success);
    }
  };

  const handleFail = () => {
    if (isPlaying) {
      cleanup();
      setIsThinking(false);
      setAnimationState(AnimationState.Fail);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 font-sans text-slate-200">
      <div className="w-full max-w-5xl mx-auto">
        <Controls
          onPlay={handlePlay}
          onPause={handlePause}
          onSuccess={handleSuccess}
          onFail={handleFail}
          isPaused={isPaused}
          isPlaying={isPlaying}
          canTriggerResult={isPlaying || isThinking}
        />
        <div className="relative w-full h-[75vh] min-h-[680px] mt-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            <BrowserWindow
                state={animationState}
                typedText={typedText}
                contentRef={contentRef}
                highlightRef={highlightRef}
                isThinking={isThinking}
            />
            {(animationState === AnimationState.Success || animationState === AnimationState.Fail) && (
                <ResultScene variant={animationState === AnimationState.Success ? 'success' : 'fail'} />
            )}
        </div>
      </div>
    </div>
  );
};

export default App;