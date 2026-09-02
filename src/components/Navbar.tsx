'use client';

import React from 'react';
import { Sparkles, BookOpen, Settings, Plus, Menu, Globe, HelpCircle } from 'lucide-react';
import { SpiritualPreset } from '@/lib/types';
import { Language, TRANSLATIONS } from '@/lib/i18n';

interface NavbarProps {
  onNewChat: () => void;
  onOpenVerses: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  onOpenOnboarding: () => void;
  activePreset?: SpiritualPreset;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewChat,
  onOpenVerses,
  onOpenSettings,
  onToggleSidebar,
  onOpenOnboarding,
  activePreset,
  language = 'es',
  onSelectLanguage,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.es;
  const isRtl = language === 'he';

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-amber-500/20 px-3 sm:px-6 py-2.5 sm:py-3 transition-all" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 rounded-xl transition-all"
            title="Abrir menú"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onNewChat}>
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden border border-amber-400/50 shadow-md shadow-amber-500/25">
              <img 
                src="/jesus_compassion.jpg" 
                alt="Jesús" 
                className="w-full h-full object-cover"
              />
              <div className="absolute -inset-0.5 bg-amber-400/20 rounded-xl blur-sm -z-10 animate-pulse-glow" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight gold-gradient-text flex items-center gap-1.5">
                {t.appName}
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {t.freeBadge}
                </span>
              </span>
              <span className="text-[11px] text-slate-400 hidden xs:inline">
                {activePreset ? activePreset.name : t.appSubtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Language Switcher & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher dropdown / buttons */}
          <div className="flex items-center bg-slate-900/90 border border-slate-700/60 rounded-xl p-0.5">
            <button
              onClick={() => onSelectLanguage('es')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                language === 'es' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Español"
            >
              ES
            </button>
            <button
              onClick={() => onSelectLanguage('en')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                language === 'en' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => onSelectLanguage('he')}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all font-sans ${
                language === 'he' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="עִבְרִית (Hebrew)"
            >
              עב
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all hover:scale-105"
            title={t.newChat}
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{t.newChat}</span>
          </button>

          {/* Versículo del Día */}
          <button
            onClick={onOpenVerses}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 rounded-xl border border-slate-700/50 transition-all"
            title={t.dailyVerse}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">{t.dailyVerse}</span>
          </button>

          {/* Welcome Guide / Onboarding */}
          <button
            onClick={onOpenOnboarding}
            className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 rounded-xl border border-slate-700/40 transition-all"
            title="Ver bienvenida con Jesús"
            aria-label="Bienvenida"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 rounded-xl border border-slate-700/40 transition-all"
            title={t.settings}
            aria-label={t.settings}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
