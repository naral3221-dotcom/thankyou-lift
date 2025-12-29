"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { assetPath } from "@/lib/utils";

interface IntroSectionProps {
  onComplete: () => void;
}

export function IntroSection({ onComplete }: IntroSectionProps) {
  const [hasVisited, setHasVisited, isLoaded] = useLocalStorage("lifting_visited", false);
  const [progress, setProgress] = useState(0);
  const [shouldShow, setShouldShow] = useState(true);

  const handleComplete = useCallback(() => {
    setHasVisited(true);
    setShouldShow(false);
    setTimeout(onComplete, 300);
  }, [setHasVisited, onComplete]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  // Auto-skip for returning visitors
  useEffect(() => {
    if (isLoaded && hasVisited) {
      setShouldShow(false);
      onComplete();
    }
  }, [isLoaded, hasVisited, onComplete]);

  // Progress animation (3 seconds)
  useEffect(() => {
    if (!shouldShow || !isLoaded) return;

    const duration = 3000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        handleComplete();
      }
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [shouldShow, isLoaded, handleComplete]);

  // Don't render if already visited or not loaded
  if (!isLoaded || !shouldShow) return null;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        >
          {/* Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.img
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              src={assetPath("/images/logo/balancelab-logo_bl.webp")}
              alt="밸런스랩 로고"
              width={160}
              height={43}
              className="h-10 w-auto mx-auto mb-6"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-muted-foreground text-sm"
            >
              자연스러운 아름다움을 위한 여정
            </motion.p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "200px" }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="mb-8"
          >
            <div className="w-full h-1 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>

          {/* Skip Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              건너뛰기
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
