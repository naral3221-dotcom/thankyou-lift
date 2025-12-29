// Before/After Case Data Structure
// Folder to procedure mapping based on user specification

export type TreatmentCategory = 'tv' | 'mini' | 'face';
export type AreaType = 'lower' | 'mid' | 'combined';
export type AngleType = 1 | 2 | 3; // 1=정면, 2=반측면, 3=측면

export interface CaseImage {
  angle: AngleType;
  angleLabel: string;
  beforeImage: string;
  afterImage: string;
}

export interface BeforeAfterCase {
  id: string;
  caseNumber: number;
  folder: string;
  subFolder?: string;
  category: TreatmentCategory;
  procedureName: string;
  areaLabel?: string;
  images: CaseImage[];
}

// Folder mapping configuration
export const folderConfig = {
  // Level folders -> 투명브이리프팅 (레벨 구분 없이 통일)
  'level 1': { category: 'tv' as TreatmentCategory, procedureName: '투명브이리프팅' },
  'level 2': { category: 'tv' as TreatmentCategory, procedureName: '투명브이리프팅' },
  'level 3': { category: 'tv' as TreatmentCategory, procedureName: '투명브이리프팅' },
  'level 4': { category: 'tv' as TreatmentCategory, procedureName: '투명브이리프팅' },
  // Deep folder -> 투명미니리프팅
  'deep': { category: 'mini' as TreatmentCategory, procedureName: '투명미니리프팅' },
  // Face/Mini folders -> 안면거상/미니거상
  'face': { category: 'face' as TreatmentCategory, procedureName: '안면거상' },
  'mini': { category: 'face' as TreatmentCategory, procedureName: '미니거상' },
};

// Sub-folder area mapping (for level folders)
export const areaConfig = {
  'lower': '하안면',
  'mid': '중안면',
  'combined': '중/하안면',
};

// Angle labels
export const angleLabels: Record<AngleType, string> = {
  1: '정면',
  2: '반측면',
  3: '측면',
};

// Category display config
export const categoryConfig = {
  tv: { label: '투명브이리프팅', color: 'bg-primary' },
  mini: { label: '투명미니리프팅', color: 'bg-amber-500' },
  face: { label: '안면거상/미니거상', color: 'bg-purple-500' },
};

// Sub-filter options for TV category (부위별 구분)
export const tvSubFilters = [
  { id: 'all', label: '전체' },
  { id: 'mid', label: '중안면' },
  { id: 'lower', label: '하안면' },
  { id: 'combined', label: '중/하안면' },
];

// Static case data - generated from folder structure
// Images follow pattern: case{N}_{before|after} ({1|2|3}).{jpg|png}
export const beforeAfterCases: BeforeAfterCase[] = [
  // === DEEP (투명미니리프팅) ===
  {
    id: 'deep-case1',
    caseNumber: 1,
    folder: 'deep',
    category: 'mini',
    procedureName: '투명미니리프팅',
    areaLabel: 'Deep',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/deep/case1_before (1).webp', afterImage: '/images/cases/deep/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/deep/case1_before (2).webp', afterImage: '/images/cases/deep/case1_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/deep/case1_before (3).webp', afterImage: '/images/cases/deep/case1_after (3).webp' },
    ],
  },
  {
    id: 'deep-case5',
    caseNumber: 5,
    folder: 'deep',
    category: 'mini',
    procedureName: '투명미니리프팅',
    areaLabel: 'Deep',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/deep/case5_before (1).webp', afterImage: '/images/cases/deep/case5_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/deep/case5_before (2).webp', afterImage: '/images/cases/deep/case5_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/deep/case5_before (3).webp', afterImage: '/images/cases/deep/case5_after (3).webp' },
    ],
  },

  // === FACE (안면거상) ===
  {
    id: 'face-case1',
    caseNumber: 1,
    folder: 'face',
    category: 'face',
    procedureName: '안면거상',
    areaLabel: '안면거상',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/face/case1_before (1).webp', afterImage: '/images/cases/face/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/face/case1_before (2).webp', afterImage: '/images/cases/face/case1_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/face/case1_before (3).webp', afterImage: '/images/cases/face/case1_after (3).webp' },
    ],
  },
  // NOTE: face-case2 removed - no before images exist (only case_2 after files)
  {
    id: 'face-case3',
    caseNumber: 3,
    folder: 'face',
    category: 'face',
    procedureName: '안면거상',
    areaLabel: '안면거상',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/face/case3_before (1).webp', afterImage: '/images/cases/face/case3_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/face/case3_before (2).webp', afterImage: '/images/cases/face/case3_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/face/case3_before (3).webp', afterImage: '/images/cases/face/case3_after (3).webp' },
    ],
  },

  // === MINI (미니거상) ===
  {
    id: 'mini-case1',
    caseNumber: 1,
    folder: 'mini',
    category: 'face',
    procedureName: '미니거상',
    areaLabel: '미니거상',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/mini/case1_before (1).webp', afterImage: '/images/cases/mini/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/mini/case1_before (2).webp', afterImage: '/images/cases/mini/case1_after (2).webp' },
    ],
  },
  {
    id: 'mini-case2',
    caseNumber: 2,
    folder: 'mini',
    category: 'face',
    procedureName: '미니거상',
    areaLabel: '미니거상',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/mini/case2_before (1).webp', afterImage: '/images/cases/mini/case2_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/mini/case2_before (2).webp', afterImage: '/images/cases/mini/case2_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/mini/case2_before (3).webp', afterImage: '/images/cases/mini/case2_after (3).webp' },
    ],
  },
  {
    id: 'mini-case3',
    caseNumber: 3,
    folder: 'mini',
    category: 'face',
    procedureName: '미니거상',
    areaLabel: '미니거상',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/mini/case3_before (1).webp', afterImage: '/images/cases/mini/case3_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/mini/case3_before (2).webp', afterImage: '/images/cases/mini/case3_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/mini/case3_before (3).webp', afterImage: '/images/cases/mini/case3_after (3).webp' },
    ],
  },
  {
    id: 'mini-case4',
    caseNumber: 4,
    folder: 'mini',
    category: 'face',
    procedureName: '미니거상',
    areaLabel: '미니거상',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/mini/case4_before (1).webp', afterImage: '/images/cases/mini/case4_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/mini/case4_before (2).webp', afterImage: '/images/cases/mini/case4_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/mini/case4_before (3).webp', afterImage: '/images/cases/mini/case4_after (3).webp' },
    ],
  },
  {
    id: 'mini-case5',
    caseNumber: 5,
    folder: 'mini',
    category: 'face',
    procedureName: '미니거상',
    areaLabel: '미니거상',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/mini/case5_before (1).webp', afterImage: '/images/cases/mini/case5_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/mini/case5_before (2).webp', afterImage: '/images/cases/mini/case5_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/mini/case5_before (3).webp', afterImage: '/images/cases/mini/case5_after (3).webp' },
    ],
  },

  // === LEVEL 1 - COMBINED (투명브이리프팅 4+4 중/하안면) ===
  {
    id: 'level1-combined-case1',
    caseNumber: 1,
    folder: 'level 1',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 1/combined/case1_before (1).webp', afterImage: '/images/cases/level 1/combined/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 1/combined/case1_before (2).webp', afterImage: '/images/cases/level 1/combined/case1_after (2).webp' },
    ],
  },
  {
    id: 'level1-combined-case2',
    caseNumber: 2,
    folder: 'level 1',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 1/combined/case2. before (1).webp', afterImage: '/images/cases/level 1/combined/case2_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 1/combined/case2. before (2).webp', afterImage: '/images/cases/level 1/combined/case2_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 1/combined/case2. before (3).webp', afterImage: '/images/cases/level 1/combined/case2_after (3).webp' },
    ],
  },
  {
    id: 'level1-combined-case3',
    caseNumber: 3,
    folder: 'level 1',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 1/combined/case3_before (1).webp', afterImage: '/images/cases/level 1/combined/case3_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 1/combined/case3_before (2).webp', afterImage: '/images/cases/level 1/combined/case3_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 1/combined/case3_before (3).webp', afterImage: '/images/cases/level 1/combined/case3_after (3).webp' },
    ],
  },

  // === LEVEL 1 - LOWER (투명브이리프팅 4+4 하안면) ===
  {
    id: 'level1-lower-case1',
    caseNumber: 1,
    folder: 'level 1',
    subFolder: 'lower',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 1/lower/case1_before (1).webp', afterImage: '/images/cases/level 1/lower/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 1/lower/case1_before (2).webp', afterImage: '/images/cases/level 1/lower/case1_after (2).webp' },
    ],
  },
  {
    id: 'level1-lower-case2',
    caseNumber: 2,
    folder: 'level 1',
    subFolder: 'lower',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 1/lower/case2_before (1).webp', afterImage: '/images/cases/level 1/lower/case2_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 1/lower/case2_before (2).webp', afterImage: '/images/cases/level 1/lower/case2_after (2).webp' },
    ],
  },
  {
    id: 'level1-lower-case3',
    caseNumber: 3,
    folder: 'level 1',
    subFolder: 'lower',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 1/lower/case3_before (1).webp', afterImage: '/images/cases/level 1/lower/case3_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 1/lower/case3_before (2).webp', afterImage: '/images/cases/level 1/lower/case3_after (2).webp' },
    ],
  },
  {
    id: 'level1-lower-case4',
    caseNumber: 4,
    folder: 'level 1',
    subFolder: 'lower',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 1/lower/case4_before (1).webp', afterImage: '/images/cases/level 1/lower/case4_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 1/lower/case4_before (2).webp', afterImage: '/images/cases/level 1/lower/case4_after (2).webp' },
    ],
  },

  // === LEVEL 1 - MID (투명브이리프팅 4+4 중안면) ===
  {
    id: 'level1-mid-case1',
    caseNumber: 1,
    folder: 'level 1',
    subFolder: 'mid',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 1/mid/case1_before (1).webp', afterImage: '/images/cases/level 1/mid/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 1/mid/case1_before (2).webp', afterImage: '/images/cases/level 1/mid/case1_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 1/mid/case1_before (3).webp', afterImage: '/images/cases/level 1/mid/case1_after (3).webp' },
    ],
  },
  {
    id: 'level1-mid-case2',
    caseNumber: 2,
    folder: 'level 1',
    subFolder: 'mid',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 1/mid/case2_before (1).webp', afterImage: '/images/cases/level 1/mid/case2_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 1/mid/case2_before (2).webp', afterImage: '/images/cases/level 1/mid/case2_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 1/mid/case2_before (3).webp', afterImage: '/images/cases/level 1/mid/case2_after (3).webp' },
    ],
  },

  // === LEVEL 2 - COMBINED (투명브이리프팅 6+6 중/하안면) ===
  {
    id: 'level2-combined-case1',
    caseNumber: 1,
    folder: 'level 2',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 2/combined/case1_before (1).webp', afterImage: '/images/cases/level 2/combined/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 2/combined/case1_before (2).webp', afterImage: '/images/cases/level 2/combined/case1_after (2).webp' },
    ],
  },
  {
    id: 'level2-combined-case2',
    caseNumber: 2,
    folder: 'level 2',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 2/combined/case2_before (1).webp', afterImage: '/images/cases/level 2/combined/case2_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 2/combined/case2_before (2).webp', afterImage: '/images/cases/level 2/combined/case2_after (2).webp' },
    ],
  },
  {
    id: 'level2-combined-case3',
    caseNumber: 3,
    folder: 'level 2',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 2/combined/case3_before (1).webp', afterImage: '/images/cases/level 2/combined/case3_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 2/combined/case3_before (2).webp', afterImage: '/images/cases/level 2/combined/case3_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 2/combined/case3_before (3).webp', afterImage: '/images/cases/level 2/combined/case3_after (3).webp' },
    ],
  },
  {
    id: 'level2-combined-case4',
    caseNumber: 4,
    folder: 'level 2',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 2/combined/case4_before (1).webp', afterImage: '/images/cases/level 2/combined/case4_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 2/combined/case4_before (2).webp', afterImage: '/images/cases/level 2/combined/case4_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 2/combined/case4_before (3).webp', afterImage: '/images/cases/level 2/combined/case4_after (3).webp' },
    ],
  },

  // === LEVEL 2 - LOWER (투명브이리프팅 6+6 하안면) ===
  {
    id: 'level2-lower-case1',
    caseNumber: 1,
    folder: 'level 2',
    subFolder: 'lower',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 2/lower/case1_before (1).webp', afterImage: '/images/cases/level 2/lower/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 2/lower/case1_before (2).webp', afterImage: '/images/cases/level 2/lower/case1_after (2).webp' },
    ],
  },
  {
    id: 'level2-lower-case2',
    caseNumber: 2,
    folder: 'level 2',
    subFolder: 'lower',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 2/lower/case2_before (1).webp', afterImage: '/images/cases/level 2/lower/case2_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 2/lower/case2_before (2).webp', afterImage: '/images/cases/level 2/lower/case2_after (2).webp' },
    ],
  },
  {
    id: 'level2-lower-case3',
    caseNumber: 3,
    folder: 'level 2',
    subFolder: 'lower',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 2/lower/case3_before (1).webp', afterImage: '/images/cases/level 2/lower/case3_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 2/lower/case3_before (2).webp', afterImage: '/images/cases/level 2/lower/case3_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 2/lower/case3_before (3).webp', afterImage: '/images/cases/level 2/lower/case3_after (3).webp' },
    ],
  },
  // NOTE: level2-lower-case4 removed - files don't exist

  // === LEVEL 2 - MID (투명브이리프팅 6+6 중안면) ===
  {
    id: 'level2-mid-case1',
    caseNumber: 1,
    folder: 'level 2',
    subFolder: 'mid',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 2/mid/case1_before (1).webp', afterImage: '/images/cases/level 2/mid/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 2/mid/case1_before (2).webp', afterImage: '/images/cases/level 2/mid/case1_after (2).webp' },
    ],
  },
  {
    id: 'level2-mid-case2',
    caseNumber: 2,
    folder: 'level 2',
    subFolder: 'mid',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 2/mid/case2_before (1).webp', afterImage: '/images/cases/level 2/mid/case2_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 2/mid/case2_before (2).webp', afterImage: '/images/cases/level 2/mid/case2_after (2).webp' },
    ],
  },
  {
    id: 'level2-mid-case3',
    caseNumber: 3,
    folder: 'level 2',
    subFolder: 'mid',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 2/mid/case3_before (1).webp', afterImage: '/images/cases/level 2/mid/case3_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 2/mid/case3_before (2).webp', afterImage: '/images/cases/level 2/mid/case3_after (3).webp' },
    ],
  },

  // === LEVEL 3 - COMBINED (투명브이리프팅 8+8 중/하안면) ===
  {
    id: 'level3-combined-case1',
    caseNumber: 1,
    folder: 'level 3',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 3/combined/case1_before (1).webp', afterImage: '/images/cases/level 3/combined/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 3/combined/case1_before (2).webp', afterImage: '/images/cases/level 3/combined/case1_after (2).webp' },
    ],
  },
  {
    id: 'level3-combined-case2',
    caseNumber: 2,
    folder: 'level 3',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 3/combined/case2_before (1).webp', afterImage: '/images/cases/level 3/combined/case2_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 3/combined/case2_before (2).webp', afterImage: '/images/cases/level 3/combined/case2_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 3/combined/case2_before (3).webp', afterImage: '/images/cases/level 3/combined/case2_after (3).webp' },
    ],
  },
  {
    id: 'level3-combined-case3',
    caseNumber: 3,
    folder: 'level 3',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 3/combined/case3_before (1).webp', afterImage: '/images/cases/level 3/combined/case3_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 3/combined/case3_before (2).webp', afterImage: '/images/cases/level 3/combined/case3_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 3/combined/case3_before (3).webp', afterImage: '/images/cases/level 3/combined/case3_after (3).webp' },
    ],
  },
  {
    id: 'level3-combined-case4',
    caseNumber: 4,
    folder: 'level 3',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 3/combined/case4_before (1).webp', afterImage: '/images/cases/level 3/combined/case4_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 3/combined/case4_before (2).webp', afterImage: '/images/cases/level 3/combined/case4_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 3/combined/case4_before (3).webp', afterImage: '/images/cases/level 3/combined/case4_after (3).webp' },
    ],
  },

  // === LEVEL 3 - LOWER (투명브이리프팅 8+8 하안면) ===
  {
    id: 'level3-lower-case1',
    caseNumber: 1,
    folder: 'level 3',
    subFolder: 'lower',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 3/lower/case1_before (1).webp', afterImage: '/images/cases/level 3/lower/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 3/lower/case1_before (2).webp', afterImage: '/images/cases/level 3/lower/case1_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 3/lower/case1_before (3).webp', afterImage: '/images/cases/level 3/lower/case1_after (3).webp' },
    ],
  },
  {
    id: 'level3-lower-case2',
    caseNumber: 2,
    folder: 'level 3',
    subFolder: 'lower',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 3/lower/case2_before (1).webp', afterImage: '/images/cases/level 3/lower/case2_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 3/lower/case2_before (2).webp', afterImage: '/images/cases/level 3/lower/case2_after (2).webp' },
    ],
  },

  // === LEVEL 3 - MID (투명브이리프팅 8+8 중안면) ===
  {
    id: 'level3-mid-case1',
    caseNumber: 1,
    folder: 'level 3',
    subFolder: 'mid',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 3/mid/case1_before (1).webp', afterImage: '/images/cases/level 3/mid/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 3/mid/case1_before (2).webp', afterImage: '/images/cases/level 3/mid/case1_after (2).webp' },
    ],
  },
  {
    id: 'level3-mid-case2',
    caseNumber: 2,
    folder: 'level 3',
    subFolder: 'mid',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 3/mid/case2_before (1).webp', afterImage: '/images/cases/level 3/mid/case2_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 3/mid/case2_before (2).webp', afterImage: '/images/cases/level 3/mid/case2_after (2).webp' },
    ],
  },
  {
    id: 'level3-mid-case3',
    caseNumber: 3,
    folder: 'level 3',
    subFolder: 'mid',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 3/mid/case3_before (1).webp', afterImage: '/images/cases/level 3/mid/case3_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 3/mid/case3_before (2).webp', afterImage: '/images/cases/level 3/mid/case3_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 3/mid/case3_before (3).webp', afterImage: '/images/cases/level 3/mid/case3_after (3).webp' },
    ],
  },
  // NOTE: level3-mid-case4 and case5 removed - files don't exist

  // === LEVEL 4 - COMBINED (투명브이리프팅 12+12 중/하안면) ===
  {
    id: 'level4-combined-case1',
    caseNumber: 1,
    folder: 'level 4',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 4/combined/case1_before (1).webp', afterImage: '/images/cases/level 4/combined/case1_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 4/combined/case1_before (2).webp', afterImage: '/images/cases/level 4/combined/case1_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 4/combined/case1_before (3).webp', afterImage: '/images/cases/level 4/combined/case1_after (3).webp' },
    ],
  },
  {
    id: 'level4-combined-case2',
    caseNumber: 2,
    folder: 'level 4',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 4/combined/case2_before (1).webp', afterImage: '/images/cases/level 4/combined/case2_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 4/combined/case2_before (2).webp', afterImage: '/images/cases/level 4/combined/case2_after (2).webp' },
    ],
  },
  {
    id: 'level4-combined-case3',
    caseNumber: 3,
    folder: 'level 4',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 4/combined/case3_before (1).webp', afterImage: '/images/cases/level 4/combined/case3_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 4/combined/case3_before (2).webp', afterImage: '/images/cases/level 4/combined/case3_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 4/combined/case3_before (3).webp', afterImage: '/images/cases/level 4/combined/case3_after (3).webp' },
    ],
  },
  {
    id: 'level4-combined-case4',
    caseNumber: 4,
    folder: 'level 4',
    subFolder: 'combined',
    category: 'tv',
    procedureName: '투명브이리프팅',
    areaLabel: '중/하안면',
    images: [
      { angle: 1, angleLabel: '정면', beforeImage: '/images/cases/level 4/combined/case4_before (1).webp', afterImage: '/images/cases/level 4/combined/case4_after (1).webp' },
      { angle: 2, angleLabel: '반측면', beforeImage: '/images/cases/level 4/combined/case4_before (2).webp', afterImage: '/images/cases/level 4/combined/case4_after (2).webp' },
      { angle: 3, angleLabel: '측면', beforeImage: '/images/cases/level 4/combined/case4_before (3).webp', afterImage: '/images/cases/level 4/combined/case4_after (3).webp' },
    ],
  },
  // NOTE: level4-combined-case5 removed - files don't exist
];

// Helper functions
export function getCasesByCategory(category: TreatmentCategory): BeforeAfterCase[] {
  return beforeAfterCases.filter(c => c.category === category);
}

export function getCasesByFolder(folder: string): BeforeAfterCase[] {
  return beforeAfterCases.filter(c => c.folder === folder);
}

export function getCasesByFolderAndSub(folder: string, subFolder?: string): BeforeAfterCase[] {
  if (subFolder) {
    return beforeAfterCases.filter(c => c.folder === folder && c.subFolder === subFolder);
  }
  return beforeAfterCases.filter(c => c.folder === folder);
}
