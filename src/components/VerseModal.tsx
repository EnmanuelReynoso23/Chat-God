'use client';

import React, { useState } from 'react';
import { X, BookOpen, Volume2, VolumeX, Copy, Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { DAILY_VERSES } from '@/lib/prompts';
import { DailyVerse } from '@/lib/types';

interface VerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseVerseInChat: (verse: DailyVerse) => void;
}

export const VerseModal: React.FC<VerseModalProps> = ({
  isOpen,
  onClose,
  onUseVerseInChat,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const currentVerse = DAILY_VERSES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DAILY_VERSES.length);
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DAILY_VERSES.length) % DAILY_VERSES.length);
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleCopy = async () => {
    const textToCopy = `"${currentVerse.text}" — ${currentVerse.reference}\n\nReflexión: ${currentVerse.reflection}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const text = `${currentVerse.text}. ${currentVerse.reference}. Reflexión: ${currentVerse.reflection}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.92;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-amber-950/40 text-slate-100 overflow-hidden">
        {/* Glow ambient decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl -z-10" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold gold-gradient-text">Promesa & Versículo</h3>
              <p className="text-xs text-slate-400">Palabra de vida para tu corazón</p>
            </div>
          </div>
          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              {currentVerse.category}
            </span>
            <span className="text-xs text-slate-400">
              {currentIndex + 1} de {DAILY_VERSES.length}
            </span>
          </div>

          {/* Scripture Verse Quote */}
          <blockquote className="text-base sm:text-lg font-serif italic text-amber-100/95 leading-relaxed bg-amber-950/20 p-5 rounded-2xl border-l-4 border-amber-500">
            "{currentVerse.text}"
          </blockquote>

          {/* Reference */}
          <p className="text-sm font-semibold text-amber-400 text-right">
            — {currentVerse.reference}
          </p>

          {/* Reflection */}
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-300">Reflexión:</strong> {currentVerse.reflection}
            </p>
          </div>
        </div>

        {/* Actions & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleAudio}
              className={`p-2 rounded-xl transition-all ${
                isPlayingAudio ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Escuchar versículo"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Copiar"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={() => {
              onUseVerseInChat(currentVerse);
              onClose();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-semibold shadow-md shadow-amber-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reflexionar en el Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
