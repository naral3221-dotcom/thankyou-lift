"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Loader2 } from "lucide-react";
import { cn, assetPath } from "@/lib/utils";
import { fetchAllReviews, filterReviews, type ReviewItem, type Category } from "@/lib/sheets";
import { PhotoReviewCard } from "./PhotoReviewCard";
import { VideoReviewCard } from "./VideoReviewCard";
import { ReviewSlider } from "./ReviewSlider";
import { ReviewModal } from "./ReviewModal";
import { BeforeAfterGallery } from "./BeforeAfterGallery";

const tabs = [
  { id: "before-after", label: "전후사진" },
  { id: "home-review", label: "홈페이지리뷰" },
  { id: "blog-review", label: "블로그/카페" },
  { id: "app-review", label: "어플리뷰" },
  { id: "video-review", label: "영상리뷰" },
];

const categories: { id: Category; label: string }[] = [
  { id: "tv", label: "투명브이리프팅" },
  { id: "mini", label: "투명미니리프팅" },
  { id: "face", label: "안면거상/미니거상" },
];

export function ReviewSection() {
  const [activeTab, setActiveTab] = useState("before-after");
  const [activeCategory, setActiveCategory] = useState<Category>("tv");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchAllReviews();
      setReviews(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter reviews based on active tab and category
  const homepageReviews = filterReviews(reviews, "homepage", activeCategory);
  const blogReviews = filterReviews(reviews, ["blog", "cafe"], activeCategory);
  const appReviews = filterReviews(reviews, "app", activeCategory);
  const videoReviews = filterReviews(reviews, "video");

  const openReviewModal = (review: ReviewItem) => {
    setSelectedReview(review);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedReview(null);
  };

  // Show loading state
  if (loading) {
    return (
      <section id="reviews" className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">리뷰를 불러오는 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="min-h-screen bg-background pb-8 relative">
      <TabsPrimitive.Root
        defaultValue="before-after"
        className="w-full"
        onValueChange={setActiveTab}
      >
        {/* Sticky Tab Navigation */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b">
          <div className="max-w-5xl mx-auto overflow-x-auto scrollbar-hide">
            <TabsPrimitive.List className="flex w-full min-w-max md:justify-center h-14 px-4 md:px-0">
              {tabs.map((tab) => (
                <TabsPrimitive.Trigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "group relative flex items-center justify-center px-4 md:px-6 h-full text-sm font-medium transition-colors outline-none select-none cursor-pointer",
                    activeTab === tab.id
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="relative z-10">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </TabsPrimitive.Trigger>
              ))}
            </TabsPrimitive.List>
          </div>
        </div>

        {/* Category Sub-tabs (for homepage, blog, app) */}
        {["home-review", "blog-review", "app-review"].includes(activeTab) && (
          <div className="max-w-5xl mx-auto px-6 pt-6">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
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
          </div>
        )}

        {/* Tab Contents */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* 1. Before/After Photos - Real B&A Gallery */}
          <TabsPrimitive.Content
            value="before-after"
            className="outline-none animate-fade-in"
          >
            <BeforeAfterGallery />
          </TabsPrimitive.Content>

          {/* 2. Homepage Reviews - 2x2 Slider */}
          <TabsPrimitive.Content
            value="home-review"
            className="outline-none animate-fade-in"
          >
            <ReviewSlider reviews={homepageReviews} onCardClick={openReviewModal} />
          </TabsPrimitive.Content>

          {/* 3. Blog/Cafe Reviews - 2x2 Slider */}
          <TabsPrimitive.Content
            value="blog-review"
            className="outline-none animate-fade-in"
          >
            <ReviewSlider reviews={blogReviews} onCardClick={openReviewModal} />
          </TabsPrimitive.Content>

          {/* 4. App Reviews - 2x2 Slider */}
          <TabsPrimitive.Content
            value="app-review"
            className="outline-none animate-fade-in"
          >
            <ReviewSlider reviews={appReviews} onCardClick={openReviewModal} />
          </TabsPrimitive.Content>

          {/* 5. Video Reviews */}
          <TabsPrimitive.Content
            value="video-review"
            className="outline-none animate-fade-in"
          >
            {videoReviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                등록된 영상이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videoReviews.map((item) => (
                  <VideoReviewCard
                    key={item.no}
                    thumbnail={item.thumb || assetPath("/images/video-placeholder.webp")}
                    title={item.title}
                    duration="03:45"
                    views="1.2만회"
                    date={item.date || ""}
                  />
                ))}
              </div>
            )}
          </TabsPrimitive.Content>
        </div>
      </TabsPrimitive.Root>

      {/* Review Modal */}
      <ReviewModal
        review={selectedReview}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </section>
  );
}
