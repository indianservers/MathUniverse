import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

type UseProofPlaybackOptions = {
  totalSteps: number;
  intervalMs?: number;
  loop?: boolean;
};

export function useProofPlayback({ totalSteps, intervalMs = 1400, loop = false }: UseProofPlaybackOptions) {
  const reducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scrubToStep = useCallback(
    (stepIndex: number) => {
      setIsPlaying(false);
      setActiveStep(Math.max(0, Math.min(totalSteps - 1, stepIndex)));
    },
    [totalSteps],
  );

  const next = useCallback(() => {
    setActiveStep((step) => {
      if (step < totalSteps - 1) return step + 1;
      return loop ? 0 : step;
    });
  }, [loop, totalSteps]);

  const previous = useCallback(() => {
    setIsPlaying(false);
    setActiveStep((step) => Math.max(0, step - 1));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setActiveStep(0);
  }, []);

  const play = useCallback(() => {
    if (!reducedMotion) setIsPlaying(true);
  }, [reducedMotion]);

  const pause = useCallback(() => setIsPlaying(false), []);

  useEffect(() => {
    if (!isPlaying || reducedMotion || totalSteps <= 1) return;
    const timer = window.setInterval(() => {
      setActiveStep((step) => {
        if (step < totalSteps - 1) return step + 1;
        if (loop) return 0;
        setIsPlaying(false);
        return step;
      });
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, isPlaying, loop, reducedMotion, totalSteps]);

  return {
    activeStep,
    isPlaying,
    reducedMotion,
    canGoPrevious: activeStep > 0,
    canGoNext: activeStep < totalSteps - 1,
    play,
    pause,
    reset,
    previous,
    next,
    scrubToStep,
  };
}
