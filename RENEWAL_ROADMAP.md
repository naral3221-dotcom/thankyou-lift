# 리프팅 예약 랜딩페이지 리뉴얼 로드맵

> **프로젝트**: 밸런스랩 리프팅 예약 랜딩페이지
> **목표**: HTML/CSS/JS → Next.js 16 완전 리뉴얼
> **타겟**: 리프팅 시술 예약 완료 고객
> **핵심 목표**: 확실한 내원 유도 (예약 고객 대상)

---

## 확정된 프로젝트 방향 (2025-12-22)

| 항목 | 결정 사항 | 비고 |
|------|----------|------|
| **1. 테마** | 라이트 모드 전환 | 의료/뷰티 신뢰감 강화 |
| **2. 탭 구조** | 5개 탭 유지 | 전후사진, 홈페이지리뷰, 블로그카페리뷰, 어플리뷰, 영상리뷰 |
| **3. 오프닝** | 3초 단축 + Skip 버튼 | 재방문자 UX 개선 |
| **4. AI 매칭** | 높은 완성도로 시작 | 예시 이미지로 대체하며 구축 |
| **5. 개발 방식** | 완전 리뉴얼 | 점진적 개선 아님 |
| **6. CTA** | 불필요 | 이미 예약한 고객 대상 |

---

## 진행 현황 Overview

```
Phase 1: 기반 구축        ████████████████████ 100%
Phase 2: 이미지 최적화    ████████████████████ 100%
Phase 3: 오프닝/히어로    ████████████████████ 100%
Phase 4: 탑바/헤더        ████████████████████ 100%
Phase 5: 탭/리뷰 시스템   ████████████████████ 100%
Phase 6: 데이터 연동      ████████████████████ 100%
Phase 7: AI 케이스 매칭   ████░░░░░░░░░░░░░░░░ 20%
Phase 8: 최적화/런칭      ░░░░░░░░░░░░░░░░░░░░ 0%
```

**전체 진행률: ~75%**

---

## 1. 기술 스택

### 확정된 스택
| 카테고리 | 기술 | 버전 | 상태 |
|----------|------|------|------|
| Framework | Next.js | 16.1.x | ✅ 적용 |
| UI Library | React | 19.x | ✅ 적용 |
| Styling | Tailwind CSS | 4.x | ✅ 적용 |
| Animation | Framer Motion | 12.x (`motion/react`) | ✅ 적용 |
| UI Components | Radix UI | latest | ✅ 적용 |
| Icons | Lucide React | latest | ✅ 적용 |
| Language | TypeScript | 5.x | ✅ 적용 |
| Data | Google Sheets CSV | - | ✅ 적용 |
| Deploy | Vercel | - | 예정 |

---

## 2. 개발 로드맵 (상세)

### Phase 1: 기반 구축 ✅ 완료

- [x] Next.js 16 프로젝트 초기화
- [x] TypeScript 설정
- [x] Tailwind CSS 4 설정 (CSS 기반 `@theme inline`)
- [x] 라이트 모드 컬러 팔레트 정의
- [x] Pretendard 폰트 적용 (CDN)
- [x] 폴더 구조 설계

### Phase 2: 이미지 최적화 ✅ 완료

- [x] Sharp 기반 이미지 변환 스크립트 작성
- [x] 1,398개 이미지 WEBP 변환
- [x] 폴더 구조 매핑 시스템 구현
- [x] public/images 디렉토리 구성

### Phase 3: 오프닝 + 히어로 섹션 ✅ 완료

#### 인트로 애니메이션
- [x] 로고 페이드인 (0-1.5초)
- [x] 텍스트 슬라이드업 (0.5-2초)
- [x] 전체 페이드아웃 (2-3초)
- [x] Skip 버튼 (0.8초 후 표시)

#### 히어로 섹션
- [x] 배경 슬라이드쇼 (7장, 5초 간격)
- [x] AnimatePresence 페이드 트랜지션
- [x] 흰색 오버레이 (`bg-white/60`)
- [x] 어두운 텍스트 (라이트 모드)
- [x] 통계 카드 (반투명 배경)
- [x] 뱃지 (accent 배경)

### Phase 4: 탑바/헤더 ✅ 완료

- [x] 고정 헤더 (fixed, z-50)
- [x] 반투명 배경 + backdrop-blur
- [x] 좌측: 홈 링크 (Lucide Home)
- [x] 중앙: 로고 (정확한 중앙 정렬)
- [x] 우측: 전화 + 카카오톡 (Lucide Phone, MessageCircle)
- [x] 인트로 완료 후 표시

### Phase 5: 탭 + 리뷰 시스템 ✅ 완료

#### 탭 네비게이션
- [x] Radix UI Tabs 기반
- [x] 5개 탭 (전후사진, 홈페이지리뷰, 블로그/카페, 어플리뷰, 영상리뷰)
- [x] 스티키 탭바 (스크롤 시 고정)
- [x] 활성 탭 인디케이터 애니메이션

#### 카테고리 필터
- [x] 3개 카테고리 (투명브이리프팅, 투명미니리프팅, 안면거상/미니거상)
- [x] 모바일 가로 스크롤 (overflow-x-auto)
- [x] whitespace-nowrap으로 줄바꿈 방지

#### 리뷰 카드 (UnifiedReviewCard)
- [x] 고정 비율 (476:357)
- [x] 3장 이미지 그리드 레이아웃
- [x] 추가 이미지 수 오버레이 (+N)
- [x] 출처별 배지 컬러
- [x] 별점, 작성자, 날짜, 해시태그

#### 리뷰 슬라이더 (ReviewSlider)
- [x] 2x2 그리드 (데스크톱) / 1x2 (모바일)
- [x] 좌우 화살표 네비게이션
- [x] 스냅 스크롤
- [x] 프로그레스 바 + 도트 인디케이터

#### 리뷰 모달 (ReviewModal)
- [x] Radix Dialog 기반
- [x] 본문 HTML 렌더링
- [x] 커스텀 마크업 파싱
  - (box), (grid), (high), (bold), (blue), (red), (orange)
- [x] 이미지 갤러리

### Phase 6: 데이터 연동 ✅ 완료

#### Google Sheets 연동
- [x] 4개 시트 CSV 페치 (homepage, blog, app, video)
- [x] CSV 파싱 (쉼표, 따옴표 처리)
- [x] 타입 정의 (ReviewItem, Category 등)

#### 이미지 경로 변환
- [x] folderMap 매핑 테이블
- [x] convertImagePath 함수
- [x] CSV 이스케이핑 처리 (`""` → `"`)
- [x] extractImagesFromContent (본문 이미지 추출)

### Phase 7: AI 케이스 매칭 🚧 진행 중

#### 완료
- [x] AIMatchingSection 기본 구조

#### 진행 예정
- [ ] 3단계 설문 UI
  - Step 1: 고민 부위 선택
  - Step 2: 선호 스타일 선택
  - Step 3: 예산 범위 선택
- [ ] 매칭 로직 (규칙 기반 필터링)
- [ ] 결과 화면 (추천 케이스 3개)
- [ ] 플로팅 AI 버튼

### Phase 8: 최적화 + 런칭 ⏳ 예정

- [ ] Core Web Vitals 최적화
- [ ] Next/Image 최적화 확인
- [ ] SEO 메타 태그
- [ ] OG 이미지
- [ ] 모바일 QA (iOS Safari 포함)
- [ ] Vercel 배포

---

## 3. 컴포넌트 구조

```
App (page.tsx)
├── IntroSection (인트로 애니메이션)
├── TopBar (고정 헤더)
│   ├── Home Link (Lucide Home)
│   ├── Logo (중앙)
│   └── Contact Links (Phone, MessageCircle)
├── HeroSection (히어로)
│   ├── BackgroundSlideshow (7장)
│   ├── Badge ("예약해주셔서 감사합니다")
│   ├── Headline
│   ├── Subheadline
│   └── Stats (누적시술, 평점, 만족도)
├── ReviewSection (리뷰 시스템)
│   ├── TabNavigation (5개 탭)
│   ├── CategoryFilter (3개 카테고리)
│   ├── TabContents
│   │   ├── BeforeAfter (placeholder)
│   │   ├── HomepageReview → ReviewSlider
│   │   ├── BlogCafeReview → ReviewSlider
│   │   ├── AppReview → ReviewSlider
│   │   └── VideoReview
│   └── ReviewModal
├── AIMatchingSection (AI 매칭)
└── FooterSection (푸터)
```

---

## 4. 디자인 가이드

### 컬러 팔레트 (라이트 모드)
```
배경:       #FFFFFF
텍스트:     #0a0a0a (메인), #737373 (서브)
카드:       #FFFFFF
Primary:    #c9a86c (골드)
Accent:     #10b981 (그린)
Border:     #e5e5e5
Muted:      #f5f5f5
```

### 배지 컬러
```
홈페이지:   #00C7AE
블로그:     #03C75A (네이버 그린)
카페:       #CA2026
강남언니:   #FF515D
바비톡:     #F75F88
```

### 반응형 브레이크포인트
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
```

---

## 5. 남은 작업 요약

### 필수 (P0)
1. [ ] AI 케이스 매칭 완성
2. [ ] 전후사진 탭 데이터 연동
3. [ ] Vercel 배포

### 권장 (P1)
1. [ ] SEO 메타 태그 최적화
2. [ ] Core Web Vitals 점검
3. [ ] 영상 리뷰 YouTube 연동

### 선택 (P2)
1. [ ] 관리자 대시보드
2. [ ] A/B 테스트 프레임

---

## 6. 연락처

- **전화**: 1661-8581
- **웹사이트**: balancelab.kr
- **카카오톡**: pf.kakao.com/_SSyxmxj/chat

---

**생성일**: 2025-12-22
**마지막 업데이트**: 2025-12-22
**AI 기획팀**: GPT-5.2 + Claude Opus 4.5
**현재 상태**: Phase 5-6 완료, Phase 7 진행 중

