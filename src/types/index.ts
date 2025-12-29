// Review Types
export type ReviewSource =
  | "HOMEPAGE"
  | "NAVER_BLOG"
  | "NAVER_CAFE"
  | "GANGNAM_UNNI"
  | "BABITALK";

export interface ReviewData {
  id: string;
  source: ReviewSource;
  images: string[];
  title: string;
  author: string;
  tags: string[];
  rating?: number;
  date?: string;
}

export interface PhotoReviewData {
  id: string;
  beforeImage: string;
  afterImage: string;
  date: string;
  procedure: string;
  caseId: number;
}

export interface VideoReviewData {
  id: string;
  thumbnail: string;
  title: string;
  duration: string;
  views: string;
  date: string;
}

// AI Matching Types
export type MatchingStep = "entry" | "step1" | "step2" | "step3" | "step4" | "step5" | "loading" | "result";

export interface ConcernArea {
  id: string;
  label: string;
  icon: string;
}

export interface StylePreference {
  id: string;
  label: string;
  image: string;
  description: string;
}

export interface WorryOption {
  id: string;
  label: string;
  description: string;
}

export interface MatchingResult {
  recommendedProcedures: string[];
  matchScore: number;
  doctorRecommendation: string;
  estimatedRecovery: string;
}
