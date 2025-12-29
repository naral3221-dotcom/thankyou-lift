"use client";

import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReviewSource } from "@/types";

interface UnifiedReviewCardProps {
  source: ReviewSource;
  images: string[];
  totalImages?: number; // Total image count for +N overlay
  title: string;
  author: string;
  tags: string[];
  rating?: number;
  date?: string;
  className?: string;
}

const SourceBadge = ({ source }: { source: ReviewSource }) => {
  const config = {
    HOMEPAGE: { label: "홈페이지", color: "bg-[#00C7AE] text-white" },
    NAVER_BLOG: { label: "블로그", color: "bg-[#03C75A] text-white" },
    NAVER_CAFE: { label: "카페", color: "bg-[#CA2026] text-white" },
    GANGNAM_UNNI: { label: "강남언니", color: "bg-[#FF515D] text-white" },
    BABITALK: { label: "바비톡", color: "bg-[#F75F88] text-white" },
  };

  const { label, color } = config[source];

  return (
    <span
      className={cn("px-2 py-0.5 text-[10px] font-bold rounded-sm", color)}
    >
      {label}
    </span>
  );
};

export function UnifiedReviewCard({
  source,
  images,
  totalImages,
  title,
  author,
  tags,
  rating = 5,
  date,
  className,
}: UnifiedReviewCardProps) {
  // Use first 3 unique images for display
  const displayImages = images.slice(0, 3);
  // Calculate remaining count from totalImages or images array
  const total = totalImages ?? images.length;
  const remainingCount = total > 3 ? total - 3 : 0;

  return (
    <Card
      className={cn(
        "overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group bg-card",
        className
      )}
    >
      {/* Image Grid Area - Fixed size 476x357 with responsive scaling */}
      <div
        className="w-full bg-muted/30 grid gap-0.5"
        style={{
          aspectRatio: '476 / 357',
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: '1fr',
        }}
      >
        {/* Main Large Image (Left) - 316.66 x 357 */}
        <div className="relative overflow-hidden">
          <img
            src={displayImages[0]}
            alt="Review Main"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Sub Images (Right, stacked) - each 157.33 x 177.5 */}
        <div className="grid grid-rows-2 gap-0.5">
          <div className="relative overflow-hidden">
            <img
              src={displayImages[1] || displayImages[0]}
              alt="Review Sub 1"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src={displayImages[2] || displayImages[0]}
              alt="Review Sub 2"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* More Overlay if there are extra images */}
            {remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-3">
        {/* Header: Badge & Rating */}
        <div className="flex items-center justify-between">
          <SourceBadge source={source} />
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < rating
                    ? "fill-[#FFB800] text-[#FFB800]"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Author & Title */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{author}</span>
            {date && <span>{date}</span>}
          </div>
          <h3 className="font-bold text-base leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-block px-2 py-1 bg-secondary/50 text-muted-foreground text-[10px] rounded-[4px] border border-transparent group-hover:border-border transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
