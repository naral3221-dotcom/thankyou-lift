"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, assetPath } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  beforeAfterCases,
  categoryConfig,
  tvSubFilters,
  type TreatmentCategory,
  type BeforeAfterCase,
} from "@/data/before-after-cases";
import { BeforeAfterModal } from "./BeforeAfterModal";

const ITEMS_PER_PAGE_MOBILE = 4; // 2x2
const ITEMS_PER_PAGE_DESKTOP = 6; // 3x2
const SWIPE_THRESHOLD = 50; // minimum swipe distance in pixels

// Custom hook for responsive items per page
function useItemsPerPage() {
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_MOBILE);

  useEffect(() => {
    const checkScreenSize = () => {
      // md breakpoint is 768px in Tailwind
      setItemsPerPage(window.innerWidth >= 768 ? ITEMS_PER_PAGE_DESKTOP : ITEMS_PER_PAGE_MOBILE);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return itemsPerPage;
}

// Custom hook for swipe gestures
function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      if (distance > 0) {
        // Swiped left -> next page
        onSwipeLeft();
      } else {
        // Swiped right -> previous page
        onSwipeRight();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }, [onSwipeLeft, onSwipeRight]);

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
}

// Main category tabs
const categoryTabs: { id: TreatmentCategory; label: string }[] = [
  { id: "tv", label: "투명브이리프팅" },
  { id: "mini", label: "투명미니리프팅" },
  { id: "face", label: "안면거상/미니거상" },
];

export function BeforeAfterGallery() {
  const [activeCategory, setActiveCategory] = useState<TreatmentCategory>("tv");
  const [activeTvFilter, setActiveTvFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState<BeforeAfterCase | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = useItemsPerPage();

  // Calculate totalPages early for swipe handlers
  const filteredCasesForSwipe = useMemo(() => {
    let cases = beforeAfterCases.filter((c) => c.category === activeCategory);
    if (activeCategory === "tv" && activeTvFilter !== "all") {
      // 부위별 필터링 (subFolder: mid, lower, combined)
      cases = cases.filter((c) => c.subFolder === activeTvFilter);
    }
    return cases;
  }, [activeCategory, activeTvFilter]);

  const totalPagesForSwipe = Math.ceil(filteredCasesForSwipe.length / itemsPerPage);

  // Swipe handlers
  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPagesForSwipe - 1 ? prev + 1 : prev));
  }, [totalPagesForSwipe]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe(
    goToNextPage,
    goToPrevPage
  );

  // Filter cases based on category and sub-filter
  const filteredCases = useMemo(() => {
    let cases = beforeAfterCases.filter((c) => c.category === activeCategory);

    // Apply TV sub-filter (부위별: mid, lower, combined)
    if (activeCategory === "tv" && activeTvFilter !== "all") {
      cases = cases.filter((c) => c.subFolder === activeTvFilter);
    }

    return cases;
  }, [activeCategory, activeTvFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const paginatedCases = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return filteredCases.slice(start, start + itemsPerPage);
  }, [filteredCases, currentPage, itemsPerPage]);

  // Reset page when items per page changes (screen resize)
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [itemsPerPage, totalPages, currentPage]);

  // Reset page when filter changes
  const handleCategoryChange = (cat: TreatmentCategory) => {
    setActiveCategory(cat);
    setCurrentPage(0);
    if (cat !== "tv") setActiveTvFilter("all");
  };

  const handleTvFilterChange = (filterId: string) => {
    setActiveTvFilter(filterId);
    setCurrentPage(0);
  };

  const openModal = (caseItem: BeforeAfterCase) => {
    setSelectedCase(caseItem);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCase(null);
  };

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
        {categoryTabs.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* TV Sub-filters (only shown when TV category is active) */}
      <AnimatePresence mode="wait">
        {activeCategory === "tv" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {tvSubFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleTvFilterChange(filter.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 border",
                    activeTvFilter === filter.id
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-background text-muted-foreground border-border hover:border-primary/20"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Case Grid - 2x2 on mobile, 3x2 on desktop with swipe support */}
      <div className="relative">
        {/* Left Arrow - PC only */}
        {totalPages > 1 && (
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className={cn(
              "hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-card shadow-lg border items-center justify-center transition-all",
              currentPage === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-primary hover:text-white hover:border-primary"
            )}
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        )}

        {/* Right Arrow - PC only */}
        {totalPages > 1 && (
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className={cn(
              "hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-card shadow-lg border items-center justify-center transition-all",
              currentPage === totalPages - 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-primary hover:text-white hover:border-primary"
            )}
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        )}

        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
        <AnimatePresence mode="popLayout">
          {paginatedCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <CaseCard caseItem={caseItem} onClick={() => openModal(caseItem)} />
            </motion.div>
          ))}
        </AnimatePresence>
        </div>
      </div>

      {/* Pagination Controls - Progress Bar Style */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center mt-8">
          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">{currentPage + 1}</span>
            <div className="w-32 h-1 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={false}
                animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{totalPages}</span>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === currentPage
                    ? "bg-primary w-6"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCases.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          해당 카테고리의 케이스가 없습니다.
        </div>
      )}

      {/* Modal */}
      <BeforeAfterModal
        caseItem={selectedCase}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

// Case Card Component
interface CaseCardProps {
  caseItem: BeforeAfterCase;
  onClick: () => void;
}

function CaseCard({ caseItem, onClick }: CaseCardProps) {
  const firstImage = caseItem.images[0];

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl bg-card border shadow-sm cursor-pointer hover:shadow-lg transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* Before/After Split Preview */}
        <div className="absolute inset-0 grid grid-cols-2">
          {/* Before Side */}
          <div className="relative overflow-hidden border-r border-white/20">
            <img
              src={assetPath(firstImage.beforeImage)}
              alt="Before"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/400x500/333/FFF?text=Before";
              }}
            />
            <div className="absolute bottom-2 left-2">
              <span className="text-[8px] md:text-[10px] font-bold text-white bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                BEFORE
              </span>
            </div>
          </div>

          {/* After Side */}
          <div className="relative overflow-hidden">
            <img
              src={assetPath(firstImage.afterImage)}
              alt="After"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/400x500/222/FFF?text=After";
              }}
            />
            <div className="absolute bottom-2 right-2">
              <span className="text-[8px] md:text-[10px] font-bold text-primary bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded border border-primary/30">
                AFTER
              </span>
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-white text-xs font-medium px-3 py-1.5 bg-primary/90 rounded-full">
            자세히 보기
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3">
        {/* Procedure Badge */}
        <div className="flex items-center gap-2 mb-1.5">
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] h-5 font-medium text-white border-0",
              categoryConfig[caseItem.category].color
            )}
          >
            {caseItem.procedureName}
          </Badge>
        </div>

        {/* Area Label & Case Number */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {caseItem.areaLabel || "-"}
          </span>
          <span className="text-muted-foreground font-mono">
            #{caseItem.id.split("-").pop()?.replace("case", "") || caseItem.caseNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
