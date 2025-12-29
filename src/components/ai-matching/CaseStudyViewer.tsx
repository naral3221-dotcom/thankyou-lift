"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Loader2, GripVertical } from "lucide-react";
import { cn, assetPath } from "@/lib/utils";
import type { MatchingResult, AreaFocus } from "@/lib/ai-matching";
import { aiCaseStudies, type AICase, type CaseImage } from "@/data/ai-cases";
import { fetchAllReviews, type ReviewItem, Category, filterReviews } from "@/lib/sheets";
import { ReviewModal } from "@/components/reviews/ReviewModal";

interface CaseStudyViewerProps {
    result: MatchingResult;
}

// 부위 매칭 우선순위 함수
function getAreaMatchScore(caseArea: AreaFocus | undefined, userArea: AreaFocus): number {
    if (!caseArea) return 1;
    if (caseArea === userArea) return 3;

    if (caseArea === 'combined' || caseArea === 'midLower') {
        if (userArea === 'midFace' || userArea === 'lowerFace' || userArea === 'midLower' || userArea === 'combined') return 2;
    }

    if (caseArea === 'midFace') {
        if (userArea === 'midLower' || userArea === 'combined') return 2;
    }

    if (caseArea === 'lowerFace') {
        if (userArea === 'midLower' || userArea === 'lowerNeck' || userArea === 'combined') return 2;
    }

    return 0;
}

// 평탄화된 이미지 아이템 타입
type FlattenedImage = CaseImage & {
    caseId: string;
    caseNumber: number;
    caseDescription: string;
};

export function CaseStudyViewer({ result }: CaseStudyViewerProps) {
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);

    // Mouse drag scroll for reviews
    const reviewsScrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!reviewsScrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - reviewsScrollRef.current.offsetLeft);
        setScrollLeft(reviewsScrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !reviewsScrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - reviewsScrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        reviewsScrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // Determine Case Data Group
    const rawLevelName = result.mainProcedure.levelName.replace(" + PLUS", "");
    const caseGroup = aiCaseStudies[rawLevelName] || aiCaseStudies["6+6 STANDARD"];

    // 사용자 부위 분석 결과
    const userAreaFocus = result.areaAnalysis.focus;

    // Level 4 (12+12 STRONG)는 combined만 있으므로 부위 정렬 스킵
    const isLevel4 = rawLevelName === "12+12 STRONG";

    // 부위 매칭 기반으로 케이스 정렬 후, 모든 이미지를 평탄화
    const flattenedImages = useMemo(() => {
        const cases = caseGroup.cases || [];

        // Level 4는 combined만 있으므로 정렬 없이 그대로 사용
        // 그 외 레벨은 부위 매칭 점수로 정렬
        const sortedCases = isLevel4
            ? cases
            : [...cases].sort((a, b) => {
                const scoreA = getAreaMatchScore(a.areaFocus, userAreaFocus);
                const scoreB = getAreaMatchScore(b.areaFocus, userAreaFocus);
                return scoreB - scoreA;
            });

        // 케이스별로 이미지 평탄화: case1(정면) → case1(반측면) → case1(측면) → case2(정면)...
        const images: FlattenedImage[] = [];
        sortedCases.forEach(caseItem => {
            caseItem.images.forEach(img => {
                images.push({
                    ...img,
                    caseId: caseItem.id,
                    caseNumber: caseItem.caseNumber,
                    caseDescription: caseItem.description
                });
            });
        });

        return images;
    }, [caseGroup.cases, userAreaFocus, isLevel4]);

    const currentImage = flattenedImages[currentImageIndex] || flattenedImages[0];
    const totalImages = flattenedImages.length;

    // Navigation Logic
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
        setSliderPosition(50);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
        setSliderPosition(50);
    };

    // Category Mapping
    let reviewCategory: Category = 'tv';
    if (rawLevelName.includes("LIGHT") || rawLevelName.includes("STANDARD") || rawLevelName.includes("STRONG") || rawLevelName.includes("INTENSIVE")) {
        reviewCategory = 'tv';
    } else if (rawLevelName.includes("DEEP") || rawLevelName.includes("하안면") || rawLevelName.includes("미니거상")) {
        reviewCategory = 'mini';
    } else if (rawLevelName.includes("FULL") || rawLevelName.includes("안면거상")) {
        reviewCategory = 'face';
    }

    // Fetch matched reviews
    useEffect(() => {
        async function loadReviews() {
            setLoading(true);
            try {
                const allReviews = await fetchAllReviews();
                const matched = filterReviews(allReviews, ['homepage', 'blog', 'app'], reviewCategory)
                    .slice(0, 20);
                setReviews(matched);
            } catch (e) {
                console.error("Failed to load reviews", e);
            } finally {
                setLoading(false);
            }
        }
        loadReviews();
    }, [reviewCategory]);

    // Image Slider Logic - ref for continuous drag
    const sliderContainerRef = useRef<HTMLDivElement>(null);
    const isSliderDraggingRef = useRef(false);

    const updateSliderPosition = useCallback((clientX: number) => {
        if (!sliderContainerRef.current) return;
        const rect = sliderContainerRef.current.getBoundingClientRect();
        const position = ((clientX - rect.left) / rect.width) * 100;
        setSliderPosition(Math.min(Math.max(position, 0), 100));
    }, []);

    const handleSliderStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        isSliderDraggingRef.current = true;
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        updateSliderPosition(clientX);
    }, [updateSliderPosition]);

    // Global mouse/touch listeners for smooth dragging
    useEffect(() => {
        const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
            if (!isSliderDraggingRef.current) return;
            e.preventDefault();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            updateSliderPosition(clientX);
        };

        const handleGlobalEnd = () => {
            if (isSliderDraggingRef.current) {
                isSliderDraggingRef.current = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        };

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
    }, [updateSliderPosition]);

    // Reset slider when image changes
    useEffect(() => {
        setSliderPosition(50);
    }, [currentImageIndex]);

    // Preload adjacent images to eliminate loading delay
    useEffect(() => {
        if (flattenedImages.length === 0) return;

        // Preload current, previous, and next images
        const indicesToPreload = [
            currentImageIndex,
            (currentImageIndex + 1) % totalImages,
            (currentImageIndex - 1 + totalImages) % totalImages,
            // Also preload 2 images ahead for smoother experience
            (currentImageIndex + 2) % totalImages,
        ];

        indicesToPreload.forEach((index) => {
            const image = flattenedImages[index];
            if (image) {
                // Preload before image
                const beforeImg = new Image();
                beforeImg.src = assetPath(image.beforeImage);

                // Preload after image
                const afterImg = new Image();
                afterImg.src = assetPath(image.afterImage);
            }
        });
    }, [currentImageIndex, flattenedImages, totalImages]);

    if (!currentImage) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
                케이스 이미지를 준비 중입니다...
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col gap-6 p-1 max-w-full overflow-hidden">

            {/* 1. B&A Comparison Viewer */}
            <div className="flex flex-col gap-3">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a] group select-none shrink-0">

                    {/* Navigation Arrows */}
                    {totalImages > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Progress indicator */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur px-3 py-1 rounded-full">
                                <span className="text-[10px] text-white font-medium">
                                    {currentImageIndex + 1} / {totalImages}
                                </span>
                            </div>
                        </>
                    )}

                    {/* Angle Badge */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-primary/90 backdrop-blur px-3 py-1 rounded-full">
                        <span className="text-[10px] text-white font-bold">
                            {currentImage.angleLabel}
                        </span>
                    </div>

                    {/* After Image (Background) */}
                    <div className="absolute inset-0">
                        <img
                            src={assetPath(currentImage.afterImage)}
                            alt="After"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/800x600/222/FFF?text=After"; }}
                        />
                        <div className="absolute top-12 right-3 bg-black/60 backdrop-blur px-2.5 py-0.5 rounded-full text-[10px] font-bold text-primary border border-primary/30">
                            AFTER
                        </div>
                    </div>

                    {/* Before Image (Foreground - Clipped) */}
                    <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                        <img
                            src={assetPath(currentImage.beforeImage)}
                            alt="Before"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/800x600/333/FFF?text=Before"; }}
                        />
                        <div className="absolute top-12 left-3 bg-black/60 backdrop-blur px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/20">
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
                        <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-black">
                            <GripVertical className="w-4 h-4" />
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

                {/* Description */}
                <div className="px-1 text-center">
                    <h4 className="text-white font-bold text-sm mb-0.5">{currentImage.caseDescription}</h4>
                    <p className="text-gray-300 text-xs">
                        Case {currentImage.caseNumber} · {caseGroup.levelName}
                    </p>
                </div>
            </div>

            {/* 2. Matched Reviews (Horizontal Slider) */}
            <div className="w-full min-w-0 max-w-full min-h-[140px] relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="p-1.5 rounded-full bg-primary/10">
                        <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    </div>
                    <h5 className="text-white font-bold text-sm">관련 실제 후기</h5>
                    <span className="text-xs text-gray-400 ml-auto">옆으로 넘겨서 확인 ▶</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-32 rounded-xl bg-white/5 border border-white/10">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : reviews.length > 0 ? (
                    <div
                        ref={reviewsScrollRef}
                        className={cn(
                            "flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide touch-pan-x",
                            isDragging ? "cursor-grabbing" : "cursor-grab"
                        )}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                    >
                        {reviews.map((review, i) => (
                            <div
                                key={i}
                                className="w-[280px] sm:w-[320px] shrink-0 snap-center flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer select-none"
                                onClick={() => !isDragging && setSelectedReview(review)}
                            >
                                {/* Header: Badges */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-primary border border-primary/30 px-1.5 py-0.5 rounded bg-primary/5">
                                            {result.mainProcedure.name}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] px-1.5 py-0.5 rounded text-white",
                                            review.tab === 'blog' ? "bg-green-600" :
                                                review.tab === 'cafe' ? "bg-red-500" :
                                                    review.badge?.includes('바비톡') ? "bg-pink-500" :
                                                        "bg-gray-500"
                                        )}>
                                            {review.badge || (review.tab === 'blog' ? '블로그' : '카페')}
                                        </span>
                                    </div>
                                    <Quote className="w-4 h-4 text-white/20" />
                                </div>

                                {/* Content: Thumb & Tags */}
                                <div className="flex gap-3 items-center">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-700">
                                        <img
                                            src={review.thumb && review.thumb.trim() !== "" ? review.thumb : assetPath("/images/video-placeholder.webp")}
                                            className="w-full h-full object-cover"
                                            alt="Review User"
                                            onError={(e) => {
                                                const target = e.currentTarget;
                                                const fallback = assetPath("/images/video-placeholder.webp");
                                                if (!target.src.endsWith("/images/video-placeholder.webp")) {
                                                    target.src = fallback;
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-gray-200 font-medium line-clamp-1 mb-1.5 leading-snug">
                                            {review.title || "리얼 후기 내용 확인하기"}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {review.tags ? review.tags.split(',').slice(0, 2).map((tag, idx) => (
                                                <span key={idx} className="text-[10px] text-gray-300 bg-black/30 px-1.5 py-0.5 rounded">#{tag.trim()}</span>
                                            )) : <span className="text-[10px] text-gray-300">#리얼후기</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-xs text-gray-400 py-10 rounded-xl bg-white/5 border border-white/10">
                        관련 후기를 찾고 있습니다...
                    </div>
                )}
            </div>

            {/* Review Popup Modal */}
            <ReviewModal
                review={selectedReview}
                isOpen={!!selectedReview}
                onClose={() => setSelectedReview(null)}
            />

        </div>
    );
}
