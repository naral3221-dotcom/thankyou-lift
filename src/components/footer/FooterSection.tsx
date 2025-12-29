"use client";

import { MapPin, Phone, Clock, Instagram } from "lucide-react";

// TikTok 아이콘 컴포넌트
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function FooterSection() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-4">밸런스랩성형외과</div>
            <p className="text-background/70 text-sm leading-relaxed">
              오래 유지 되는 건강한 아름다움
              <br />
              예쁜 당신이 더 오래 유지되는 곳
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">오시는 길</h4>
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  서울시 강남구 도산대로 109,
                  <br />
                  동원빌딩 3 ~ 4층
                  <br />
                  <span className="text-background/50">(신분당선, 3호선 신사역 8번 출구 앞)</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>1661-8581</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-background/80">진료시간</div>
                  <div>평일(월~금) 오전 10:00 - 오후 8:00</div>
                  <div>토요일 오전 10:00 - 오후 4:30</div>
                  <div className="text-background/50">일요일 휴진</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">SNS</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/balancelab_ps/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@balance_lab"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/50">
            <div>
              &copy; 2026 밸런스랩성형외과의원. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-background transition-colors">
                개인정보처리방침
              </a>
              <a href="#" className="hover:text-background transition-colors">
                이용약관
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
