"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";
import { assetPath } from "@/lib/utils";

const backgroundImages = [
  assetPath("/images/main/background-background-1.webp"),
  assetPath("/images/main/background-background-2.webp"),
  assetPath("/images/main/background-background-3.webp"),
  assetPath("/images/main/background-background-4.webp"),
  assetPath("/images/main/background-background-5.webp"),
  assetPath("/images/main/background-background-6.webp"),
  assetPath("/images/main/background-background-7.webp"),
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // 5초마다 전환

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20 relative overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backgroundImages[currentSlide]})`,
            }}
          />
        </AnimatePresence>
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-white/60" />
      </div>

      {/* Background Gradient (on top of slideshow) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30 pointer-events-none z-[1]" />

      {/* Floating Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-20 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl z-[1]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-20 left-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl z-[1]"
      />

      {/* Main Content */}
      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white border border-accent mb-8 shadow-md"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">예약해주셔서 감사합니다</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
        >
          <span className="text-primary">자연스러운 변화</span>
          <br />
          <span className="text-gray-800">믿을 수 있는 결과</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-gray-700 mb-12 max-w-xl mx-auto space-y-2"
        >
          <p>리프팅 상담을 예약하신 고객님께만 드리는 안내입니다.</p>
          <p>본원 케이스와 후기를 통해 보다 신뢰도 높은 상담 준비를 도와드리겠습니다.</p>
          <p className="text-sm text-gray-500">※ 예약 고객 전용 페이지입니다.</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-3 gap-4 max-w-md mx-auto bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">15,379+</div>
            <div className="text-sm text-gray-600">누적 시술</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">4.9</div>
            <div className="text-sm text-gray-600">평균 평점</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">98%</div>
            <div className="text-sm text-gray-600">만족도</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
