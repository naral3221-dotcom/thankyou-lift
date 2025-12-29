// 부위 분석 타입
// midFace: 중안면만 (볼, 팔자)
// lowerFace: 하안면만 (턱선, 입가)
// neckOnly: 목/턱선만
// midLower: 중안면 + 하안면 (미니거상 2부위)
// lowerNeck: 하안면 + 목 (미니거상 2부위)
// combined: 중안면 + 하안면 (목 없음)
// combinedWithNeck: 중안면 + 하안면 + 목 (안면거상)
// midNeck: 중안면 + 목 (불가능한 조합 - 안면거상으로 처리)
export type AreaFocus = 'midFace' | 'lowerFace' | 'neckOnly' | 'midLower' | 'lowerNeck' | 'combined' | 'combinedWithNeck' | 'midNeck';

export type AreaAnalysis = {
    midFaceCount: number;    // cheeks, nasolabial 선택 개수
    lowerFaceCount: number;  // jawline, mouth 선택 개수
    hasNeck: boolean;
    focus: AreaFocus;
    focusLabel: string;      // UI 표시용 라벨
};

export type MatchingResult = {
    mainProcedure: {
        name: string;
        levelName: string; // e.g., "12+12 STRONG"
        description: string;
        tags: string[];
        plusPackage?: {
            name: string;
            items: string[];
            description: string;
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
        volumeLossScore: number;
    };
    areaAnalysis: AreaAnalysis;  // 부위 분석 결과 추가
    reason: string;
};

type UserInput = {
    concerns: string[];
    subConcerns: {
        neck: boolean;
        underEye: boolean;
        upperEye: boolean;
    };
    age: string;
    sagging: string;
    volumeLoss: string; // none, mild, moderate, severe
    priority: string;
};

export function calculateMatchingResult(input: UserInput): MatchingResult {
    // 1. Base Score Calculation (30-point Scale)
    let ageScore = 0;
    switch (input.age) {
        case '20s': ageScore = 2; break;
        case '30s': ageScore = 5; break;
        case '40s': ageScore = 8; break;
        case '50s': ageScore = 10; break;
        default: ageScore = 2;
    }

    let saggingScore = 0;
    switch (input.sagging) {
        case 'mild': saggingScore = 2; break;
        case 'moderate': saggingScore = 5; break;
        case 'asymmetry': saggingScore = 5; break; // Asymmetry triggers PLUS logic separately
        case 'severe': saggingScore = 8; break;
        default: saggingScore = 2;
    }

    // Volume Loss Score (피부 꺼짐 점수)
    let volumeLossScore = 0;
    switch (input.volumeLoss) {
        case 'none': volumeLossScore = 0; break;
        case 'mild': volumeLossScore = 1; break;
        case 'moderate': volumeLossScore = 3; break;  // 확실히 있는편 - PLUS 트리거
        case 'severe': volumeLossScore = 5; break;    // 심한편 - PLUS 트리거
        default: volumeLossScore = 0;
    }

    // Count contour-related concerns (1 point each, max 5)
    const contourConcerns = ['cheeks', 'jawline', 'nasolabial', 'mouth', 'neck'];
    const contourCount = input.concerns.filter(c => contourConcerns.includes(c)).length;
    let contourScore = contourCount; // Direct 1:1 mapping

    // 부위 분석 (중안면/하안면/복합)
    const midFaceConcerns = ['cheeks', 'nasolabial'];
    const lowerFaceConcerns = ['jawline', 'mouth'];
    const midFaceCount = input.concerns.filter(c => midFaceConcerns.includes(c)).length;
    const lowerFaceCount = input.concerns.filter(c => lowerFaceConcerns.includes(c)).length;
    const hasNeck = input.concerns.includes('neck') || input.subConcerns.neck;

    let areaFocus: AreaFocus;
    let focusLabel: string;

    // 부위 조합 로직:
    // - 투명브이리프팅 (Level 1~4): 목은 하안면으로 통합 (mid / lower / combined)
    // - 미니거상 (Level 5+): 중안면 / 하안면 / 목·턱선 개별 부위로 분리
    //   - 단일 부위: 중안면 / 하안면 / 목·턱선 → 미니거상 (1부위)
    //   - 2부위 조합: 중안면+하안면 / 하안면+목 → 미니거상 (2부위)
    //   - 불가능한 조합: 중안면+목 → 안면거상
    //   - 3부위 모두: 중안면+하안면+목 → 안면거상

    // 하안면 카운트에 목 포함 여부 반영 (목 선택시 하안면으로 취급)
    const effectiveLowerCount = lowerFaceCount > 0 || hasNeck ? Math.max(lowerFaceCount, 1) : 0;

    if (midFaceCount > 0 && lowerFaceCount > 0 && hasNeck) {
        // 3부위 모두 선택 → 안면거상
        areaFocus = 'combinedWithNeck';
        focusLabel = '중·하안면 + 목 (전체)';
    } else if (midFaceCount > 0 && lowerFaceCount > 0) {
        // 중안면 + 하안면 (목 없음) → 미니거상 2부위 가능
        areaFocus = 'midLower';
        focusLabel = '중·하안면 복합';
    } else if (midFaceCount > 0 && hasNeck) {
        // 중안면 + 목 (하안면 없음) → 불가능한 조합, 안면거상으로 처리
        areaFocus = 'midNeck';
        focusLabel = '중안면 + 목 (전체 권장)';
    } else if (lowerFaceCount > 0 && hasNeck) {
        // 하안면 + 목 → 미니거상 2부위 가능
        areaFocus = 'lowerNeck';
        focusLabel = '하안면 + 목';
    } else if (midFaceCount > 0 && effectiveLowerCount > 0) {
        // 중안면 + (하안면 또는 목) → 복합
        areaFocus = 'combined';
        focusLabel = '중·하안면 복합';
    } else if (midFaceCount > 0) {
        // 중안면만
        areaFocus = 'midFace';
        focusLabel = '중안면 집중';
    } else if (hasNeck && lowerFaceCount === 0) {
        // 목만 선택 → 투명브이에서는 하안면으로 취급, 미니거상에서는 목 전용
        // (미니거상 분기에서 hasNeck 체크하여 neckOnly로 분기)
        areaFocus = 'lowerFace';
        focusLabel = '하안면 (목 포함)';
    } else if (lowerFaceCount > 0) {
        // 하안면만
        areaFocus = 'lowerFace';
        focusLabel = '하안면 집중';
    } else {
        // 윤곽 부위 선택 없음 (eyes, forehead만 선택한 경우)
        areaFocus = 'combined';
        focusLabel = '전체 윤곽';
    }

    const areaAnalysis: AreaAnalysis = {
        midFaceCount,
        lowerFaceCount,
        hasNeck,
        focus: areaFocus,
        focusLabel
    };

    let totalScore = ageScore + saggingScore + volumeLossScore + contourScore;

    // 2. Priority Modifier (Stronger Impact)
    if (input.priority === 'safety' || input.priority === 'recovery') {
        totalScore -= 3.0; // Significant conservative shift
    } else if (input.priority === 'effect') {
        totalScore += 3.0; // Aggressive shift
    } else if (input.priority === 'maintenance') {
        totalScore += 2.0; // Moderate shift
    }

    // 3. Determine Main Procedure Level
    let procedure: {
        name: string;
        levelName: string;
        description: string;
        tags: string[];
        plusPackage?: {
            name: string;
            items: string[];
            description: string;
        };
    } = { name: "투명브이리프팅", levelName: "6+6 STANDARD", description: "가장 표준적인 리프팅", tags: ["#표준", "#탄력개선"] };

    // Logic Matrix (Adjusted Thresholds - 6+6, 8+8 메인 상품 집중)
    // Level 1: ~ 8.0 (4+4 LIGHT) ~10%
    // Level 2: 8.1 ~ 14.0 (6+6 STANDARD) ~28%
    // Level 3: 14.1 ~ 20.0 (8+8 INTENSIVE) ~32%
    // Level 4: 20.1 ~ 26.0 (12+12 / DEEP) ~22%
    // Level 5/6: 26.0+ (거상) ~8%

    if (totalScore <= 8.0) {
        procedure = {
            name: "투명브이리프팅",
            levelName: "4+4 LIGHT",
            description: "초기 처짐을 예방하고 라인을 정리하는 가벼운 리프팅",
            tags: ["#2030추천", "#라인정리", "#얼리안티에이징"]
        };
    } else if (totalScore <= 14.0) {
        procedure = {
            name: "투명브이리프팅",
            levelName: "6+6 STANDARD",
            description: "라인 정리가 필요한 분들을 위한 실속형 표준 리프팅",
            tags: ["#실속형", "#라인정리", "#표준"]
        };
    } else if (totalScore <= 20.0) {
        procedure = {
            name: "투명브이리프팅",
            levelName: "8+8 INTENSIVE",
            description: "무너진 라인을 확실하게 잡아주는 강화된 리프팅",
            tags: ["#강력고정", "#심부볼삭제", "#V라인완성"]
        };
    } else if (totalScore <= 26.0) {
        // DEEP은 오직 maintenance(유지기간)일 때만 + 목이 포함되지 않은 경우
        if (input.priority === 'maintenance' && !hasNeck) {
            procedure = {
                name: "투명미니리프팅",
                levelName: "DEEP",
                description: "근막층까지 당겨 더 오래 유지되는 미니 리프팅",
                tags: ["#유지기간UP", "#미니절개", "#강력한효과"]
            };
        } else {
            // 그 외 모든 경우: 12+12 STRONG
            procedure = {
                name: "투명브이리프팅",
                levelName: "12+12 STRONG",
                description: "절개 없이 최대로 당기는 강력한 실리프팅",
                tags: ["#비절개끝판왕", "#안전제일", "#최대개수"]
            };
        }
    } else {
        // Level 5/6: 26.0+ (거상)
        // 미니거상 부위 조합 규칙:
        // - 단일 부위: 중안면 / 하안면 / 목·턱선 → 미니거상
        // - 2부위: 중안면+하안면 / 하안면+목 → 미니거상 (2부위)
        // - 불가능 조합: 중안면+목 → 안면거상
        // - 3부위 모두: 중안면+하안면+목 → 안면거상

        // 안면거상이 필요한 경우 (기본값)
        procedure = {
            name: "안면거상",
            levelName: "FULL LIFT",
            description: "처진 피부와 근육을 근본적으로 개선하는 수술적 방법",
            tags: ["#근본적해결", "#확실한효과", "#10년전으로"]
        };

        // 미니거상 가능한 부위 조합 체크
        if (areaFocus === 'midFace') {
            // 중안면만 → 미니거상 (중안면)
            procedure = {
                name: "미니거상",
                levelName: "중안면 집중",
                description: "볼과 팔자 부위를 집중적으로 끌어올리는 미니거상",
                tags: ["#중안면특화", "#볼처짐개선", "#팔자주름삭제"]
            };
        } else if (hasNeck && lowerFaceCount === 0 && midFaceCount === 0) {
            // 목만 선택 → 미니거상 (목·턱선)
            procedure = {
                name: "미니거상",
                levelName: "목·턱선 집중",
                description: "목주름과 턱선 라인을 집중적으로 개선",
                tags: ["#목리프팅", "#턱선정리", "#이중턱삭제"]
            };
        } else if (areaFocus === 'lowerFace' || (hasNeck && lowerFaceCount > 0 && midFaceCount === 0)) {
            // 하안면만 또는 하안면+목 → 미니거상 (하안면) 또는 (하안면+목)
            if (hasNeck) {
                procedure = {
                    name: "미니거상",
                    levelName: "하안면+목 2부위",
                    description: "턱선부터 목라인까지 동시에 끌어올리는 미니거상",
                    tags: ["#2부위시술", "#턱목동시개선", "#목거상포함"]
                };
            } else {
                procedure = {
                    name: "미니거상",
                    levelName: "하안면 집중",
                    description: "무너진 턱선과 입꼬리를 집중적으로 개선",
                    tags: ["#하안면특화", "#이중턱삭제", "#V라인복원"]
                };
            }
        } else if (areaFocus === 'midLower') {
            // 중안면 + 하안면 → 미니거상 (2부위)
            procedure = {
                name: "미니거상",
                levelName: "중·하안면 2부위",
                description: "볼부터 턱선까지 전체적인 얼굴 라인을 끌어올리는 미니거상",
                tags: ["#2부위시술", "#볼턱동시개선", "#V라인완성"]
            };
        }
        // combinedWithNeck (3부위 모두) 또는 midNeck (불가능 조합)은 안면거상 유지
    }

    // 부위 태그 추가
    if (!procedure.name.includes("거상")) {
        procedure.tags.push(`#${focusLabel}`);
    }

    // PLUS Logic - 피부 꺼짐이 확실히 있거나 심한 경우 PLUS 패키지 추가
    const needsPlus = input.volumeLoss === 'moderate' || input.volumeLoss === 'severe' ||
                      input.sagging === 'asymmetry' || input.priority === 'effect';

    if (needsPlus && procedure.name.includes("투명브이리프팅")) {
        procedure.levelName += " + PLUS";
        procedure.tags.push("#볼륨회복", "#피부재생");

        // PLUS 패키지 상세 정보
        procedure.plusPackage = {
            name: "시너지 볼륨 패키지",
            items: ["쥬베룩 볼륨", "아쿠아비비 스킨부스터"],
            description: "리프팅과 함께 꺼진 볼륨을 채우고 피부 탄력을 높이는 시너지 결합 패키지"
        };

        // 꺼짐 정도에 따른 설명 분기
        if (input.volumeLoss === 'severe') {
            procedure.description += " + 쥬베룩 볼륨 & 아쿠아비비 (심한 꺼짐 집중 케어)";
        } else if (input.volumeLoss === 'moderate') {
            procedure.description += " + 쥬베룩 볼륨 & 아쿠아비비 (볼륨 회복 케어)";
        } else {
            procedure.description += " + 볼륨 시술 결합 (시너지 효과)";
        }
    }

    // 4. Add-ons
    const addOns = [];

    // Eyes
    if (input.concerns.includes('eyes')) {
        if (input.subConcerns.underEye) {
            addOns.push({
                area: "눈밑 (Under Eye)",
                recommendation: "눈밑지방재배치 / 볼륨",
                description: "어둡고 불룩한 눈밑을 매끈하게 개선"
            });
        }
        if (input.subConcerns.upperEye) {
            addOns.push({
                area: "눈꺼풀 (Upper Eye)",
                recommendation: "눈썹하거상술 / 상안검",
                description: "처진 눈꺼풀을 걷어내어 시야 확보 및 동안 효과"
            });
        }
        if (!input.subConcerns.underEye && !input.subConcerns.upperEye) {
            addOns.push({
                area: "눈가 탄력",
                recommendation: "아이 리프팅 / 보톡스",
                description: "눈가 주름과 탄력 개선"
            });
        }
    }

    // Forehead
    if (input.concerns.includes('forehead')) {
        const isHeavy = (ageScore >= 3 || input.sagging === 'severe');
        addOns.push({
            area: "이마/미간",
            recommendation: isHeavy ? "내시경 이마거상" : "이마 필러/보톡스",
            description: isHeavy ? "무거운 이마를 확실하게 당겨주는 수술" : "주름을 펴고 볼륨을 채우는 시술"
        });
    }

    // Jawline triggers Neck check
    if (input.concerns.includes('jawline') && input.subConcerns.neck) {
        if (procedure.name.includes("거상")) {
            // Already likely covers it, but emphasize neck
            procedure.tags.push("#목거상포함");
        } else {
            addOns.push({
                area: "목 라인",
                recommendation: "목주름 전용 실리프팅",
                description: "깊은 목주름과 이중턱 동시 개선"
            });
        }
    }


    // 5. Reason Generation
    const saggingText = input.sagging === 'mild' ? '초기 탄력 저하' :
        input.sagging === 'moderate' ? '평균적인 처짐' :
            input.sagging === 'asymmetry' ? '좌우 비대칭' : '심한 탄력 저하';

    const volumeLossText = input.volumeLoss === 'none' ? '' :
        input.volumeLoss === 'mild' ? ', 약간의 볼륨 감소' :
            input.volumeLoss === 'moderate' ? ', 눈에 띄는 볼륨 꺼짐' : ', 심한 볼륨 손실';

    let reason = `고객님의 ${input.age} 피부 특성과 ${saggingText}${volumeLossText} 상태를 분석했습니다. `;

    // PLUS 패키지 추천 이유 추가
    if (needsPlus && procedure.plusPackage) {
        reason += "피부 꺼짐 개선을 위해 쥬베룩 볼륨과 아쿠아비비 스킨부스터를 함께 추천드립니다. ";
    }

    if (input.priority === 'safety') {
        reason += "안전과 자연스러움을 중요하게 생각하시기에 수술적 방법보다는 비절개 리프팅을 우선으로 설계했습니다.";
    } else if (input.priority === 'effect') {
        reason += "확실한 변화를 원하시므로 가장 효과적인 플랜을 제안합니다.";
    } else if (input.priority === 'recovery') {
        reason += "빠른 일상 복귀를 위해 붓기와 멍을 최소화하는 플랜입니다.";
    } else {
        reason += "오래 가는 유지기간을 위해 근본적인 개선이 가능한 플랜입니다.";
    }

    // 6. Alternative Plan Logic (Pivot)
    let alternative = null;

    if (procedure.levelName.includes("4+4")) {
        alternative = {
            name: "투명브이리프팅",
            levelName: "8+8 STANDARD",
            description: "더 확실한 라인 정리를 원하신다면",
            tags: ["#표준", "#탄력강화"]
        };
    } else if (procedure.levelName.includes("8+8")) {
        alternative = {
            name: "투명브이리프팅",
            levelName: "12+12 STRONG",
            description: "더 강력한 고정을 원하신다면",
            tags: ["#파워리프팅", "#유지기간UP"]
        };
    } else if (procedure.levelName.includes("12+12")) {
        // Main was Safety/Strong -> Alt is Mini Lift (Effect)
        alternative = {
            name: "투명미니리프팅",
            levelName: "DEEP",
            description: "유지기간 2배, 확실한 효과를 원하신다면",
            tags: ["#미니절개", "#반영구효과"]
        };
    } else if (procedure.levelName.includes("DEEP")) {
        // Main was DEEP Mini Lift -> Alt is Threads (Safety)
        alternative = {
            name: "투명브이리프팅",
            levelName: "12+12 STRONG",
            description: "수술 없이 안전한 리프팅을 원하신다면",
            tags: ["#비절개", "#부담없는"]
        };
    } else if (procedure.name === "미니거상") {
        // Main was 미니거상 -> Alt is 12+12 STRONG (Non-surgical)
        alternative = {
            name: "투명브이리프팅",
            levelName: "12+12 STRONG",
            description: "수술 부담 없이 비절개로 리프팅을 원하신다면",
            tags: ["#비절개", "#부담없는", "#빠른회복"]
        };
    } else if (procedure.name === "안면거상") {
        // Main was Full Facelift -> Alt is 미니거상 (Less invasive)
        alternative = {
            name: "미니거상",
            levelName: "부위별 미니거상",
            description: "전체 안면거상 대신 필요한 부위만 집중 시술",
            tags: ["#부위별맞춤", "#빠른회복", "#수면마취"]
        };
    }

    return {
        mainProcedure: procedure,
        alternativeProcedure: alternative,
        addOns,
        scores: { total: totalScore, ageScore, saggingScore, volumeLossScore },
        areaAnalysis,
        reason
    };
}
