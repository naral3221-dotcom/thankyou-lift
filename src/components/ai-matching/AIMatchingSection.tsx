"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, ArrowRight, Check, Scan, Activity, Shield, Zap, Clock, TrendingUp, TrendingDown, Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, assetPath } from "@/lib/utils";
import type { MatchingStep } from "@/types";
import { calculateMatchingResult, type MatchingResult } from "@/lib/ai-matching";
import { CaseStudyViewer } from "@/components/ai-matching/CaseStudyViewer";

// Concern Areas (Step 1)
const concernAreas = [
  { id: "forehead", label: "이마/미간", code: "01" },
  { id: "eyes", label: "눈가/눈밑", code: "02" },
  { id: "cheeks", label: "볼/광대", code: "03" },
  { id: "jawline", label: "턱선/이중턱", code: "04" },
  { id: "nasolabial", label: "팔자주름", code: "05" },
  { id: "mouth", label: "입가주름", code: "06" },
];

// Priority/Expectation Options (Step 4)
const priorityOptions = [
  { id: "effect", label: "확실한 시술효과", icon: <Sparkles className="w-6 h-6" />, description: "눈에 띄는 확실한 변화를 원해요" },
  { id: "safety", label: "안전한 효과 부작용", icon: <Shield className="w-6 h-6" />, description: "부작용 없이 안전한 시술이 최우선이에요" },
  { id: "recovery", label: "빠른 일상복귀", icon: <Zap className="w-6 h-6" />, description: "며칠 붓기 없이 바로 출근하고 싶어요" },
  { id: "maintenance", label: "긴 유지기간", icon: <Clock className="w-6 h-6" />, description: "한 번 시술로 오랫동안 유지하고 싶어요" },
];

// Age Groups (Step 2)
const ageOptions = [
  { id: "20s", label: "20대", description: "초기 안티에이징" },
  { id: "30s", label: "30대", description: "탄력 저하 방지" },
  { id: "40s", label: "40대", description: "본격적인 리프팅" },
  { id: "50s", label: "50대 이상", description: "강력한 리프팅" },
];

// Sagging Severity Options (Step 3) - NEW
const saggingOptions = [
  { id: "mild", label: "약간 신경쓰임", description: "아직 심하진 않지만 신경쓰이고 싶어요", icon: <TrendingUp className="w-6 h-6" /> },
  { id: "moderate", label: "중등도 처짐", description: "예전 사진이랑 비교해서 확 달라요", icon: <Activity className="w-6 h-6" /> },
  { id: "severe", label: "심한 처짐", description: "눈에 띄게 탄력이 떨어진 거 같아요", icon: <TrendingDown className="w-6 h-6" /> },
  { id: "asymmetry", label: "좌우 비대칭", description: "양쪽 얼굴의 처짐 정도가 달라요", icon: <Scale className="w-6 h-6" /> },
];

// Volume Loss Options (Step 4) - NEW
const volumeLossOptions = [
  { id: "none", label: "없음", description: "볼륨 감소 없이 탱탱해요", icon: <Shield className="w-6 h-6" /> },
  { id: "mild", label: "약간 있는 것", description: "약간 꺼진 느낌이 있어요", icon: <TrendingUp className="w-6 h-6" /> },
  { id: "moderate", label: "확실히 있는 것", description: "보이는 관자놀이가 눈에 띄게 꺼졌어요", icon: <TrendingDown className="w-6 h-6" /> },
  { id: "severe", label: "심한 것", description: "전체적으로 볼륨이 많이 빠졌어요", icon: <Activity className="w-6 h-6" /> },
];

export function AIMatchingSection() {
  const [step, setStep] = useState<MatchingStep>("entry");
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [selectedSagging, setSelectedSagging] = useState<string>("");
  const [selectedVolumeLoss, setSelectedVolumeLoss] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [matchingResult, setMatchingResult] = useState<MatchingResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);



  const handleConcernToggle = (id: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Sub-concerns state (Step 1 Detail)
  const [selectedSubConcerns, setSelectedSubConcerns] = useState({
    neck: false,     // for jawline
    underEye: false, // for eyes
    upperEye: false, // for eyes
  });

  const handleSubConcernToggle = (key: string) => {
    setSelectedSubConcerns(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const goToStep = (nextStep: MatchingStep) => {
    if (nextStep === "loading") {
      setStep("loading");
      setIsAnalyzing(true);

      // Calculate Result
      const result = calculateMatchingResult({
        concerns: selectedConcerns,
        subConcerns: selectedSubConcerns,
        age: selectedAge,
        sagging: selectedSagging,
        volumeLoss: selectedVolumeLoss,
        priority: selectedPriority
      });
      setMatchingResult(result);

      // Analyze simulation
      setTimeout(() => {
        setStep("result");
        setIsAnalyzing(false);
      }, 3000);
    } else {
      setStep(nextStep);
    }
  };

  const resetMatching = () => {
    setStep("entry");
    setSelectedConcerns([]);
    setSelectedAge("");
    setSelectedSagging("");
    setSelectedVolumeLoss("");
    setSelectedPriority("");
    setSelectedSubConcerns({ neck: false, underEye: false, upperEye: false });
    setIsAnalyzing(false);
  };

  return (
    <section className={cn(
      "relative py-24 bg-[#050510] min-h-[800px] lg:flex lg:items-center",
      step === 'result' ? "overflow-x-clip overflow-y-visible" : "overflow-hidden"
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 mix-blend-screen pointer-events-none"
        >
          <source src={assetPath("/images/ai-matching/bg_mv.webm")} type="video/webm" />
          <source src={assetPath("/images/ai-matching/bg_mv.mp4")} type="video/mp4" />
        </video>
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-[#050510]/80" />
      </div>

      <div className={cn(
        "relative z-10 w-full max-w-6xl mx-auto transition-all duration-500",
        step === 'result'
          ? "flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start"
          : "grid lg:grid-cols-2 gap-12 items-center",
        step !== 'entry' ? "bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-[40px] p-4 sm:p-6 lg:p-12" : "px-4 sm:px-6"
      )}>

        {/* Left Column: Visuals & 3D Asset */}
        <div className={cn(
          "flex flex-col gap-6 min-w-0",
          step === 'result'
            ? "order-2 lg:order-1 w-full max-w-full overflow-hidden"  // 모바일: 2번째 (ResultUI 아래), 데스크탑: 1번째 (왼쪽)
            : "order-2 lg:order-1"  // 기본: 모바일 아래, 데스크탑 왼쪽
        )}>
          <div className={cn(
            "relative flex items-center justify-center",
            step === 'result' ? "min-h-0 h-auto" : "min-h-[400px] lg:min-h-[600px] h-auto"
          )}>
            {/* Main 3D Face */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className={cn(
                "relative w-full max-w-[500px] flex items-center justify-center",
                step === 'result' ? "h-auto" : "h-[400px] lg:h-[600px]"
              )}
            >
              {/* AI Visual Container (Switch between Video & Image) */}
              <div className={cn(
                "z-10 flex items-center justify-center",
                step === 'result'
                  ? "relative w-full"
                  : "absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent"
              )}>
                <AnimatePresence mode="wait">
                  {step === 'result' && matchingResult ? (
                    <motion.div
                      key="case-study"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full max-w-full h-auto flex flex-col gap-6 overflow-hidden hidden lg:flex"
                    >
                      {/* 데스크탑에서만 CaseStudyViewer 표시 (왼쪽 영역) */}
                      <CaseStudyViewer result={matchingResult} />

                      {/* Moved 'Analyze Again' Button */}
                      <div className="w-full px-1">
                        <Button onClick={resetMatching} variant="outline" className="w-full h-14 border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white text-lg rounded-xl">
                          다시 분석하기
                        </Button>
                      </div>
                    </motion.div>
                  ) : step === 'entry' ? (
                    <motion.video
                      key="video-face"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.9 }}
                      exit={{ opacity: 0 }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.3)] rounded-[30px]"
                    >
                      <source src={assetPath("/images/ai-matching/ai_mv.webm")} type="video/webm" />
                      <source src={assetPath("/images/ai-matching/ai_mv.mp4")} type="video/mp4" />
                    </motion.video>
                  ) : (
                    <motion.img
                      key="image-face"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.9 }}
                      exit={{ opacity: 0 }}
                      src={assetPath("/images/ai-matching/ai_scan_face_3d 1.webp")}
                      alt="AI Analysis Face Model"
                      className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Step 1: Concern Markers Overlay (Glow Effects) */}
              <AnimatePresence>
                {step === 'step1' && concernAreas.map((area) => {
                  const isSelected = selectedConcerns.includes(area.id);
                  // Precise positions
                  const positions: Record<string, string> = {
                    forehead: "top-[23%] left-[50%]",
                    eyes: "top-[43%] left-[63%]",
                    cheeks: "top-[58%] left-[28%]",
                    jawline: "top-[78%] left-[26%]",
                    nasolabial: "top-[64%] left-[60%]",
                    mouth: "top-[73%] left-[62%]"
                  };
                  const pos = positions[area.id] || "top-1/2 left-1/2";

                  return (
                    <motion.div
                      key={area.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none",
                        pos
                      )}
                    >
                      <div className="relative flex items-center justify-center w-full h-full">
                        {/* Glow Highlight (Selected) */}
                        {isSelected && (
                          <div className={cn(
                            "absolute w-20 h-20 rounded-full bg-primary/20 blur-xl animate-pulse transition-all duration-500",
                            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          )} />
                        )}

                        {/* Visible Marker (Always visible but styled differently if selected) */}
                        <div className={cn(
                          "relative flex items-center justify-center w-4 h-4 rounded-full transition-all duration-300",
                          isSelected ? "bg-primary/30 scale-125" : "bg-white/10"
                        )}>
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full shadow-[0_0_10px_theme('colors.primary.DEFAULT')] transition-all duration-300",
                            isSelected ? "bg-white scale-125" : "bg-white/50"
                          )} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Analysis History Log */}
          {step !== 'entry' && step !== 'loading' && step !== 'result' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur rounded-xl p-5 border border-white/10 w-full max-w-[500px] mx-auto"
            >
              <div className="flex items-center gap-2 mb-3 text-xs font-mono text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">
                <Activity className="w-3 h-3" /> Analysis Log
              </div>
              <div className="space-y-2 font-mono text-sm">
                {/* 1. Concerns */}
                <div className={cn("flex items-start gap-3", selectedConcerns.length > 0 ? "text-gray-300" : "text-gray-500")}>
                  <span className="text-[#7BB8D4] shrink-0 opacity-50">01</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedConcerns.length > 0 ? selectedConcerns.map(id => {
                      const area = concernAreas.find(a => a.id === id);
                      return (
                        <span key={id} className="bg-white/5 px-1.5 rounded text-xs text-secondary-foreground border border-white/10">
                          {area?.label}
                        </span>
                      );
                    }) : <span>Waiting for selection...</span>}
                  </div>
                </div>

                {/* 2. Age */}
                {step !== 'step1' && (
                  <div className={cn("flex items-center gap-3", selectedAge ? "text-gray-300" : "text-gray-500")}>
                    <span className={cn("shrink-0 opacity-50", step === 'step2' ? "text-[#7BB8D4] animate-pulse" : "text-[#7BB8D4]")}>02</span>
                    <span>AGE: {selectedAge ? `${selectedAge}` : "..."}</span>
                  </div>
                )}

                {/* 3. Sagging */}
                {(step === 'step3' || step === 'step4' || step === 'step5') && (
                  <div className={cn("flex items-center gap-3", selectedSagging ? "text-gray-300" : "text-gray-500")}>
                    <span className={cn("shrink-0 opacity-50", step === 'step3' ? "text-[#7BB8D4] animate-pulse" : "text-[#7BB8D4]")}>03</span>
                    <span>SAGGING: {selectedSagging ? (() => {
                      const map: Record<string, string> = { "mild": "초기", "moderate": "중기", "severe": "심화", "asymmetry": "비대칭" };
                      return map[selectedSagging] || selectedSagging;
                    })() : "..."}</span>
                  </div>
                )}

                {/* 4. Volume Loss */}
                {(step === 'step4' || step === 'step5') && (
                  <div className={cn("flex items-center gap-3", selectedVolumeLoss ? "text-gray-300" : "text-gray-500")}>
                    <span className={cn("shrink-0 opacity-50", step === 'step4' ? "text-[#7BB8D4] animate-pulse" : "text-[#7BB8D4]")}>04</span>
                    <span>VOLUME: {selectedVolumeLoss ? (() => {
                      const map: Record<string, string> = { "none": "없음", "mild": "약간", "moderate": "확실히", "severe": "심함" };
                      return map[selectedVolumeLoss] || selectedVolumeLoss;
                    })() : "..."}</span>
                  </div>
                )}

                {/* 5. Priority */}
                {step === 'step5' && (
                  <div className={cn("flex items-center gap-3", selectedPriority ? "text-gray-300" : "text-gray-500")}>
                    <span className="shrink-0 opacity-50 text-[#7BB8D4] animate-pulse">05</span>
                    <span>PRIORITY: {selectedPriority ? (() => {
                      const map: Record<string, string> = { "safety": "안전", "effect": "효과", "recovery": "회복", "maintenance": "유지" };
                      return map[selectedPriority] || selectedPriority;
                    })() : "..."}</span>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: UI & Interaction */}
        <div className={cn(
          "min-w-0 w-full overflow-hidden",
          step === 'result'
            ? "order-1 lg:order-2"  // 모바일: 1번째 (위), 데스크탑: 2번째 (오른쪽)
            : "order-1 lg:order-2"  // 기본: 모바일 위, 데스크탑 오른쪽
        )}>
          <AnimatePresence mode="wait">

            {/* Entry State */}
            {step === "entry" && (
              <motion.div
                key="entry"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center flex flex-col items-center"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded border border-[#7BB8D4]/30 bg-[#7BB8D4]/10 text-[#7BB8D4] mb-8 animate-pulse">
                  <Activity className="w-5 h-5" />
                  <span className="text-base font-bold font-mono tracking-widest">AI SYSTEM READY</span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary">AI 분석</span>으로 찾는<br />
                  나만의 리프팅 솔루션
                </h2>

                <p className="text-gray-300 mb-10 text-lg leading-relaxed max-w-md mx-auto">
                  밸런스랩의 50,000건의 임상 데이터를 바탕으로 고객님의 얼굴형과 상태를 정밀 분석하여 최적의 시술을 제안합니다.
                </p>

                <Button
                  size="xl"
                  onClick={() => goToStep("step1")}
                  className="relative h-16 px-12 rounded-none border border-[#7BB8D4] bg-[#7BB8D4]/10 hover:bg-[#7BB8D4]/20 text-[#7BB8D4] hover:text-white transition-all duration-300 text-xl font-bold group overflow-hidden"
                >
                  {/* Gradient Motion Background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />

                  <div className="relative z-10 flex items-center">
                    <Scan className="w-5 h-5 mr-3 group-hover:animate-spin" />
                    무료 AI 진단 시작하기
                  </div>
                </Button>
              </motion.div>
            )}

            {/* Dynamic Step Content */}
            {(step !== "entry" && step !== "result" && step !== "loading") && (
              <motion.div
                key="steps"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-white"
              >
                {step === "step1" ? (
                  <Step1UI
                    onNext={() => goToStep("step2")}
                    onBack={() => goToStep("entry")}
                    selected={selectedConcerns}
                    onToggle={handleConcernToggle}
                    subSelected={selectedSubConcerns}
                    onSubToggle={handleSubConcernToggle}
                  />
                ) : step === "step2" ? (
                  <Step2UI onNext={() => goToStep("step3")} onBack={() => goToStep("step1")} selected={selectedAge} onSelect={setSelectedAge} />
                ) : step === "step3" ? (
                  <Step3UI onNext={() => goToStep("step4")} onBack={() => goToStep("step2")} selected={selectedSagging} onSelect={setSelectedSagging} />
                ) : step === "step4" ? (
                  <Step4UI onNext={() => goToStep("step5")} onBack={() => goToStep("step3")} selected={selectedVolumeLoss} onSelect={setSelectedVolumeLoss} />
                ) : (
                  <Step5UI onNext={() => goToStep("loading")} onBack={() => goToStep("step4")} selected={selectedPriority} onSelect={setSelectedPriority} />
                )}
              </motion.div>
            )}

            {step === "loading" && (
              <LoadingUI />
            )}

            {step === "result" && matchingResult && (
              <ResultUI
                result={matchingResult}
                onReset={resetMatching}
              />
            )}

          </AnimatePresence>
        </div>
      </div >
    </section >
  );
}

// Sub-components
function Step1UI({ onNext, onBack, selected, onToggle, subSelected, onSubToggle }: any) {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center lg:text-left">
        <div className="text-[#7BB8D4] font-mono text-sm tracking-wider">STEP 01 / 05</div>
        <h3 className="text-3xl font-bold text-white">가장 고민되는 부위는?</h3>
        <p className="text-gray-300">복수 선택이 가능합니다.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {concernAreas.map(area => (
          <button
            key={area.id}
            onClick={() => onToggle(area.id)}
            className={cn(
              "relative p-4 rounded-lg text-left transition-all duration-300 group overflow-hidden border",
              selected.includes(area.id)
                ? "bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-primary/50"
            )}
          >
            <div className="relative z-10 flex flex-col items-center gap-3 py-2">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-mono transition-colors duration-300",
                selected.includes(area.id) ? "bg-primary text-white" : "bg-white/10 text-gray-300 group-hover:text-white group-hover:bg-primary/50"
              )}>
                {area.code}
              </div>
              <span className="font-medium tracking-wide">{area.label}</span>
            </div>

            {/* Sub-options for Eyes */}
            {selected.includes(area.id) && area.id === 'eyes' && (
              <div
                className="relative z-20 mt-3 pt-3 border-t border-white/10 w-full space-y-2 animate-in slide-in-from-top-2 fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer px-2 py-1.5 rounded hover:bg-white/5 transition-colors"
                  onClick={() => onSubToggle('underEye')}
                >
                  <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", subSelected.underEye ? "bg-primary border-primary" : "border-gray-400")}>
                    {subSelected.underEye && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span>눈밑처짐</span>
                </div>
                <div
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer px-2 py-1.5 rounded hover:bg-white/5 transition-colors"
                  onClick={() => onSubToggle('upperEye')}
                >
                  <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", subSelected.upperEye ? "bg-primary border-primary" : "border-gray-400")}>
                    {subSelected.upperEye && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span>눈두덩이 처짐</span>
                </div>
              </div>
            )}

            {/* Sub-options for Jawline */}
            {selected.includes(area.id) && area.id === 'jawline' && (
              <div
                className="relative z-20 mt-3 pt-3 border-t border-white/10 w-full animate-in slide-in-from-top-2 fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-white/5 transition-colors"
                  onClick={() => onSubToggle('neck')}
                >
                  <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", subSelected.neck ? "bg-primary border-primary" : "border-gray-400")}>
                    {subSelected.neck && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span>목까지 포함</span>
                </div>
              </div>
            )}

            {/* Selected Indicator */}
            {selected.includes(area.id) && (
              <motion.div
                layoutId="step1-indicator"
                className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none"
              />
            )}
          </button>
        ))}
      </div>
      <div className="flex justify-between pt-6 border-t border-white/10">
        <Button variant="ghost" onClick={onBack} className="text-gray-300 hover:text-white hover:bg-white/5">이전 단계</Button>
        <Button
          onClick={onNext}
          className={cn(
            "bg-primary text-white hover:bg-primary/90 transition-all",
            selected.length === 0 && "opacity-50 cursor-not-allowed"
          )}
          disabled={selected.length === 0}
        >
          다음 단계 <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

function Step2UI({ onNext, onBack, selected, onSelect }: any) {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center lg:text-left">
        <div className="text-[#7BB8D4] font-mono text-sm tracking-wider">STEP 02 / 05</div>
        <h3 className="text-3xl font-bold text-white">연령대를 선택해주세요</h3>
        <p className="text-gray-300">맞춤형 시술 추천을 위해 필요합니다.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {ageOptions.map(option => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={cn(
              "relative p-6 rounded-lg text-left transition-all duration-300 group overflow-hidden border flex flex-col items-center justify-center gap-2",
              selected === option.id
                ? "bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-primary/50"
            )}
          >
            <span className="text-2xl font-bold font-mono">{option.label}</span>
            <span className="text-xs text-gray-300">{option.description}</span>

            {selected === option.id && <Check className="absolute top-3 right-3 w-5 h-5 text-[#7BB8D4]" />}
          </button>
        ))}
      </div>
      <div className="flex justify-between pt-6 border-t border-white/10">
        <Button variant="ghost" onClick={onBack} className="text-gray-300 hover:text-white hover:bg-white/5">이전 단계</Button>
        <Button onClick={onNext} className="bg-primary text-white hover:bg-primary/90" disabled={!selected}>다음 단계 <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  )
}

function Step3UI({ onNext, onBack, selected, onSelect }: any) {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center lg:text-left">
        <div className="text-[#7BB8D4] font-mono text-sm tracking-wider">STEP 03 / 05</div>
        <h3 className="text-3xl font-bold text-white">현재 처짐 정도는?</h3>
        <p className="text-gray-300">본인이 느끼시는 상태를 선택해주세요.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {saggingOptions.map(option => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={cn(
              "relative p-6 rounded-lg text-left transition-all duration-300 group overflow-hidden border flex flex-col items-center justify-center gap-2",
              selected === option.id
                ? "bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-primary/50"
            )}
          >
            <div className={cn("mb-2", selected === option.id ? "text-[#7BB8D4]" : "text-gray-400 group-hover:text-[#7BB8D4] transition-colors")}>
              {option.icon}
            </div>
            <span className="text-xl font-bold">{option.label}</span>
            <span className="text-xs text-gray-400 text-center">{option.description}</span>

            {selected === option.id && <Check className="absolute top-3 right-3 w-5 h-5 text-[#7BB8D4]" />}
          </button>
        ))}
      </div>
      <div className="flex justify-between pt-6 border-t border-white/10">
        <Button variant="ghost" onClick={onBack} className="text-gray-300 hover:text-white hover:bg-white/5">이전 단계</Button>
        <Button onClick={onNext} className="bg-primary text-white hover:bg-primary/90" disabled={!selected}>다음 단계 <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  )
}

// Step 4: Volume Loss (얼굴 꺼짐)
function Step4UI({ onNext, onBack, selected, onSelect }: any) {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center lg:text-left">
        <div className="text-[#7BB8D4] font-mono text-sm tracking-wider">STEP 04 / 05</div>
        <h3 className="text-3xl font-bold text-white">얼굴 꺼짐 정도는?</h3>
        <p className="text-gray-300">볼/관자놀이/눈밑의 볼륨 감소 정도를 선택해주세요.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {volumeLossOptions.map(option => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={cn(
              "relative p-6 rounded-lg text-left transition-all duration-300 group overflow-hidden border flex flex-col items-center justify-center gap-2",
              selected === option.id
                ? "bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-primary/50"
            )}
          >
            <div className={cn("mb-2", selected === option.id ? "text-[#7BB8D4]" : "text-gray-400 group-hover:text-[#7BB8D4] transition-colors")}>
              {option.icon}
            </div>
            <span className="text-xl font-bold">{option.label}</span>
            <span className="text-xs text-gray-400 text-center">{option.description}</span>

            {selected === option.id && <Check className="absolute top-3 right-3 w-5 h-5 text-[#7BB8D4]" />}
          </button>
        ))}
      </div>
      <div className="flex justify-between pt-6 border-t border-white/10">
        <Button variant="ghost" onClick={onBack} className="text-gray-300 hover:text-white hover:bg-white/5">이전 단계</Button>
        <Button onClick={onNext} className="bg-primary text-white hover:bg-primary/90" disabled={!selected}>다음 단계 <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  )
}

// Step 5: Priority (우선순위)
function Step5UI({ onNext, onBack, selected, onSelect }: any) {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center lg:text-left">
        <div className="text-[#7BB8D4] font-mono text-sm tracking-wider">STEP 05 / 05</div>
        <h3 className="text-3xl font-bold text-white">최우선 고려 사항</h3>
        <p className="text-gray-300">AI가 시술 플랜을 최적화합니다.</p>
      </div>
      <div className="space-y-3">
        {priorityOptions.map(option => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={cn(
              "w-full p-5 rounded-lg border text-left flex items-center gap-4 transition-all hover:bg-white/5 relative overflow-hidden group",
              selected === option.id
                ? "bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(201,168,108,0.2)]"
                : "bg-transparent border-white/10 text-gray-300 hover:border-primary/50"
            )}
          >
            <div className={cn("p-2 rounded bg-white/5 transition-colors", selected === option.id && "bg-primary text-white")}>{option.icon}</div>
            <div className="relative z-10">
              <div className="font-bold text-lg flex items-center gap-2">
                {option.label}
                {selected === option.id && <span className="text-[10px] bg-primary/80 px-2 py-0.5 rounded text-white animate-fade-in">PRIORITY SET</span>}
              </div>
              <div className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">{option.description}</div>
            </div>
            {selected === option.id && <Check className="ml-auto text-[#7BB8D4] w-6 h-6 animate-in zoom-in" />}
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t border-white/10">
        <Button variant="ghost" onClick={onBack} className="text-gray-300 hover:text-white hover:bg-white/5">이전 단계</Button>
        <Button
          onClick={onNext}
          className="bg-primary text-white hover:bg-primary/90 h-12 px-8 text-lg"
          disabled={!selected}
        >
          결과 분석하기 <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
        </Button>
      </div>
    </div>
  )
}

function LoadingUI() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 25); // 0 to 100 in approx 2.5s (leaving 0.5s buffer before transition)

    return () => clearInterval(timer);
  }, []);

  const steps = [
    { label: "고민 고려부위 DATA", threshold: 10 },
    { label: "연령별 처짐유형 DATA", threshold: 30 },
    { label: "얼굴꺼짐/볼륨 DATA", threshold: 55 },
    { label: "최우선 고려사항 DATA", threshold: 75 },
  ];

  // SVG Circle Props
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Circular Gauge */}
      <div className="relative w-32 h-32 mb-8">
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-white/10"
          />
          {/* Progress Circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-[#7BB8D4] transition-all duration-75 ease-linear"
          />
        </svg>

        {/* Center Percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white font-mono">{progress}%</span>
          <span className="text-[10px] text-[#7BB8D4] animate-pulse">ANALYZING</span>
        </div>

        {/* Outer Glow Ring */}
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20"></div>
      </div>

      {/* Progress Checklist */}
      <div className="w-full max-w-xs space-y-3">
        {steps.map((step, index) => {
          const isCompleted = progress >= step.threshold + 20; // Complete after some buffer
          const isActive = progress >= step.threshold && !isCompleted;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 p-3 rounded border transition-all duration-300",
                isCompleted
                  ? "bg-primary/10 border-primary/30 text-white"
                  : isActive
                    ? "bg-white/5 border-white/20 text-gray-200"
                    : "bg-transparent border-transparent text-gray-500 grayscale opacity-60"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
                isCompleted ? "bg-primary border-primary" : "border-gray-400 bg-transparent"
              )}>
                {isCompleted && <Check className="w-3 h-3 text-white" />}
                {isActive && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
              </div>

              <div className="flex-1 text-sm font-medium tracking-wide">
                {step.label}
              </div>

              {isCompleted && <span className="text-xs text-[#7BB8D4] font-mono font-bold">OK</span>}
              {isActive && <span className="text-xs text-gray-300 font-mono animate-pulse">...</span>}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-gray-400 font-mono">
        AI가 고객님의 데이터를 분석하고 있습니다...
      </p>
    </div>
  )
}

function ResultUI({ result, onReset }: { result: MatchingResult, onReset: () => void }) {
  const { mainProcedure, addOns, reason, scores, alternativeProcedure, areaAnalysis } = result;

  return (
    <div className="text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6 flex items-center gap-3 text-[#7BB8D4] mb-8 border-b border-white/10 pb-4">
        <Sparkles className="w-6 h-6" />
        <span className="font-mono text-lg tracking-wider">ANALYSIS COMPLETE</span>
      </div>

      {/* 시술명 섹션 */}
      <div id="result-procedure-header" className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {mainProcedure.tags.map((tag, i) => (
            <span key={i} className="text-xs font-mono text-[#7BB8D4] bg-[#7BB8D4]/10 px-2 py-1 rounded border border-[#7BB8D4]/20">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          {mainProcedure.name}
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="text-xl font-bold text-[#7BB8D4]">{mainProcedure.levelName}</span>
          <span className="text-gray-300 text-sm sm:border-l sm:border-white/20 sm:pl-3">{mainProcedure.description}</span>
        </div>
      </div>

      {/* 모바일에서만 CaseStudyViewer 표시 (시술명 아래) */}
      <div className="lg:hidden mb-8 w-full max-w-full overflow-hidden">
        <CaseStudyViewer result={result} />
      </div>

      {/* PLUS Package Section */}
      {mainProcedure.plusPackage && (
        <div className="mb-8 p-5 border border-[#7BB8D4]/30 rounded-lg bg-gradient-to-br from-[#7BB8D4]/10 to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#7BB8D4]" />
            <span className="font-bold text-[#7BB8D4]">{mainProcedure.plusPackage.name}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {mainProcedure.plusPackage.items.map((item, i) => (
              <span key={i} className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-white font-medium">
                {item}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-200">{mainProcedure.plusPackage.description}</p>
        </div>
      )}

      {/* 부위 분석 결과 */}
      <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#7BB8D4]"></div>
          <span className="text-sm font-bold text-white">시술 적용 부위</span>
        </div>
        <div className="text-lg font-bold text-[#7BB8D4]">{areaAnalysis.focusLabel}</div>
        <div className="text-xs text-gray-300 mt-1">
          {areaAnalysis.midFaceCount > 0 && <span className="mr-2">중안면 {areaAnalysis.midFaceCount}개</span>}
          {areaAnalysis.lowerFaceCount > 0 && <span className="mr-2">하안면 {areaAnalysis.lowerFaceCount}개</span>}
          {areaAnalysis.hasNeck && <span>+ 목</span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 p-4 rounded text-center backdrop-blur-sm">
          <div className="text-3xl font-bold text-[#7BB8D4] mb-1">{Math.round(scores.total)}</div>
          <div className="text-xs text-gray-300 font-mono">TOTAL SCORE</div>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded text-center backdrop-blur-sm">
          <div className="text-3xl font-bold text-white mb-1">
            {result.mainProcedure.name.includes("미니") ? "14일" : "3일"}
          </div>
          <div className="text-xs text-gray-300 font-mono">RECOVERY</div>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded text-center backdrop-blur-sm">
          <div className="text-3xl font-bold text-white mb-1">4.9</div>
          <div className="text-xs text-gray-300 font-mono">SATISFACTION</div>
        </div>
      </div>

      {/* Add-ons Section */}
      {addOns.length > 0 && (
        <div className="grid gap-3 mb-8">
          {addOns.map((addon, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded bg-white/5 border border-white/10">
              <div className="bg-[#7BB8D4]/20 p-2 rounded text-[#7BB8D4]">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-[#7BB8D4] font-bold mb-1">{addon.area} 추천</div>
                <div className="font-bold text-white mb-1">{addon.recommendation}</div>
                <p className="text-xs text-gray-300">{addon.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-6 bg-[#7BB8D4]/10 border border-[#7BB8D4]/20 rounded-lg mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#7BB8D4]/5 animate-pulse pointer-events-none" />
        <h4 className="font-bold mb-3 flex items-center gap-2 relative z-10 text-lg">
          <Check className="w-5 h-5 text-[#7BB8D4]" /> AI 분석 리포트
        </h4>
        <p className="text-sm text-gray-200 leading-relaxed relative z-10 whitespace-pre-wrap">
          {reason}
        </p>
      </div>

      {/* Alternative Plan Section */}
      {alternativeProcedure && (
        <div className="mb-8 p-5 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-300 text-sm font-mono tracking-widest uppercase">
            <Scale className="w-4 h-4" /> Alternative Option
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h5 className="text-lg font-bold text-gray-200 mb-1">{alternativeProcedure.name}</h5>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-[#7BB8D4]/80">{alternativeProcedure.levelName}</span>
              </div>
              <p className="text-sm text-gray-300">{alternativeProcedure.description}</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              {alternativeProcedure.tags.map((tag, i) => (
                <span key={i} className="text-[10px] text-gray-300 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}



    </div >
  )
}
