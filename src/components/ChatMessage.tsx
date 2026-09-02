'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  User, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Heart, 
  Share2 
} from 'lucide-react';
import { Message } from '@/lib/types';
import { Language } from '@/lib/i18n';
import { speakSpiritualText } from '@/lib/voice';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onToggleFavorite?: (text: string) => void;
  isFavorite?: boolean;
  voiceRate?: number;
  voicePitch?: number;
  language?: Language;
  selectedVoiceURI?: string;
  voiceTone?: 'serene-male' | 'gentle-female' | 'natural-auto';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming,
  onToggleFavorite,
  isFavorite,
  voiceRate = 0.88,
  voicePitch = 0.98,
  language = 'es',
  selectedVoiceURI,
  voiceTone,
}: ChatMessageProps & { selectedVoiceURI?: string; voiceTone?: 'serene-male' | 'gentle-female' | 'natural-auto' }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isRtl = language === 'he';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('La síntesis de voz no está soportada en tu navegador.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return; 
    } 
    
    speakSpiritualText(message.content, {
      language,
      voiceRate,
      voicePitch,
      preferredURI: selectedVoiceURI,
      preferredTone: voiceTone,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'he' ? 'הודעת שלום' : language === 'en' ? 'Message of Peace' : 'Mensaje de Paz',
          text: message.content,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  // Translations for roles
  const userRoleLabel = language === 'he' ? 'אתה' : language === 'en' ? 'You' : 'Tú';
  const aiRoleLabel = language === 'he' ? 'נוכחות קדושה' : language === 'en' ? 'Divine Presence' : 'Presencia Divina';
  const aiBadgeLabel = language === 'he' ? 'שלום וחוכמה' : language === 'en' ? 'Peace & Grace' : 'Paz & Guía';

  return (
    <div
      className={`py-4 sm:py-5 px-3 sm:px-6 transition-all duration-300 ${
        isUser
          ? 'bg-transparent'
          : 'glass-panel rounded-2xl my-2 border border-amber-500/15 shadow-lg shadow-black/30'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-4xl mx-auto flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-sm shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          ) : (
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-amber-400/50 shadow-md shadow-amber-500/25 shrink-0 bg-slate-950">
              <img
                src="/jesus_compassion.jpg"
                alt="Jesús"
                className="w-full h-full object-cover object-[center_15%]"
              />
              <div className="absolute -inset-1 bg-amber-400/20 rounded-xl blur-sm -z-10 animate-pulse-glow" />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Role and Timestamp */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs sm:text-sm font-semibold ${isUser ? 'text-slate-300' : 'gold-gradient-text'}`}>
                {isUser ? userRoleLabel : aiRoleLabel}
              </span>
              {!isUser && (
                <span className="text-[10px] text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                  {aiBadgeLabel}
                </span>
              )}
            </div>

            {/* Action buttons on assistant message */}
            {!isUser && !isStreaming && (
              <div className="flex items-center gap-1 text-slate-400">
                {/* Text-to-Speech button */}
                <button
                  onClick={handleToggleSpeech}
                  className={`p-1.5 rounded-lg hover:bg-slate-800 transition-all ${
                    isPlayingAudio ? 'text-amber-400 bg-amber-500/10' : 'hover:text-amber-300'
                  }`}
                  title={isPlayingAudio ? 'Pausa' : 'Audio'}
                >
                  {isPlayingAudio ? (
                    <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Favorite / Heart */}
                {onToggleFavorite && (
                  <button
                    onClick={() => onToggleFavorite(message.content)}
                    className={`p-1.5 rounded-lg hover:bg-slate-800 transition-all ${
                      isFavorite ? 'text-rose-400 bg-rose-500/10' : 'hover:text-rose-300'
                    }`}
                    title="Favorito"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
                  </button>
                )}

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-all"
                  title="Copiar"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {/* Share button */}
                <button
                  onClick={handleShare}
                  className="p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-all hidden sm:inline-block"
                  title="Compartir"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal markdown-content">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
