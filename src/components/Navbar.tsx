'use client';

import React from 'react';
import { Sparkles, BookOpen, Settings, Plus, Menu, Heart, Github } from 'lucide-react';
import { SpiritualPreset } from '@/lib/types';

interface NavbarProps {
  onNewChat: () => void;
  onOpenVerses: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  activePreset?: SpiritualPreset;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewChat,
  onOpenVerses,
  onOpenSettings,
  onToggleSidebar,
  activePreset,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-amber-500/20 px-3 sm:px-6 py-2.5 sm:py-3 transition-all">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 rounded-xl transition-all"
            title="Abrir historial de diálogos"
            aria-label="Abrir historial de diálogos"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onNewChat}>
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden border border-amber-400/40 shadow-md shadow-amber-500/20">
              <img 
                src="/divine_avatar.jpg" 
                alt="Logo Divino" 
                className="w-full h-full object-cover"
              />
              <div className="absolute -inset-0.5 bg-amber-400/20 rounded-xl blur-sm -z-10 animate-pulse-glow" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight gold-gradient-text flex items-center gap-1.5">
                Chat con Dios
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Libre
                </span>
              </span>
              <span className="text-[11px] text-slate-400 hidden xs:inline">
                {activePreset ? activePreset.name : 'Guía Espiritual & Bíblica'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all hover:scale-105"
            title="Comenzar un nuevo diálogo"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Nuevo Diálogo</span>
          </button>

          {/* Versículo del Día */}
          <button
            onClick={onOpenVerses}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 rounded-xl border border-slate-700/50 transition-all"
            title="Versículo de hoy y promesas bíblicas"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Versículo Diario</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 rounded-xl border border-slate-700/40 transition-all"
            title="Ajustes de Modelo & Voz"
            aria-label="Ajustes"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
