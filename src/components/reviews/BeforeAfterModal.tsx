"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, GripVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, assetPath } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  categoryConfig,
  type BeforeAfterCase,
  type CaseImage,
} from "@/data/before-after-cases";

interface BeforeAfterModalProps {
  caseItem: BeforeAfterCase | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BeforeAfterModal({ caseItem, isOpen, onClose }: BeforeAfterModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentAngleIndex, setCurrentAngleIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state when case changes
  useEffect(() => {
    if (caseItem) {
      setCurrentAngleIndex(0);
      setSliderPosition(50);
    }
  }, [caseItem]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Slider drag handler with ref for continuous drag
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  }, []);

  const handleSliderStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    updateSliderPosition(clientX);
  }, [updateSliderPosition]);

  // Global mouse/touch listeners for smooth dragging
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      updateSliderPosition(clientX);
    };

    const handleGlobalEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    // Always attach listeners when modal is open
    if (isOpen) {
      window.addEventListener('mouseup', handleGlobalEnd);
      window.addEventListener('touchend', handleGlobalEnd);
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('touchmove', handleGlobalMove, { passive: false });

      return () => {
        window.removeEventListener('mouseup', handleGlobalEnd);
        window.removeEventListener('touchend', handleGlobalEnd);
        window.removeEventListener('mousemove', handleGlobalMove);
        window.removeEventListener('touchmove', handleGlobalMove);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isOpen, updateSliderPosition]);

  // Navigation
  const goToNextAngle = () => {
    if (!caseItem) return;
    setCurrentAngleIndex((prev) => (prev + 1) % caseItem.images.length);
    setSliderPosition(50);
  };

  const goToPrevAngle = () => {
    if (!caseItem) return;
    setCurrentAngleIndex((prev) => (prev - 1 + caseItem.images.length) % caseItem.images.length);
    setSliderPosition(50);
  };

  if (!caseItem || !mounted) return null;

  const currentImage: CaseImage = caseItem.images[currentAngleIndex];
  const totalAngles = caseItem.images.length;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge
                  className={cn(
                    "text-xs font-medium text-white border-0",
                    categoryConfig[caseItem.category].color
                  )}
                >
                  {caseItem.procedureName}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {caseItem.areaLabel}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {/* Comparison Slider */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-lg bg-black select-none">
                {/* Navigation Arrows */}
                {totalAngles > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevAngle();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNextAngle();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Angle Badge */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-primary/90 backdrop-blur px-4 py-1.5 rounded-full">
                  <span className="text-sm text-white font-bold">
                    {currentImage.angleLabel}
                  </span>
                </div>

                {/* Progress Indicator */}
                {totalAngles > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {caseItem.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentAngleIndex(idx);
                          setSliderPosition(50);
                        }}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          idx === currentAngleIndex
                            ? "bg-primary w-6"
                            : "bg-white/40 hover:bg-white/60"
                        )}
                      />
                    ))}
                  </div>
                )}

                {/* After Image (Background) */}
                <div className="absolute inset-0">
                  <img
                    src={assetPath(currentImage.afterImage)}
                    alt="After"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/800x600/222/FFF?text=After";
                    }}
                  />
                  <div className="absolute top-14 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary border border-primary/30">
                    AFTER
                  </div>
                </div>

                {/* Before Image (Foreground - Clipped) */}
                <div
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src={assetPath(currentImage.beforeImage)}
                    alt="Before"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/800x600/333/FFF?text=Before";
                    }}
                  />
                  <div className="absolute top-14 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                    BEFORE
                  </div>
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center hover:bg-primary transition-colors z-20 touch-none"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  onMouseDown={handleSliderStart}
                  onTouchStart={handleSliderStart}
                >
                  <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-black border-2 border-primary">
                    <GripVertical className="w-5 h-5" />
                  </div>
                </div>

                {/* Interaction Layer */}
                <div
                  ref={sliderContainerRef}
                  className="absolute inset-0 z-10 cursor-ew-resize"
                  onMouseDown={handleSliderStart}
                  onTouchStart={handleSliderStart}
                />
              </div>

              {/* Angle Thumbnails (for quick navigation) */}
              {totalAngles > 1 && (
                <div className="flex gap-3 justify-center">
                  {caseItem.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentAngleIndex(idx);
                        setSliderPosition(50);
                      }}
                      className={cn(
                        "relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all",
                        idx === currentAngleIndex
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-border opacity-60 hover:opacity-100"
                      )}
                    >
                      <img
                        src={assetPath(img.afterImage)}
                        alt={img.angleLabel}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/100x80/222/FFF?text=Thumb";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1">
                        <span className="text-[10px] text-white font-medium">
                          {img.angleLabel}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Instructions */}
              <div className="text-center text-xs text-muted-foreground">
                슬라이더를 좌우로 드래그하여 비교해보세요
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
