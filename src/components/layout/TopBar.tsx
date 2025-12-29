"use client";

import Image from "next/image";
import { Home, Phone, MessageCircle } from "lucide-react";
import { assetPath } from "@/lib/utils";

export function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center">
        {/* Left - Home Link (fixed width) */}
        <div className="w-24 flex justify-start">
          <a
            href="https://balancelab.kr/sub/lift09.php"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="홈페이지로 이동"
          >
            <Home className="w-5 h-5 text-gray-700" />
          </a>
        </div>

        {/* Center - Logo */}
        <h1 className="flex-1 flex justify-center">
          <Image
            src={assetPath("/images/logo/balancelab-logo_bl.webp")}
            alt="밸런스랩 로고"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </h1>

        {/* Right - Contact Links (fixed width, same as left) */}
        <div className="w-24 flex justify-end gap-1">
          <a
            href="tel:1661-8581"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="전화 상담"
          >
            <Phone className="w-5 h-5 text-gray-700" />
          </a>
          <a
            href="http://pf.kakao.com/_SSyxmxj/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="카카오톡 상담"
          >
            <MessageCircle className="w-5 h-5 text-gray-700" />
          </a>
        </div>
      </div>
    </header>
  );
}
