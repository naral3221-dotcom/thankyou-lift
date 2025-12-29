"use client";

import { Badge } from "@/components/ui/badge";

interface PhotoReviewCardProps {
  beforeImage: string;
  afterImage: string;
  date: string;
  procedure: string;
  caseId: number;
}

export function PhotoReviewCard({
  beforeImage,
  afterImage,
  date,
  procedure,
  caseId,
}: PhotoReviewCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-card border shadow-sm cursor-pointer hover:shadow-md transition-all">
      <div className="grid grid-cols-2 h-40 md:h-48">
        <div className="relative border-r border-white/20">
          <img
            src={beforeImage}
            alt="Before"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2">
            <Badge
              variant="secondary"
              className="h-5 px-1.5 text-[10px] bg-black/50 text-white border-0 backdrop-blur-sm"
            >
              Before
            </Badge>
          </div>
        </div>
        <div className="relative">
          <img
            src={afterImage}
            alt="After"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2">
            <Badge className="h-5 px-1.5 text-[10px] opacity-90">After</Badge>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <Badge variant="outline" className="text-[10px] h-5 font-normal">
            {procedure}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            CASE #{caseId}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{date}</span>
          <span className="text-primary text-[10px] font-medium group-hover:underline">
            자세히 보기
          </span>
        </div>
      </div>
    </div>
  );
}
