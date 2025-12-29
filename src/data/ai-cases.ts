import type { AreaFocus } from "@/lib/ai-matching";

// 각도 타입
export type AngleType = 'front' | 'half' | 'side'; // (1) 정면, (2) 반측면, (3) 측면

// 각 단계별 B&A 이미지 셋 (같은 각도의 before/after)
export type CaseImage = {
    angle: AngleType;
    angleLabel: string;
    beforeImage: string;
    afterImage: string;
};

// 케이스 (한 사람의 여러 각도 이미지)
export type AICase = {
    id: string;
    caseNumber: number;
    description: string;
    images: CaseImage[];
    areaFocus?: AreaFocus;
};

// 케이스 그룹
export type CaseGroup = {
    levelName: string;
    reviewKeyword: string;
    cases: AICase[];
};

// 각도 라벨 매핑
const angleLabels: Record<AngleType, string> = {
    front: '정면',
    half: '반측면',
    side: '측면'
};

// 케이스 이미지 생성 헬퍼
function createCaseImages(basePath: string, caseNum: number, angles: number[]): CaseImage[] {
    return angles.map(angle => {
        const angleType: AngleType = angle === 1 ? 'front' : angle === 2 ? 'half' : 'side';
        return {
            angle: angleType,
            angleLabel: angleLabels[angleType],
            beforeImage: `${basePath}/case${caseNum}_before (${angle}).webp`,
            afterImage: `${basePath}/case${caseNum}_after (${angle}).webp`
        };
    });
}

// 케이스 생성 헬퍼
function createCase(id: string, caseNum: number, basePath: string, angles: number[], description: string, areaFocus?: AreaFocus): AICase {
    return {
        id,
        caseNumber: caseNum,
        description,
        images: createCaseImages(basePath, caseNum, angles),
        areaFocus
    };
}

// 확장자 자동 감지 헬퍼 (jpg 우선, fallback은 컴포넌트에서 처리)
function createCaseImagesWithExt(basePath: string, caseNum: number, angles: number[], ext: string = 'jpg'): CaseImage[] {
    return angles.map(angle => {
        const angleType: AngleType = angle === 1 ? 'front' : angle === 2 ? 'half' : 'side';
        return {
            angle: angleType,
            angleLabel: angleLabels[angleType],
            beforeImage: `${basePath}/case${caseNum}_before (${angle}).${ext}`,
            afterImage: `${basePath}/case${caseNum}_after (${angle}).${ext}`
        };
    });
}

// Map each AI Level to an ARRAY of Case Studies
// 실제 파일 구조 기반으로 업데이트함
export const aiCaseStudies: Record<string, CaseGroup> = {
    "4+4 LIGHT": {
        levelName: "Level 1 (4+4)",
        reviewKeyword: "4줄",
        cases: [
            // mid: case1(1,2,3).webp, case2(1,2,3).webp
            createCase("l1-mid-1", 1, "/images/cases/level 1/mid", [1, 2, 3], "중안면 볼/팔자 라인 정리", "midFace"),
            {
                id: "l1-mid-2",
                caseNumber: 2,
                description: "중안면 광대/팔자 개선",
                images: createCaseImagesWithExt("/images/cases/level 1/mid", 2, [1, 2, 3], 'webp'),
                areaFocus: "midFace"
            },
            // lower: case1~4(1,2).webp
            createCase("l1-lower-1", 1, "/images/cases/level 1/lower", [1, 2], "하안면 턱선 라인 정리", "lowerFace"),
            createCase("l1-lower-2", 2, "/images/cases/level 1/lower", [1, 2], "하안면 볼살 정리", "lowerFace"),
            createCase("l1-lower-3", 3, "/images/cases/level 1/lower", [1, 2], "하안면 V라인 개선", "lowerFace"),
            createCase("l1-lower-4", 4, "/images/cases/level 1/lower", [1, 2], "하안면 이중턱 개선", "lowerFace"),
            // combined: case1(1,2).webp, case2(1,2,3).webp, case3(1,2,3).webp
            createCase("l1-combined-1", 1, "/images/cases/level 1/combined", [1, 2], "중하안면 복합 라인 정리", "combined"),
            createCase("l1-combined-2", 2, "/images/cases/level 1/combined", [1, 2, 3], "자연스러운 V라인 완성", "combined"),
            createCase("l1-combined-3", 3, "/images/cases/level 1/combined", [1, 2, 3], "전체 얼굴 리프팅", "combined"),
        ]
    },
    "6+6 STANDARD": {
        levelName: "Level 2 (6+6)",
        reviewKeyword: "6줄",
        cases: [
            // mid: case1,2(1,2).webp, case3 - before(1,2).webp + after(1).webp,(3).webp
            createCase("l2-mid-1", 1, "/images/cases/level 2/mid", [1, 2], "중안면 볼/광대 확실한 리프팅", "midFace"),
            createCase("l2-mid-2", 2, "/images/cases/level 2/mid", [1, 2], "중안면 팔자 집중 개선", "midFace"),
            {
                id: "l2-mid-3",
                caseNumber: 3,
                description: "중안면 처짐 개선",
                images: [
                    { angle: 'front', angleLabel: '정면', beforeImage: "/images/cases/level 2/mid/case3_before (1).webp", afterImage: "/images/cases/level 2/mid/case3_after (1).webp" },
                    { angle: 'half', angleLabel: '반측면', beforeImage: "/images/cases/level 2/mid/case3_before (2).webp", afterImage: "/images/cases/level 2/mid/case3_after (3).webp" }
                ],
                areaFocus: "midFace"
            },
            // lower: case1,2(1,2).webp, case3(1,2,3).webp
            createCase("l2-lower-1", 1, "/images/cases/level 2/lower", [1, 2], "하안면 턱선 확실한 리프팅", "lowerFace"),
            createCase("l2-lower-2", 2, "/images/cases/level 2/lower", [1, 2], "하안면 볼살 개선", "lowerFace"),
            {
                id: "l2-lower-3",
                caseNumber: 3,
                description: "하안면 V라인 집중 개선",
                images: createCaseImagesWithExt("/images/cases/level 2/lower", 3, [1, 2, 3], 'webp'),
                areaFocus: "lowerFace"
            },
            // combined: case1,2,3(1,2).webp, case4(1,2,3).webp
            createCase("l2-combined-1", 1, "/images/cases/level 2/combined", [1, 2], "중하안면 복합 확실한 리프팅", "combined"),
            createCase("l2-combined-2", 2, "/images/cases/level 2/combined", [1, 2], "중하안면 자연스러운 개선", "combined"),
            createCase("l2-combined-3", 3, "/images/cases/level 2/combined", [1, 2], "복합 볼륨 리프팅", "combined"),
            createCase("l2-combined-4", 4, "/images/cases/level 2/combined", [1, 2, 3], "전체 얼굴 개선", "combined"),
        ]
    },
    "8+8 INTENSIVE": {
        levelName: "Level 3 (8+8)",
        reviewKeyword: "8줄",
        cases: [
            // mid: case1,2,3(1,2,3).webp
            createCase("l3-mid-1", 1, "/images/cases/level 3/mid", [1, 2, 3], "중안면 볼/광대 집중 개선", "midFace"),
            createCase("l3-mid-2", 2, "/images/cases/level 3/mid", [1, 2, 3], "중안면 팔자 탄력 개선", "midFace"),
            createCase("l3-mid-3", 3, "/images/cases/level 3/mid", [1, 2, 3], "중안면 처짐 집중 리프팅", "midFace"),
            // lower: case1(1,2,3).webp, case2(1,2).webp
            createCase("l3-lower-1", 1, "/images/cases/level 3/lower", [1, 2, 3], "하안면 턱선/입꼬리 집중 개선", "lowerFace"),
            createCase("l3-lower-2", 2, "/images/cases/level 3/lower", [1, 2], "하안면 V라인 탄력 개선", "lowerFace"),
            // combined: case1,2(1,2).webp, case3,4(1,2,3).webp
            createCase("l3-combined-1", 1, "/images/cases/level 3/combined", [1, 2], "중하안면 복합 탄력 개선", "combined"),
            createCase("l3-combined-2", 2, "/images/cases/level 3/combined", [1, 2], "중하안면 복합 리프팅", "combined"),
            createCase("l3-combined-3", 3, "/images/cases/level 3/combined", [1, 2, 3], "전체 얼굴 집중 개선", "combined"),
            createCase("l3-combined-4", 4, "/images/cases/level 3/combined", [1, 2, 3], "복합 볼륨 최강 리프팅", "combined"),
        ]
    },
    "12+12 STRONG": {
        levelName: "Level 4 (12+12)",
        reviewKeyword: "12줄",
        cases: [
            // combined만 존재: case1,3,4(1,2,3).webp, case2(1,2).webp
            createCase("l4-combined-1", 1, "/images/cases/level 4/combined", [1, 2, 3], "강력한 중하안면 처짐을 비례감으로 개선", "combined"),
            createCase("l4-combined-2", 2, "/images/cases/level 4/combined", [1, 2], "복합 처짐 최강 리프팅", "combined"),
            createCase("l4-combined-3", 3, "/images/cases/level 4/combined", [1, 2, 3], "전체 얼굴 최강 개선", "combined"),
            createCase("l4-combined-4", 4, "/images/cases/level 4/combined", [1, 2, 3], "비례감 최고 어려 리프팅", "combined"),
        ]
    },
    "DEEP": {
        levelName: "투명미니리프팅",
        reviewKeyword: "미니",
        cases: [
            createCase("deep-1", 1, "/images/cases/deep", [1, 2, 3], "유지기간 극대화 미니리프팅"),
            createCase("deep-5", 5, "/images/cases/deep", [1, 2, 3], "반영구적 효과의 미니거상"),
        ]
    },
    // 미니거상 - mini 폴더 (case1~5)
    "중안면 집중": {
        levelName: "미니거상",
        reviewKeyword: "미니거상",
        cases: [
            createCase("mini-1", 1, "/images/cases/mini", [1, 2], "미니거상으로 확실한 중안면 개선", "midFace"),
            createCase("mini-2", 2, "/images/cases/mini", [1, 2, 3], "미니거상 중안면 볼륨 개선", "midFace"),
        ]
    },
    "하안면 집중": {
        levelName: "미니거상",
        reviewKeyword: "미니거상",
        cases: [
            createCase("mini-1", 1, "/images/cases/mini", [1, 2], "미니거상으로 확실한 하안면 개선", "lowerFace"),
            createCase("mini-3", 3, "/images/cases/mini", [1, 2, 3], "미니거상 하안면 V라인 개선", "lowerFace"),
        ]
    },
    "목탄력섬 집중": {
        levelName: "미니거상",
        reviewKeyword: "미니거상",
        cases: [
            createCase("mini-2", 2, "/images/cases/mini", [1, 2, 3], "미니거상으로 목탄력섬 개선"),
            createCase("mini-3", 3, "/images/cases/mini", [1, 2, 3], "미니거상 목탄력섬 리프팅"),
        ]
    },
    "중하안면 2부위": {
        levelName: "미니거상",
        reviewKeyword: "미니거상",
        cases: [
            createCase("mini-1", 1, "/images/cases/mini", [1, 2], "미니거상으로 중하안면 복합 개선", "midLower"),
            createCase("mini-2", 2, "/images/cases/mini", [1, 2, 3], "미니거상 복합 리프팅", "midLower"),
            createCase("mini-3", 3, "/images/cases/mini", [1, 2, 3], "미니거상 전체 얼굴 개선", "midLower"),
            {
                id: "mini-4",
                caseNumber: 4,
                description: "미니거상 확실한 변화",
                images: createCaseImagesWithExt("/images/cases/mini", 4, [1, 2, 3], 'webp'),
                areaFocus: "midLower"
            },
            {
                id: "mini-5",
                caseNumber: 5,
                description: "미니거상 10살 어려지는 효과",
                images: createCaseImagesWithExt("/images/cases/mini", 5, [1, 2, 3], 'webp'),
                areaFocus: "midLower"
            },
        ]
    },
    "하안면+목 2부위": {
        levelName: "미니거상",
        reviewKeyword: "미니거상",
        cases: [
            createCase("mini-2", 2, "/images/cases/mini", [1, 2, 3], "미니거상으로 하안면+목 개선", "lowerNeck"),
            createCase("mini-3", 3, "/images/cases/mini", [1, 2, 3], "미니거상 목라인 집중 개선", "lowerNeck"),
            {
                id: "mini-4",
                caseNumber: 4,
                description: "미니거상 하안면+목 확실한 변화",
                images: createCaseImagesWithExt("/images/cases/mini", 4, [1, 2, 3], 'webp'),
                areaFocus: "lowerNeck"
            },
        ]
    },
    "FULL LIFT": {
        levelName: "안면거상",
        reviewKeyword: "거상",
        cases: [
            {
                id: "face-1",
                caseNumber: 1,
                description: "심한 처짐을 수술로 극적 변화",
                images: [
                    { angle: 'front', angleLabel: '정면', beforeImage: "/images/cases/face/case1_before (1).webp", afterImage: "/images/cases/face/case1_after (1).webp" },
                    { angle: 'half', angleLabel: '반측면', beforeImage: "/images/cases/face/case1_before (2).webp", afterImage: "/images/cases/face/case1_after (2).webp" },
                    { angle: 'side', angleLabel: '측면', beforeImage: "/images/cases/face/case1_before (3).webp", afterImage: "/images/cases/face/case1_after (3).webp" },
                ],
                areaFocus: "combinedWithNeck"
            },
            {
                id: "face-3",
                caseNumber: 3,
                description: "10살 젊으로 돌아가는 확실한 효과",
                images: [
                    { angle: 'front', angleLabel: '정면', beforeImage: "/images/cases/face/case3_before (1).webp", afterImage: "/images/cases/face/case3_after (1).webp" },
                    { angle: 'half', angleLabel: '반측면', beforeImage: "/images/cases/face/case3_before (2).webp", afterImage: "/images/cases/face/case3_after (2).webp" },
                    { angle: 'side', angleLabel: '측면', beforeImage: "/images/cases/face/case3_before (3).webp", afterImage: "/images/cases/face/case3_after (3).webp" },
                ],
                areaFocus: "combinedWithNeck"
            },
        ]
    }
};

// 전체 이미지 (B&A 쌍) 개수 계산
export function getTotalImageCount(caseGroup: CaseGroup): number {
    return caseGroup.cases.reduce((sum, c) => sum + c.images.length, 0);
}
