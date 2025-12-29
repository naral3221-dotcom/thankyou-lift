"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Star } from "lucide-react";
import { parseReviewContent } from "@/lib/contentParser";
import { cn } from "@/lib/utils";
import type { ReviewItem } from "@/lib/sheets";

interface ReviewModalProps {
  review: ReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// Badge config by source
const getBadgeConfig = (review: ReviewItem) => {
  const badge = review.badge?.toUpperCase() || "";

  if (review.tab === "homepage") {
    return { text: "홈페이지", className: "bg-emerald-500 text-white" };
  }

  if (review.tab === "blog" || review.tab === "cafe") {
    // Check if cafe
    const isCafe =
      review.tab === "cafe" ||
      badge.includes("카페") ||
      badge.includes("여우야") ||
      badge.includes("성예사") ||
      badge.includes("CAFE");

    if (isCafe) {
      if (badge.includes("A+") || badge.includes("성예사")) {
        return { text: review.badge || "A+ 카페", className: "bg-pink-500 text-white" };
      }
      return { text: review.badge || "NAVER CAFE", className: "bg-yellow-500 text-white" };
    }

    return { text: "NAVER BLOG", className: "bg-green-500 text-white" };
  }

  if (review.tab === "app") {
    if (badge.includes("바비톡")) {
      return {
        text: review.badge || "바비톡",
        className: "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white",
      };
    }
    return {
      text: review.badge || "강남언니",
      className: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    };
  }

  if (review.tab === "video") {
    return { text: "영상 리뷰", className: "bg-red-500 text-white" };
  }

  return { text: review.badge || "리뷰", className: "bg-gray-500 text-white" };
};

export function ReviewModal({ review, isOpen, onClose }: ReviewModalProps) {
  const [mounted, setMounted] = useState(false);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!review || !mounted) return null;

  const badgeConfig = getBadgeConfig(review);
  const starCount = (review.star?.match(/★/g) || []).length || 5;
  const content = parseReviewContent(review.html);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[85vh] bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card border-b px-6 py-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Badge */}
              <span
                className={cn(
                  "inline-block px-3 py-1 text-xs font-bold rounded-full mb-3",
                  badgeConfig.className
                )}
              >
                {badgeConfig.text}
              </span>

              {/* Title */}
              <h2 className="text-xl font-bold text-foreground pr-8 leading-tight">
                {review.title || review.plan || "리얼 후기"}
              </h2>

              {/* Meta */}
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span>{review.author || "익명"}</span>
                {review.date && (
                  <>
                    <span>·</span>
                    <span>{review.date}</span>
                  </>
                )}
                <div className="flex gap-0.5 ml-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < starCount
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="prose prose-sm max-w-none">
                {content}
              </div>

              {/* Tags */}
              {review.tags && (
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
                  {review.tags.split(",").map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-secondary text-muted-foreground rounded-full"
                    >
                      #{tag.trim().replace("#", "")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
