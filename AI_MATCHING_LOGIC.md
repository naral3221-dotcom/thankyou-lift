# AI Matching Logic - Complete Documentation

본 문서는 `src/lib/ai-matching.ts`에 구현된 **정밀 매칭 알고리즘** 전체 명세서입니다.

---

## 1. 사용자 입력 플로우 (User Input Flow)

AI 매칭은 **5단계**의 순차적 질문으로 사용자 정보를 수집합니다.

### Step 1: 고민 부위 선택 (Concerns)
**질문:** "가장 고민되는 부위는?"

| 선택지 | Key | 설명 |
|:---|:---|:---|
| 이마/미간 | `forehead` | 이마 주름, 미간 주름 |
| 눈가/눈밑 | `eyes` | 눈밑, 눈꺼풀 처짐 |
| 볼/광대 | `cheeks` | 볼살 처짐, 애플존 무너짐 |
| 턱선/이중턱 | `jawline` | V라인 무너짐, 이중턱 |
| 팔자주름 | `nasolabial` | 비순각 주름 |
| 입가주름 | `mouth` | 입꼬리 처짐, 마리오넷 라인 |

**복수 선택 가능** - 선택한 개수가 Contour Score에 반영됨

#### Sub-concerns (세부 고민)
특정 부위 선택 시 추가 질문:
- `eyes` 선택 시 → `underEye` (눈밑처짐), `upperEye` (눈두덩이 처짐) 체크박스
- `jawline` 선택 시 → `neck` (목 까지 포함) 체크박스

---

### Step 2: 연령대 선택 (Age)
**질문:** "연령대를 선택해주세요"

| 선택지 | Key | Age Score | 설명 |
|:---|:---|:---|:---|
| 20대 | `20s` | 2점 | 얼리 안티에이징 |
| 30대 | `30s` | 5점 | 탄력 저하 방지 |
| 40대 | `40s` | 8점 | 본격적인 리프팅 |
| 50대 이상 | `50s` | 10점 | 강력한 리프팅 |

---

### Step 3: 처짐 상태 선택 (Sagging)
**질문:** "현재 처짐 정도는?"

| 선택지 | Key | Sagging Score | 특이사항 |
|:---|:---|:---|:---|
| 살짝 신경쓰임 | `mild` | 2점 | 아직 심하진 않지만 예방 |
| 평균적인 처짐 | `moderate` | 5점 | 또래와 비슷한 수준 |
| 심한 처짐 | `severe` | 8점 | 눈에 띄게 탄력 저하 |
| 좌우 비대칭 | `asymmetry` | 5점 | **PLUS Logic 트리거** |

---

### Step 4: 피부 꺼짐 선택 (Volume Loss) - NEW
**질문:** "피부 꺼짐 정도는?"

| 선택지 | Key | Volume Loss Score | 특이사항 |
|:---|:---|:---|:---|
| 없음 | `none` | 0점 | 볼륨 감소 없이 탄탄 |
| 약간 있는 편 | `mild` | 1점 | 살짝 꺼진 느낌 |
| 확실히 있는 편 | `moderate` | 3점 | **PLUS Logic 트리거** |
| 심한 편 | `severe` | 5점 | **PLUS Logic 트리거** |

---

### Step 5: 우선순위 선택 (Priority)
**질문:** "최우선 고려 사항"

| 선택지 | Key | Priority Modifier | 특이사항 |
|:---|:---|:---|:---|
| 확실한 전후효과 | `effect` | **+3.0점** | **PLUS Logic 트리거** |
| 안전함과 부작용 | `safety` | **-3.0점** | 보수적 접근 |
| 빠른 일상복귀 | `recovery` | **-3.0점** | 보수적 접근 |
| 긴 유지기간 | `maintenance` | **+2.0점** | - |

---

## 2. 점수 산정 시스템 (Scoring System)

### 2-1. 총점 계산 공식

```
Total Score = Age Score + Sagging Score + Volume Loss Score + Contour Score + Priority Modifier
```

| Component | Range | Description |
|:---|:---|:---|
| Age Score | 2 ~ 10 | 연령대별 기본 점수 |
| Sagging Score | 2 ~ 8 | 처짐 상태별 점수 |
| Volume Loss Score | 0 ~ 5 | 피부 꺼짐 정도 점수 |
| Contour Score | 0 ~ 5 | 윤곽 고민 부위 개수 (1점/개) |
| Priority Modifier | -3 ~ +3 | 우선순위에 따른 보정 |

**최소 점수:** 2 + 2 + 0 + 0 - 3 = **1점**
**최대 점수:** 10 + 8 + 5 + 5 + 3 = **31점**

### 2-2. Contour Score 계산
아래 5개 부위만 Contour Score에 반영됨:
- `cheeks` (볼)
- `jawline` (턱선)
- `nasolabial` (팔자)
- `mouth` (입가)
- `neck` (목)

**예시:** 볼, 팔자, 턱선 선택 시 → Contour Score = 3점

---

## 3. 시술 매칭 매트릭스 (Procedure Matching)

### 3-1. 점수별 시술 배정

| Level | Score Range | Procedure | Level Name | Description |
|:---|:---|:---|:---|:---|
| **Level 1** | **~ 8.0** | 투명브이리프팅 | **4+4 LIGHT** | 초기 처짐 예방, 라인 정리 |
| **Level 2** | **8.1 ~ 14.0** | 투명브이리프팅 | **6+6 STANDARD** | 실속형 표준 리프팅 |
| **Level 3** | **14.1 ~ 20.0** | 투명브이리프팅 | **8+8 INTENSIVE** | 강화된 리프팅, 확실한 고정 |
| **Level 4A** | **20.1 ~ 26.0** | 투명미니리프팅 | **DEEP** | Priority가 `maintenance`이고 목 미포함일 때 |
| **Level 4B** | **20.1 ~ 26.0** | 투명브이리프팅 | **12+12 STRONG** | 그 외 모든 경우 |
| **Level 5** | **26.0+** | 미니거상 | **부위별** | 단일 부위 또는 2부위 조합 (아래 3-3 참조) |
| **Level 6** | **26.0+** | 안면거상 | **FULL LIFT** | 3부위 모두 또는 불가능 조합 (중안면+목) |

### 3-2. Level 4 분기 로직 (Branching)

```typescript
if (totalScore <= 26.0) {
    // DEEP은 오직 maintenance(유지기간)일 때만 + 목이 포함되지 않은 경우
    if (priority === 'maintenance' && !hasNeck) {
        // 투명미니리프팅 DEEP 추천
    } else {
        // 그 외 모든 경우: 투명브이리프팅 12+12 STRONG 추천
    }
}
```

### 3-3. Level 5/6 미니거상/안면거상 분기 로직

미니거상은 3개 부위(중안면, 하안면, 목·턱선)에 대해 단일 또는 2부위 조합으로 시술 가능합니다.

#### 미니거상 부위 조합 규칙

| 부위 조합 | 시술 | 설명 |
|:---|:---|:---|
| 중안면만 | 미니거상 (중안면 집중) | 볼, 팔자주름 집중 |
| 하안면만 | 미니거상 (하안면 집중) | 턱선, 입꼬리 집중 |
| 목·턱선만 | 미니거상 (목·턱선 집중) | 목주름, 턱선 집중 |
| 중안면 + 하안면 | 미니거상 (2부위) | 볼~턱선 전체 라인 |
| 하안면 + 목 | 미니거상 (2부위) | 턱선~목라인 동시 |
| **중안면 + 목** | **안면거상** | ❌ 불가능한 조합 (중간 생략) |
| **3부위 모두** | **안면거상** | 전체 얼굴 수술적 개선 |

```typescript
if (totalScore > 26.0) {
    // 기본: 안면거상 (FULL LIFT)
    procedure = "안면거상 (FULL LIFT)";

    // 미니거상 가능한 부위 조합 체크
    if (areaFocus === 'midFace') {
        // 중안면만 → 미니거상 (중안면)
        procedure = "미니거상 (중안면 집중)";
    } else if (areaFocus === 'lowerFace') {
        // 하안면만 → 미니거상 (하안면)
        procedure = "미니거상 (하안면 집중)";
    } else if (areaFocus === 'neckOnly') {
        // 목만 → 미니거상 (목·턱선)
        procedure = "미니거상 (목·턱선 집중)";
    } else if (areaFocus === 'midLower') {
        // 중안면 + 하안면 → 미니거상 (2부위)
        procedure = "미니거상 (중·하안면 2부위)";
    } else if (areaFocus === 'lowerNeck') {
        // 하안면 + 목 → 미니거상 (2부위)
        procedure = "미니거상 (하안면+목 2부위)";
    }
    // combinedWithNeck (3부위 모두) 또는 midNeck (불가능 조합)은 안면거상
}
```

---

## 4. PLUS Logic (시너지 볼륨 패키지)

### 4-1. 발동 조건 (Trigger Conditions)

| 조건 | 설명 |
|:---|:---|
| `volumeLoss === 'moderate'` | 피부 꺼짐이 확실히 있는 편 |
| `volumeLoss === 'severe'` | 피부 꺼짐이 심한 편 |
| `sagging === 'asymmetry'` | 좌우 비대칭 선택 시 |
| `priority === 'effect'` | 확실한 효과 우선순위 선택 시 |

### 4-2. PLUS 패키지 구성

**시너지 볼륨 패키지:**
- **쥬베룩 볼륨** - 꺼진 볼륨을 채우는 콜라겐 자극 시술
- **아쿠아비비 스킨부스터** - 피부 탄력과 윤기를 높이는 시술

### 4-3. 적용 결과

- **적용 대상:** `투명브이리프팅` 시술만 (미니리프팅, 거상 제외)
- **Level Name:** 기존 레벨명 + " + PLUS" (예: "8+8 INTENSIVE + PLUS")
- **Tags:** `#볼륨회복`, `#피부재생` 추가

### 4-4. 꺼짐 정도별 설명 분기

| Volume Loss | Description 추가 문구 |
|:---|:---|
| severe | + 쥬베룩 볼륨 & 아쿠아비비 (심한 꺼짐 집중 케어) |
| moderate | + 쥬베룩 볼륨 & 아쿠아비비 (볼륨 회복 케어) |
| 기타 (asymmetry/effect) | + 볼륨 시술 결합 (시너지 효과) |

```typescript
const needsPlus = volumeLoss === 'moderate' || volumeLoss === 'severe' ||
                  sagging === 'asymmetry' || priority === 'effect';

if (needsPlus && procedure.name.includes("투명브이리프팅")) {
    procedure.levelName += " + PLUS";
    procedure.tags.push("#볼륨회복", "#피부재생");

    procedure.plusPackage = {
        name: "시너지 볼륨 패키지",
        items: ["쥬베룩 볼륨", "아쿠아비비 스킨부스터"],
        description: "리프팅과 함께 꺼진 볼륨을 채우고 피부 탄력을 높이는 시너지 결합 패키지"
    };
}
```

---

## 5. Add-on 추천 로직 (추가 시술)

메인 시술과 함께 개선이 필요한 부위에 대한 추가 시술을 제안합니다.

### 5-1. 눈가 (Eyes)

| Sub-concern | Recommendation | Description |
|:---|:---|:---|
| `underEye` (눈밑) | 눈밑지방재배치 / 볼륨 | 어둡고 불룩한 눈밑 개선 |
| `upperEye` (눈꺼풀) | 눈썹하거상술 / 상안검 | 처진 눈꺼풀 개선, 시야 확보 |
| 둘 다 미선택 | 아이 리프팅 / 보톡스 | 눈가 주름, 탄력 개선 |

### 5-2. 이마/미간 (Forehead)

| 조건 | Recommendation | Description |
|:---|:---|:---|
| `ageScore >= 3` OR `sagging === 'severe'` | 내시경 이마거상 | 무거운 이마를 확실하게 당김 |
| 그 외 | 이마 필러/보톡스 | 주름 개선, 볼륨 채움 |

### 5-3. 목 라인 (Neck)

| 조건 | 결과 |
|:---|:---|
| `jawline` + `neck` 선택 AND 메인이 거상 | `#목거상포함` 태그 추가 |
| `jawline` + `neck` 선택 AND 메인이 거상 아님 | 목주름 전용 실리프팅 Add-on 추가 |

---

## 6. Alternative Plan Logic (대안 추천)

메인 추천과 다른 니즈를 충족시킬 수 있는 대안을 제시합니다.

| Main Procedure | Alternative | Rationale |
|:---|:---|:---|
| **4+4 LIGHT** | 8+8 STANDARD | 더 확실한 라인 정리 |
| **6+6 STANDARD** | - | (현재 미설정) |
| **8+8 INTENSIVE** | 12+12 STRONG | 더 강력한 고정 |
| **12+12 STRONG** | 투명미니리프팅 DEEP | 유지기간 2배, 확실한 효과 |
| **DEEP** | 12+12 STRONG | 수술 없이 안전한 리프팅 |
| **미니거상** | 12+12 STRONG | 수술 부담 없이 비절개 리프팅 |
| **안면거상** | 미니거상 (부위별) | 전체 거상 대신 필요한 부위만 집중 |

---

## 7. Reason Generation (추천 이유 생성)

### 7-1. 기본 문구 생성

```
"고객님의 {연령대} 피부 특성과 {처짐 상태}{볼륨 상태} 상태를 분석했습니다."
```

| Sagging | 표현 |
|:---|:---|
| mild | 초기 탄력 저하 |
| moderate | 평균적인 처짐 |
| asymmetry | 좌우 비대칭 |
| severe | 심한 탄력 저하 |

| Volume Loss | 표현 |
|:---|:---|
| none | (표시 안함) |
| mild | , 약간의 볼륨 감소 |
| moderate | , 눈에 띄는 볼륨 꺼짐 |
| severe | , 심한 볼륨 손실 |

### 7-2. PLUS 패키지 문구

PLUS 패키지가 발동된 경우:
> "피부 꺼짐 개선을 위해 쥬베룩 볼륨과 아쿠아비비 스킨부스터를 함께 추천드립니다."

### 7-3. Priority별 추가 문구

| Priority | 추가 문구 |
|:---|:---|
| safety | "안전과 자연스러움을 중요하게 생각하시기에 수술적 방법보다는 비절개 리프팅을 우선으로 설계했습니다." |
| effect | "확실한 변화를 원하시므로 가장 효과적인 플랜을 제안합니다." |
| recovery | "빠른 일상 복귀를 위해 붓기와 멍을 최소화하는 플랜입니다." |
| maintenance | "오래 가는 유지기간을 위해 근본적인 개선이 가능한 플랜입니다." |

---

## 8. Case Study 연동 (케이스 스터디)

### 8-1. 데이터 구조 (`src/data/ai-cases.ts`)

```typescript
export type AICase = {
    id: string;             // 고유 ID (예: "l1-1")
    beforeImage: string;    // Before 이미지 경로
    afterImage: string;     // After 이미지 경로
    reviewKeyword: string;  // 후기 필터 키워드
    description: string;    // 케이스 설명
};
```

### 8-2. Level별 케이스 매핑

| Level Name | 케이스 그룹 Key |
|:---|:---|
| 4+4 LIGHT | "4+4 LIGHT" |
| 6+6 STANDARD | (미설정 - fallback to 8+8) |
| 8+8 INTENSIVE | "8+8 STANDARD" |
| 12+12 STRONG | "12+12 STRONG" |
| DEEP | "DEEP" |
| 중안면 집중 | "중안면 집중" |
| 하안면 집중 | "하안면 집중" |
| 목·턱선 집중 | "목·턱선 집중" |
| 중·하안면 2부위 | "중·하안면 2부위" |
| 하안면+목 2부위 | "하안면+목 2부위" |
| FULL LIFT | "FULL LIFT" |

### 8-3. CaseStudyViewer 매칭 로직

```typescript
// PLUS 접미사 제거 후 매칭
const rawLevelName = result.mainProcedure.levelName.replace(" + PLUS", "");
const caseGroup = aiCaseStudies[rawLevelName] || aiCaseStudies["8+8 STANDARD"];
```

---

## 9. 후기 카테고리 매칭 (Review Category)

CaseStudyViewer에서 관련 후기를 필터링하는 로직:

| Level Name 포함 | Review Category |
|:---|:---|
| LIGHT, STANDARD, STRONG | `tv` (실리프팅) |
| DEEP, 하안면 | `mini` (미니리프팅) |
| FULL | `face` (안면거상) |

---

## 10. 점수 예시 시나리오

### 예시 1: 젊은 고객, 초기 관리
- **Input:** 30대, 볼 처짐만, 초기 단계, 꺼짐 없음, 안전성 우선
- **계산:**
  - Age: 5점
  - Sagging: 2점
  - Volume Loss: 0점
  - Contour: 1점 (cheeks)
  - Priority: -3점 (safety)
  - **Total: 5점**
- **Result:** 4+4 LIGHT

### 예시 2: 중년 고객, 볼륨 꺼짐 있음
- **Input:** 40대, 볼+팔자+턱선, 보통 처짐, 확실히 꺼짐, 효과 우선
- **계산:**
  - Age: 8점
  - Sagging: 5점
  - Volume Loss: 3점 (moderate)
  - Contour: 3점 (cheeks, nasolabial, jawline)
  - Priority: +3점 (effect)
  - **Total: 22점**
- **Result:** 투명미니리프팅 DEEP + PLUS
  - PLUS 발동 조건: volumeLoss='moderate' AND priority='effect'
  - 패키지: 쥬베룩 볼륨 + 아쿠아비비 스킨부스터

### 예시 3: 심한 처짐, 하안면 집중
- **Input:** 50대, 입가+턱선+목, 심함, 심한 꺼짐, 유지기간 우선
- **계산:**
  - Age: 10점
  - Sagging: 8점
  - Volume Loss: 5점 (severe)
  - Contour: 3점 (mouth, jawline, neck)
  - Priority: +2점 (maintenance)
  - **Total: 28점**
- **Result:** 미니거상 (하안면 집중)
  - lowerCount=3, contourCount=3 조건 충족
  - PLUS 미적용 (거상 시술이므로)

---

## 11. 시스템 아키텍처 요약

```
[사용자 입력 - 5 Steps]
     ↓
┌─────────────────────────────────────────┐
│ calculateMatchingResult(input)          │
│                                         │
│  1. Score Calculation                   │
│     - Age Score (2~10)                  │
│     - Sagging Score (2~8)               │
│     - Volume Loss Score (0~5)  [NEW]    │
│     - Contour Score (0~5)               │
│     - Priority Modifier (-3~+3)         │
│                                         │
│  2. Procedure Matching                  │
│     - Score Range → Level 1~6           │
│     - Level 4 Branching (priority)      │
│     - Level 5 Conditional (lowerFace)   │
│                                         │
│  3. PLUS Logic Check                    │
│     - volumeLoss moderate/severe        │
│     - OR asymmetry OR effect            │
│     → 쥬베룩 볼륨 + 아쿠아비비 패키지   │
│                                         │
│  4. Add-on Generation                   │
│     - Eyes, Forehead, Neck              │
│                                         │
│  5. Alternative Calculation             │
│     - Main → Alternative mapping        │
│                                         │
│  6. Reason Generation                   │
│     - Dynamic text based on input       │
└─────────────────────────────────────────┘
     ↓
[MatchingResult 반환]
     ↓
┌─────────────────────────────────────────┐
│ ResultUI                                │
│  - PLUS 패키지 표시 (if applicable)     │
│  - 점수 및 추천 시술 표시               │
└─────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────┐
│ CaseStudyViewer                         │
│  - Before/After 슬라이더                │
│  - 관련 후기 표시 (Category 매칭)       │
└─────────────────────────────────────────┘
```

---

## 12. 파일 구조

| 파일 | 역할 |
|:---|:---|
| `src/lib/ai-matching.ts` | 핵심 매칭 알고리즘 |
| `src/data/ai-cases.ts` | 케이스 스터디 데이터 |
| `src/components/ai-matching/AIMatchingSection.tsx` | 메인 UI 컴포넌트 (5단계) |
| `src/components/ai-matching/CaseStudyViewer.tsx` | 결과 뷰어 (Before/After + 후기) |
| `src/lib/sheets.ts` | 후기 데이터 fetching |
| `src/types/index.ts` | MatchingStep 타입 정의 |

---

## 13. 태그 목록 (Tags)

### Level별 기본 태그

| Level | Tags |
|:---|:---|
| 4+4 LIGHT | #2030추천, #라인정리, #얼리안티에이징 |
| 6+6 STANDARD | #실속형, #라인정리, #표준 |
| 8+8 INTENSIVE | #강력고정, #심부볼삭제, #V라인완성 |
| 12+12 STRONG | #비절개끝판왕, #안전제일, #최대개수 |
| DEEP | #유지기간UP, #미니절개, #강력한효과 |
| 중안면 집중 | #중안면특화, #볼처짐개선, #팔자주름삭제 |
| 하안면 집중 | #하안면특화, #이중턱삭제, #V라인복원 |
| 목·턱선 집중 | #목리프팅, #턱선정리, #이중턱삭제 |
| 중·하안면 2부위 | #2부위시술, #볼턱동시개선, #V라인완성 |
| 하안면+목 2부위 | #2부위시술, #턱목동시개선, #목거상포함 |
| FULL LIFT | #근본적해결, #확실한효과, #10년전으로 |

### 추가 태그

| 조건 | 추가 태그 |
|:---|:---|
| PLUS Logic 발동 | #볼륨회복, #피부재생 |
| Jawline + Neck + 거상 | #목거상포함 |

---

## 14. MatchingResult 타입 정의

```typescript
export type MatchingResult = {
    mainProcedure: {
        name: string;
        levelName: string;
        description: string;
        tags: string[];
        plusPackage?: {
            name: string;        // "시너지 볼륨 패키지"
            items: string[];     // ["쥬베룩 볼륨", "아쿠아비비 스킨부스터"]
            description: string; // 패키지 설명
        };
    };
    alternativeProcedure?: {
        name: string;
        levelName: string;
        description: string;
        tags: string[];
    } | null;
    addOns: {
        area: string;
        recommendation: string;
        description: string;
    }[];
    scores: {
        total: number;
        ageScore: number;
        saggingScore: number;
        volumeLossScore: number;  // NEW
    };
    reason: string;
};
```

---

*Last Updated: 2025-12-26*
