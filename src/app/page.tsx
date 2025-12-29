"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TopBar } from "@/components/layout";
import { IntroSection } from "@/components/intro/IntroSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { AIMatchingSection } from "@/components/ai-matching/AIMatchingSection";
import { FooterSection } from "@/components/footer/FooterSection";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
      <AnimatePresence>
        {!introComplete && (
          <IntroSection onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      {/* Top Bar - appears after intro */}
      {introComplete && <TopBar />}

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="pt-14"
      >
        <HeroSection />
        <ReviewSection />
        <AIMatchingSection />
        <FooterSection />
      </motion.main>
    </div>
  );
}
