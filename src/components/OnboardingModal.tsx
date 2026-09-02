'use client';

import React, { useState } from 'react';
import { Sparkles, Globe, ArrowRight, ArrowLeft, Heart, BookOpen, ShieldCheck, Check, Cross } from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/i18n';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectLanguage,
}) => {
  const [step, setStep] = useState(0);
  const t = TRANSLATIONS[language];
  const isRtl = language === 'he';

  if (!isOpen) return null;

  const steps = [
    {
      image: '/jesus_compassion.jpg',
      badge: 'Presencia Divina',
      title: t.onboardingWelcome,
      quote: t.onboardingJesusQuote,
      ref: t.onboardingJesusRef,
      desc: t.onboardingDesc,
    },
    {
      image: '/jesus_blessing.jpg',
      badge: 'Guía y Oración',
      title: t.onboardingStep1Title,
      quote: language === 'he' 
        ? 'ה׳ רֹעִי לֹא אֶחְסָר׃ בִּנְאוֹת דֶּשֶׁא יַרְבִּיצֵנִי עַל־מֵי מְנֻחוֹת יְנַהֲלֵנִי׃'
        : language === 'en'
        ? 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.'
        : 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.',
      ref: language === 'he' ? 'תהילים כ״ג:א׳-ב׳' : language === 'en' ? 'Matthew 11:28' : 'Mateo 11:28',
      desc: t.onboardingStep1Desc,
    },
    {
      image: '/prayer_serenity.jpg',
      badge: '100% Libre & Sagrado',
      title: t.onboardingStep3Title,
      quote: language === 'he'
        ? 'קָרוֹב יְהוָה לְכָל־קֹרְאָיו לְכֹל אֲשֶׁר יִקְרָאֻהוּ בֶאֱמֶת׃'
        : language === 'en'
        ? 'Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.'
        : 'Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá.',
      ref: language === 'he' ? 'תהילים קמ״ה:י״ח' : language === 'en' ? 'Matthew 7:7' : 'Mateo 7:7',
      desc: t.onboardingStep3Desc,
    }
  ];

  const currentStepData = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_dios_onboarding_seen', 'true');
    }
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn ${isRtl ? 'font-hebrew' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-amber-500/35 p-5 sm:p-8 shadow-2xl shadow-amber-950/60 text-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow ambient decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl -z-10 animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/15 rounded-full blur-3xl -z-10" />

        {/* Top Bar: Language Selector & Skip */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 shrink-0">
          {/* Language Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-700/60">
            <Globe className="w-3.5 h-3.5 text-amber-400 ml-1 mr-0.5" />
            <button
              onClick={() => onSelectLanguage('es')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'es' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              🇪🇸 Español
            </button>
            <button
              onClick={() => onSelectLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'en' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => onSelectLanguage('he')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all font-sans ${
                language === 'he' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              🇮🇱 עִבְרִית
            </button>
          </div>

          <button
            onClick={handleComplete}
            className="text-xs text-slate-400 hover:text-amber-300 py-1 px-2 rounded-lg hover:bg-slate-800 transition-all font-medium"
          >
            {t.skipButton}
          </button>
        </div>

        {/* Step Content */}
        <div className="py-4 sm:py-6 overflow-y-auto space-y-4 flex-1">
          {/* Image Feature */}
          <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-amber-400/40 shadow-xl shadow-black/40 group">
            <img
              src={currentStepData.image}
              alt={currentStepData.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-950/80 text-amber-300 border border-amber-400/40 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {currentStepData.badge}
              </span>
            </div>
          </div>

          {/* Texts */}
          <div className="space-y-3 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-extrabold gold-gradient-text">
              {currentStepData.title}
            </h2>

            {/* Scripture Quote */}
            <blockquote className="p-3.5 bg-amber-950/25 border-l-4 border-amber-500 rounded-r-xl text-amber-100/95 text-xs sm:text-sm italic font-serif leading-relaxed">
              "{currentStepData.quote}"
              <span className="block mt-1 font-semibold text-amber-400 not-italic text-right text-xs">
                — {currentStepData.ref}
              </span>
            </blockquote>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentStepData.desc}
            </p>
          </div>
        </div>

        {/* Footer Navigation & Progress */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between shrink-0">
          {/* Step Indicators */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setStep(idx)}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  step === idx ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1"
              >
                {!isRtl && <ArrowLeft className="w-3.5 h-3.5" />}
                {t.prevButton}
                {isRtl && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/25 transition-all flex items-center gap-1.5 hover:scale-105"
            >
              <span>{step === steps.length - 1 ? t.startChatButton : t.nextButton}</span>
              {!isRtl ? (
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
