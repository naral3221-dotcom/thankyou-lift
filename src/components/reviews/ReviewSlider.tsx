"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { extractImagesFromContent } from "@/lib/contentParser";
import { UnifiedReviewCard } from "./UnifiedReviewCard";
import type { ReviewItem } from "@/lib/sheets";
import type { ReviewSource } from "@/types";

interface ReviewSliderProps {
  reviews: ReviewItem[];
  onCardClick: (review: ReviewItem) => void;
}

// Convert sheet item to card props
function toReviewSource(item: ReviewItem): ReviewSource {
  if (item.tab === "homepage") return "HOMEPAGE";
  if (item.tab === "blog") return "NAVER_BLOG";
  if (item.tab === "cafe") return "NAVER_CAFE";
  if (item.badge?.includes("바비톡")) return "BABITALK";
  return "GANGNAM_UNNI";
}

// Split reviews into pages (4 items per page on desktop, 2 on mobile)
function chunkReviews(reviews: ReviewItem[], itemsPerPage: number): ReviewItem[][] {
  const chunks: ReviewItem[][] = [];
  for (let i = 0; i < reviews.length; i += itemsPerPage) {
    chunks.push(reviews.slice(i, i + itemsPerPage));
  }
  return chunks;
}

export function ReviewSlider({ reviews, onCardClick }: ReviewSliderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Items per page: 4 on desktop (2x2), 2 on mobile (1x2)
  const itemsPerPage = isMobile ? 2 : 4;
  const pages = chunkReviews(reviews, itemsPerPage);
  const totalPages = pages.length;

  // Reset page when reviews change
  useEffect(() => {
    setCurrentPage(0);
  }, [reviews]);

  // Handle scroll
  const handleScroll = useCallback(() => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const width = sliderRef.current.clientWidth;
    const newPage = Math.round(scrollLeft / width);
    setCurrentPage(Math.max(0, Math.min(newPage, totalPages - 1)));
  }, [totalPages]);

  // Scroll to page
  const scrollToPage = (page: number) => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    sliderRef.current.scrollTo({
      left: width * page,
      behavior: "smooth",
    });
  };

  const goToPrev = () => {
    if (currentPage > 0) {
      scrollToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages - 1) {
      scrollToPage(currentPage + 1);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        등록된 후기가 없습니다.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {totalPages > 1 && (
        <>
          <button
            onClick={goToPrev}
            disabled={currentPage === 0}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-card shadow-lg border flex items-center justify-center transition-all",
              currentPage === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-secondary hover:scale-110"
            )}
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages - 1}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-card shadow-lg border flex items-center justify-center transition-all",
              currentPage === totalPages - 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-secondary hover:scale-110"
            )}
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </>
      )}

      {/* Slider Container */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex" style={{ width: `${totalPages * 100}%` }}>
          {pages.map((page, pageIdx) => (
            <div
              key={pageIdx}
              className="snap-start snap-always flex-shrink-0"
              style={{ width: `${100 / totalPages}%` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {page.map((item) => {
                  // Extract all images from content
                  const allImages = extractImagesFromContent(item.html);
                  // Add thumb as fallback if no images found
                  if (allImages.length === 0 && item.thumb) allImages.push(item.thumb);

                  // Get first 3 unique images for display
                  const displayImages = allImages.slice(0, 3);
                  const totalImageCount = allImages.length;

                  return (
                    <div
                      key={item.no}
                      onClick={() => onCardClick(item)}
                      className="cursor-pointer"
                    >
                      <UnifiedReviewCard
                        source={toReviewSource(item)}
                        images={displayImages}
                        totalImages={totalImageCount}
                        title={item.plan || item.title || "리얼 후기"}
                        author={item.author || "익명"}
                        tags={item.tags?.split(",").map((t) => t.trim().replace("#", "")) || []}
                        rating={(item.star?.match(/★/g) || []).length || 5}
                        date={item.date}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Indicator */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          {/* Progress Bar Style */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">
              {currentPage + 1}
            </span>
            <div className="w-32 h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {totalPages}
            </span>
          </div>
        </div>
      )}

      {/* Dot Indicators (for smaller number of pages) */}
      {totalPages > 1 && totalPages <= 10 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToPage(idx)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === currentPage
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
