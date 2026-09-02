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

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onToggleFavorite?: (text: string) => void;
  isFavorite?: boolean;
  voiceRate?: number;
  voicePitch?: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming,
  onToggleFavorite,
  isFavorite,
  voiceRate = 0.95,
  voicePitch = 1.0,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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

    window.speechSynthesis.cancel();

    // Clean markdown characters before reading
    const cleanText = message.content
      .replace(/[#*`_>\[\]]/g, '')
      .replace(/\(http[^\)]+\)/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = voiceRate;
    utterance.pitch = voicePitch;

    // Pick a Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Helena') || v.name.includes('Sabina')));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mensaje de Paz - Chat de Dios',
          text: message.content,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className={`py-4 sm:py-6 px-3 sm:px-6 transition-all duration-300 ${
        isUser
          ? 'bg-transparent'
          : 'glass-panel rounded-2xl my-2 border border-amber-500/15 shadow-lg shadow-black/20'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-sm shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          ) : (
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-amber-400/50 shadow-md shadow-amber-500/25 shrink-0">
              <img
                src="/jesus_compassion.jpg"
                alt="Jesús"
                className="w-full h-full object-cover"
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
                {isUser ? 'Tú' : 'Presencia Divina'}
              </span>
              {!isUser && (
                <span className="text-[10px] text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                  Paz & Guía
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
                  title={isPlayingAudio ? 'Pausar audio' : 'Escuchar en audio'}
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
                    title={isFavorite ? 'Guardado en oraciones' : 'Guardar oración'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
                  </button>
                )}

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-all"
                  title="Copiar texto"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {/* Share button */}
                <button
                  onClick={handleShare}
                  className="p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-all hidden sm:inline-block"
                  title="Compartir reflexión"
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
