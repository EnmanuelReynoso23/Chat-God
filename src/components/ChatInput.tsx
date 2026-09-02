'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Send, Square, Mic, MicOff, Sparkles, Compass } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onStop: () => void;
  suggestions?: string[];
  onSelectSuggestion?: (suggestion: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSubmit,
  isLoading,
  onStop,
  suggestions = [],
  onSelectSuggestion,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasSpeechRecognition(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, [setInput]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-4 sm:pb-6">
      {/* Suggestions Pills */}
      {suggestions.length > 0 && !input && (
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
          <span className="text-[11px] font-medium text-amber-400/80 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3" /> Sugerencias:
          </span>
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSuggestion && onSelectSuggestion(sug)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-amber-500/15 text-slate-300 hover:text-amber-200 border border-slate-800 hover:border-amber-500/30 transition-all"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Main Input Form */}
      <form
        onSubmit={onSubmit}
        className="relative flex items-end gap-2 p-2 sm:p-2.5 rounded-2xl glass-panel border border-amber-500/25 shadow-xl shadow-black/40 focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all"
      >
        {/* Voice Input Button */}
        {hasSpeechRecognition && (
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/40'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
            title={isListening ? 'Escuchando tu voz...' : 'Hablar por micrófono'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu inquietud, pide una oración o una guía bíblica..."
          rows={1}
          className="flex-1 bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-400/70 focus:outline-none resize-none max-h-48 py-1.5 px-2"
        />

        {/* Action Button (Send / Stop) */}
        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-all flex items-center justify-center"
            title="Detener respuesta"
          >
            <Square className="w-4 h-4 fill-amber-300" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
              input.trim()
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/25 scale-100 hover:scale-105 active:scale-95'
                : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
            }`}
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </form>

      <p className="text-[11px] text-center text-slate-400 mt-2">
        Un refugio de paz y sabiduría bíblica. No reemplaza el discernimiento pastoral ni profesional.
      </p>
    </div>
  );
};
