"use client";

import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VideoReviewCardProps {
  thumbnail: string;
  title: string;
  duration: string;
  views: string;
  date: string;
  className?: string;
}

export function VideoReviewCard({
  thumbnail,
  title,
  duration,
  views,
  date,
  className,
}: VideoReviewCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer bg-card",
        className
      )}
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-primary fill-primary ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2">
          <Badge
            variant="secondary"
            className="bg-black/70 text-white border-0 text-[10px]"
          >
            {duration}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <h3 className="font-bold text-base leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>조회수 {views}</span>
          <span>{date}</span>
        </div>
      </div>
    </Card>
  );
}
