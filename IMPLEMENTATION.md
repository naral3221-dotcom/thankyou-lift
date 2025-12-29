# 리프팅 예약 랜딩페이지 - 구현 현황

## 프로젝트 개요
밸런스랩성형외과 리프팅 시술 **예약 완료 고객**을 위한 랜딩페이지
전후사진, 리뷰, AI 케이스 매칭을 통해 **확실한 내원 유도**가 목표

---

## 🎯 확정된 프로젝트 방향 (2025-12-22)

| 항목 | 결정 사항 |
|------|----------|
| **테마** | 다크 모드 → **라이트 모드 전환** |
| **탭 구조** | 5개 탭 유지 (필요시 축소) |
| **오프닝** | 5초 → **3초 단축 + Skip 버튼** |
| **AI 매칭** | **높은 완성도** (예시 이미지로 시작) |
| **개발 방식** | **완전 리뉴얼** |
| **CTA** | 불필요 (이미 예약한 고객 대상) |

---

## 🔄 Next.js 16 완전 리뉴얼 계획

### 전환 배경
- 다크 모드 → 라이트 모드 전환으로 전면 리디자인 필요
- CSS 구조 복잡도 해소 필요 (60KB 단일 파일)
- AI 케이스 매칭 고도화
- 오프닝 애니메이션 최적화 (3초 + Skip)

### 신규 기술 스택
```
Framework:    Next.js 16 (App Router)
Language:     TypeScript
UI Library:   React 19
Styling:      Tailwind CSS 4
Animation:    Framer Motion 12 (motion/react)
State:        React hooks (useState, useEffect)
Data:         Google Sheets CSV API
Deployment:   Vercel (예정)
```

---

## ✅ 구현 완료 현황 (2025-12-22)

### Phase 1: 기반 구축 ✅ 완료
- [x] Next.js 16.1 프로젝트 초기화
- [x] TypeScript 설정
- [x] Tailwind CSS 4 설정 (CSS 기반 `@theme inline`)
- [x] 라이트 모드 컬러 팔레트 적용
- [x] Pretendard 폰트 적용
- [x] 프로젝트 폴더 구조 설계

### Phase 2: 이미지 최적화 ✅ 완료
- [x] 이미지 변환 스크립트 작성 (`scripts/convert-images.mjs`)
- [x] 1,398개 이미지 WEBP 변환 완료
- [x] 폴더 구조 매핑 (원본 → 변환)
  - `BLOG REVIEW` → `blog-review`
  - `HOMEPAGE REVIEW` → `homepage-review`
  - `APP REVIEW` → `app-review`
  - `MAIN PAGE` → `main`
  - 등

### Phase 3: 오프닝 + 히어로 섹션 ✅ 완료
- [x] 인트로 애니메이션 (3초 + Skip 버튼)
  - 로고 페이드인 → 텍스트 슬라이드 → 페이드 아웃
  - Skip 버튼 0.8초 후 표시
- [x] 히어로 섹션 구현
  - [x] 배경 슬라이드쇼 (7장 이미지, 5초 간격)
  - [x] 흰색 오버레이 (`bg-white/60`) 적용
  - [x] 어두운 텍스트 (라이트 모드 대비)
  - [x] 통계 섹션 (누적 시술, 평균 평점, 만족도)
  - [x] 뱃지 스타일 (accent 배경)

### Phase 4: 탑바/헤더 ✅ 완료
- [x] 상단 고정 헤더 (`TopBar.tsx`)
  - [x] 홈 링크 (Lucide Home 아이콘)
  - [x] 중앙 로고 (정확히 가운데 정렬)
  - [x] 전화 상담 (Lucide Phone 아이콘)
  - [x] 카카오톡 상담 (Lucide MessageCircle 아이콘)
- [x] 반투명 배경 + blur 효과
- [x] 인트로 완료 후에만 표시

### Phase 5: 탭 + 리뷰 시스템 ✅ 완료
- [x] 5개 탭 구현 (Radix UI Tabs)
  - [x] 전후사진 탭 (placeholder)
  - [x] 홈페이지리뷰 탭
  - [x] 블로그/카페 탭
  - [x] 어플리뷰 탭
  - [x] 영상리뷰 탭
- [x] 카테고리 필터 버튼
  - [x] 투명브이리프팅 / 투명미니리프팅 / 안면거상/미니거상
  - [x] 모바일 가로 스크롤 처리
- [x] 리뷰 카드 컴포넌트 (`UnifiedReviewCard.tsx`)
  - [x] 고정 비율 (476x357)
  - [x] 3장 이미지 그리드 + 추가 이미지 수 오버레이
  - [x] 출처별 배지 (홈페이지, 블로그, 카페, 강남언니, 바비톡)
  - [x] 별점, 작성자, 해시태그
- [x] 리뷰 슬라이더 (`ReviewSlider.tsx`)
  - [x] 2x2 그리드 페이지네이션
  - [x] 좌우 화살표 네비게이션
  - [x] 프로그레스 바 + 도트 인디케이터
- [x] 리뷰 모달 (`ReviewModal.tsx`)
  - [x] 본문 HTML 렌더링
  - [x] 커스텀 마크업 파싱 (box, grid, high, bold, blue, red, orange)

### Phase 6: 데이터 연동 ✅ 완료
- [x] Google Sheets CSV 연동 (`lib/sheets.ts`)
  - [x] 4개 시트 (homepage, blog, app, video)
  - [x] CSV 파싱 및 타입 정의
- [x] 이미지 경로 변환 (`lib/contentParser.tsx`)
  - [x] 원본 경로 → WEBP 경로 자동 변환
  - [x] CSV 이스케이핑 처리 (`""` → `"`)
  - [x] 썸네일 + 본문 이미지 모두 지원

### Phase 7: AI 케이스 매칭 ✅ 완료
- [x] AI 매칭 섹션 UI 기본 구조
- [x] **5단계 설문 UI 완성** (업데이트됨)
  - [x] Step 1: 고민 부위 선택 (다중 선택)
  - [x] Step 2: 연령대 선택
  - [x] Step 3: 처짐 정도 선택
  - [x] Step 4: 피부 꺼짐 선택 (NEW)
  - [x] Step 5: 우선순위 선택 (자연스러움/효과/유지기간)
- [x] 점수 기반 매칭 로직 완성
- [x] 부위 분석 시스템 (AreaFocus) 구현
- [x] PLUS 패키지 트리거 로직
- [x] 결과 화면 + 전후사진 비교 슬라이더
- [x] 관련 후기 연동 (CaseStudyViewer)

### Phase 8: 푸터 + 기타 ✅ 완료
- [x] 푸터 컴포넌트 (`FooterSection.tsx`)

---

## 📁 현재 폴더 구조

```
lifting-landing/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # 공통 UI (Button, Card, Modal 등)
│   │   ├── layout/                # 레이아웃 (TopBar)
│   │   ├── intro/                 # 인트로 애니메이션
│   │   ├── hero/                  # 히어로 섹션
│   │   ├── reviews/               # 리뷰 시스템
│   │   │   ├── ReviewSection.tsx
│   │   │   ├── ReviewSlider.tsx
│   │   │   ├── UnifiedReviewCard.tsx
│   │   │   ├── PhotoReviewCard.tsx
│   │   │   ├── VideoReviewCard.tsx
│   │   │   └── ReviewModal.tsx
│   │   ├── ai-matching/           # AI 케이스 매칭
│   │   └── footer/                # 푸터
│   ├── lib/
│   │   ├── utils.ts               # cn() 유틸리티
│   │   ├── sheets.ts              # Google Sheets 연동
│   │   └── contentParser.tsx      # 콘텐츠 파싱 + 이미지 경로 변환
│   └── types/
│       └── index.ts               # 타입 정의
├── public/
│   └── images/                    # 변환된 WEBP 이미지 (1,398개)
│       ├── main/
│       ├── blog-review/
│       ├── homepage-review/
│       ├── app-review/
│       ├── before-after/
│       ├── icon/
│       └── logo/
├── scripts/
│   └── convert-images.mjs         # 이미지 변환 스크립트
└── package.json
```

---

## 🎨 디자인 시스템

### 컬러 팔레트 (라이트 모드)
```css
--background: #FFFFFF
--foreground: #0a0a0a
--card: #FFFFFF
--primary: #c9a86c (골드)
--accent: #10b981 (그린)
--muted: #f5f5f5
--border: #e5e5e5
```

### 배지 컬러
```css
--badge-homepage: #00C7AE
--badge-blog: #03C75A
--badge-cafe: #CA2026
--badge-gangnam: #FF515D
--badge-babitalk: #F75F88
```

---

## 🚧 남은 작업

### 우선순위 높음
- [ ] 전후사진 탭 실제 데이터 연동
- [ ] AI 케이스 매칭 완성
- [ ] 영상 리뷰 YouTube 연동

### 우선순위 중간
- [ ] SEO 메타 태그 최적화
- [ ] OG 이미지 설정
- [ ] Core Web Vitals 최적화

### 우선순위 낮음
- [ ] 다국어 지원 (필요시)
- [ ] 관리자 대시보드 (필요시)

---

## 📝 작업 로그

### 2025-12-22 (오후): 주요 구현 완료
- TopBar 구현 (Lucide 아이콘, 로고 중앙 정렬)
- 히어로 섹션 라이트 모드 전환
  - 흰색 오버레이 + 어두운 텍스트
  - 배경 슬라이드쇼 (7장)
  - 뱃지 accent 배경
- 카테고리 버튼 모바일 스크롤 처리
- 리뷰 카드 이미지 로딩 버그 수정
  - CSV 이스케이핑 처리
  - 이미지 경로 변환 로직 개선

### 2025-12-22 (오전): 기반 작업
- Next.js 16 프로젝트 초기화
- Tailwind CSS 4 설정
- 이미지 변환 (1,398개 → WEBP)
- Google Sheets 연동
- 인트로 애니메이션 구현
- 리뷰 시스템 구현

---

## 연락처 정보
- **전화**: 1661-8581
- **웹사이트**: balancelab.kr
- **카카오톡**: pf.kakao.com/_SSyxmxj/chat

---

**마지막 업데이트**: 2025-12-24
**상태**: Phase 7 완료
**다음 단계**: 전후사진 데이터 추가 + Google Sheets 컬럼 최적화

---

## 🤖 AI 매칭 시스템 상세 구현 가이드

### 핵심 파일

| 파일 | 역할 |
|------|------|
| `src/lib/ai-matching.ts` | 핵심 매칭 알고리즘 |
| `src/components/ai-matching/AIMatchingSection.tsx` | 5단계 UI 컴포넌트 |
| `src/components/ai-matching/CaseStudyViewer.tsx` | 전후사진 + 후기 뷰어 |
| `src/data/ai-cases.ts` | 케이스 스터디 데이터 |

---

### 시술 타입 및 점수 체계

#### 시술 종류

| 시술명 | Level Name | 대상 부위 | 비고 |
|--------|------------|-----------|------|
| 투명브이리프팅 | 4+4 LIGHT | 중안면, 하안면, 목 | 초기 처짐 |
| 투명브이리프팅 | 6+6 STANDARD | 중안면, 하안면, 목 | **주력 상품** |
| 투명브이리프팅 | 8+8 INTENSIVE | 중안면, 하안면, 목 | **주력 상품** |
| 투명브이리프팅 | 12+12 STRONG | 중안면, 하안면, 목 | 고강도 |
| 투명미니리프팅 | DEEP | 중안면, 하안면 (목 X) | 유지기간 우선시만 |
| 미니거상 | 하안면 집중 | 중안면, 하안면, 목 | 수술 |
| 안면거상 | FULL / MINI LIFT | 전체 | 수술 |

#### 점수 구간 (Score Thresholds)

```typescript
// src/lib/ai-matching.ts
if (totalScore <= 8.0) {
  // Level 1: 4+4 LIGHT
} else if (totalScore <= 14.0) {
  // Level 2: 6+6 STANDARD ← 주력
} else if (totalScore <= 20.0) {
  // Level 3: 8+8 INTENSIVE ← 주력
} else if (totalScore <= 26.0) {
  // Level 4: 12+12 STRONG 또는 DEEP
} else {
  // Level 5+: 거상 (미니/안면)
}
```

**목표 분포**: 6+6 + 8+8이 전체 추천의 약 60% 차지

#### DEEP 조건

```typescript
// DEEP은 아래 조건을 모두 만족할 때만 추천
if (input.priority === 'maintenance' && !hasNeck) {
  procedure = { name: "투명미니리프팅", levelName: "DEEP", ... };
}
```

- `priority === 'maintenance'`: 최우선 고려사항이 "확실한 긴 유지기간"
- `!hasNeck`: 목 부위가 선택되지 않음

---

### 부위 분석 시스템 (Area Analysis)

#### 타입 정의

```typescript
// src/lib/ai-matching.ts
export type AreaFocus = 'midFace' | 'lowerFace' | 'combined' | 'combinedWithNeck';

export type AreaAnalysis = {
  midFaceCount: number;   // 중안면 관련 고민 개수
  lowerFaceCount: number; // 하안면 관련 고민 개수
  hasNeck: boolean;       // 목 부위 포함 여부
  focus: AreaFocus;       // 최종 부위 판단
  focusLabel: string;     // UI 표시용 라벨
};
```

#### 고민 항목별 부위 매핑

```typescript
// 중안면 (Mid-Face)
const midFaceConcerns = ['cheekSagging', 'nasalFolds', 'underEyeHollow'];

// 하안면 (Lower-Face)
const lowerFaceConcerns = ['jowls', 'marionette', 'doubleChin', 'jawline'];

// 목 (Neck)
const neckConcerns = ['neckLines', 'neckSagging'];
```

#### 부위별 라벨

| AreaFocus | 한글 라벨 |
|-----------|----------|
| midFace | 중안면 집중 |
| lowerFace | 하안면 집중 |
| combined | 중·하안면 복합 |
| combinedWithNeck | 중·하안면 + 목 |

---

### PLUS 패키지 시스템

#### PLUS 패키지 구성
- **쥬베룩 볼륨**: 콜라겐 재생
- **아쿠아비비 스킨부스터**: 피부결 개선

#### PLUS 트리거 조건

```typescript
const needsPlus =
  input.volumeLoss === 'moderate' ||  // 볼륨 손실 중등도
  input.volumeLoss === 'severe' ||    // 볼륨 손실 심함
  input.asymmetry === 'noticeable' || // 비대칭 눈에 띔
  input.priority === 'effect';        // 효과 우선

if (needsPlus) {
  levelName += " + PLUS";  // 예: "6+6 STANDARD + PLUS"
}
```

---

### 5단계 사용자 입력 플로우

```
Step 1: 고민 선택 (Concerns)
  └─ 다중 선택 가능
  └─ 부위별 점수 + Area Analysis

Step 2: 연령대 선택 (Age)
  └─ 20대/30대/40대/50대+
  └─ 가중치 적용

Step 3: 처짐 정도 (Sagging)
  └─ 4단계 (없음~심함)

Step 4: 피부 꺼짐 (Volume Loss)
  └─ 4단계 (없음~심함)
  └─ PLUS 패키지 트리거

Step 5: 우선순위 (Priority)
  └─ 자연스러움 / 확실한 효과 / 긴 유지기간
  └─ DEEP 조건 판단
```

---

### 전후사진 폴더 구조 (권장)

```
public/images/cases/
├── level1/                    # 4+4 LIGHT
│   ├── midface/              # 중안면 케이스
│   │   ├── case1-before.jpg
│   │   └── case1-after.jpg
│   ├── lowerface/            # 하안면 케이스
│   └── combined/             # 복합 케이스
│
├── level2/                    # 6+6 STANDARD
│   ├── midface/
│   ├── lowerface/
│   └── combined/
│
├── level3/                    # 8+8 INTENSIVE
│   ├── midface/
│   ├── lowerface/
│   └── combined/
│
├── level4/                    # 12+12 STRONG
│   ├── midface/
│   ├── lowerface/
│   ├── combined/
│   └── combinedWithNeck/     # 목 포함
│
├── deep/                      # 투명미니 DEEP
│   ├── midface/
│   └── lowerface/            # 목 케이스 없음
│
├── level5/                    # 하안면 집중 (미니거상)
│   ├── lowerface/
│   └── combinedWithNeck/
│
└── level6/                    # FULL LIFT (안면거상)
    └── combined/
```

#### 파일 네이밍 규칙

```
{area}-case{번호}-before.jpg
{area}-case{번호}-after.jpg

예시:
midface-case1-before.jpg
midface-case1-after.jpg
```

#### ai-cases.ts 업데이트 예시

```typescript
// src/data/ai-cases.ts
export const aiCaseStudies = {
  "6+6 STANDARD": {
    levelName: "Level 2 (6+6)",
    cases: [
      {
        id: "l2-mid-1",
        beforeImage: "/images/cases/level2/midface/case1-before.jpg",
        afterImage: "/images/cases/level2/midface/case1-after.jpg",
        reviewKeyword: "6줄",
        description: "중안면 팔자주름 개선",
        areaFocus: "midFace"  // ← 필수
      },
      {
        id: "l2-lower-1",
        beforeImage: "/images/cases/level2/lowerface/case1-before.jpg",
        afterImage: "/images/cases/level2/lowerface/case1-after.jpg",
        reviewKeyword: "6줄",
        description: "하안면 턱선 개선",
        areaFocus: "lowerFace"  // ← 필수
      }
    ]
  }
};
```

---

### Google Sheets 후기 구조

#### 현재 컬럼 구조

| 컬럼명 | 설명 | 예시 |
|--------|------|------|
| no | 고유 번호 | 1, 2, 3... |
| tab | 후기 출처 | homepage, blog, cafe, app |
| category | 시술 카테고리 | tv, mini, face |
| level | 시술 레벨 | 1, 2, 3, 4... |
| title | 후기 제목 | "6줄 리프팅 후기" |
| author | 작성자 | "리프팅맘" |
| date | 작성일 | "2024.01.15" |
| badge | 출처 뱃지 | "네이버블로그", "바비톡" |
| star | 별점 | "★★★★★" |
| tags | 태그 | "팔자주름,턱선,40대" |
| thumb | 썸네일 경로 | "/images/reviews/..." |
| html | 후기 본문 HTML | "<p>시술 후기...</p>" |
| plan | 시술 플랜 | "6+6 STANDARD" |

#### 추가 권장 컬럼

| 컬럼명 | 설명 | 값 예시 |
|--------|------|---------|
| procedure | 정확한 시술명 | 투명브이리프팅, 투명미니리프팅 |
| levelName | 레벨명 | 6+6 STANDARD, DEEP |
| areaFocus | 주요 부위 | midFace, lowerFace, combined |
| hasPlus | PLUS 패키지 여부 | TRUE, FALSE |
| ageGroup | 연령대 | 30대, 40대, 50대 |

#### 권장 시트 구조 예시

```
| no | tab      | category | levelName      | areaFocus  | hasPlus | title                    | tags            |
|----|----------|----------|----------------|------------|---------|--------------------------|-----------------|
| 1  | blog     | tv       | 6+6 STANDARD   | midFace    | FALSE   | 팔자주름 개선 후기       | 팔자,중안면,30대 |
| 2  | homepage | tv       | 6+6 STANDARD   | lowerFace  | FALSE   | 턱선 정리 후기           | 턱선,하안면,40대 |
| 3  | app      | tv       | 8+8 INTENSIVE  | combined   | TRUE    | 전체적으로 탱탱해진 느낌 | 복합,PLUS,40대   |
```

---

### 케이스 스터디 매칭 로직

#### 부위 매칭 점수

```typescript
// src/components/ai-matching/CaseStudyViewer.tsx
function getAreaMatchScore(caseArea: AreaFocus | undefined, userArea: AreaFocus): number {
  if (!caseArea) return 1;             // areaFocus 없는 케이스는 기본 점수
  if (caseArea === userArea) return 3; // 완벽 매칭
  if (caseArea === 'combined') return 2; // 복합은 부분 매칭
  return 0; // 매칭 안됨
}
```

---

### 체크리스트: 다음 작업 시

#### 전후사진 추가 시
- [ ] 부위별 폴더에 before/after 이미지 배치
- [ ] `ai-cases.ts`에 케이스 추가
- [ ] `areaFocus` 필드 반드시 지정
- [ ] 이미지 파일명 규칙 준수

#### 후기 데이터 추가 시
- [ ] Google Sheets에 새 컬럼 추가 (levelName, areaFocus, hasPlus)
- [ ] 기존 후기에 부위 정보 태깅
- [ ] `sheets.ts` 필터 로직 업데이트

#### 새 시술 레벨 추가 시
- [ ] `ai-matching.ts`에 점수 구간 조정
- [ ] `ai-cases.ts`에 케이스 그룹 추가
- [ ] 해당 레벨 전후사진 폴더 생성

---

### 디버깅 팁

1. **점수 확인**: `result.scores` 콘솔 출력
2. **부위 분석 확인**: `result.areaAnalysis` 확인
3. **DEEP 조건 확인**:
   - `priority === 'maintenance'` 확인
   - `hasNeck === false` 확인
   - 점수가 20.1 ~ 26.0 구간인지 확인
