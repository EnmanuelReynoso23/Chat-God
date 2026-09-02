'use client';

import React from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Plus, 
  X, 
  Heart, 
  Sparkles, 
  HeartHandshake, 
  Flame, 
  BookOpen, 
  Compass, 
  Sun,
  ShieldCheck
} from 'lucide-react';
import { Conversation, SpiritualMode, SpiritualPreset } from '@/lib/types';
import { SPIRITUAL_PRESETS } from '@/lib/prompts';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
  onNewChat: (mode?: SpiritualMode) => void;
  selectedMode: SpiritualMode;
  onSelectMode: (mode: SpiritualMode) => void;
  favorites: string[];
  onSelectFavorite: (text: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4 text-amber-400" />,
  HeartHandshake: <HeartHandshake className="w-4 h-4 text-rose-400" />,
  Flame: <Flame className="w-4 h-4 text-amber-500" />,
  BookOpen: <BookOpen className="w-4 h-4 text-blue-400" />,
  Compass: <Compass className="w-4 h-4 text-emerald-400" />,
  Sun: <Sun className="w-4 h-4 text-yellow-400" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  selectedMode,
  onSelectMode,
  favorites,
  onSelectFavorite,
}) => {
  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-celestial-900/95 backdrop-blur-xl border-r border-amber-500/15 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-slate-200 text-sm">Caminos de Reflexión</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Primary Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat(selectedMode);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nuevo Diálogo</span>
          </button>
        </div>

        {/* Spiritual Focus Categories */}
        <div className="px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/80 mb-2 px-1">
            Modo Espiritual
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {SPIRITUAL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectMode(preset.id);
                  onNewChat(preset.id);
                  onClose();
                }}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left transition-all ${
                  selectedMode === preset.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                    : 'bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                }`}
              >
                {iconMap[preset.icon] || <Sparkles className="w-4 h-4 text-amber-400" />}
                <span className="truncate">{preset.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Previous Conversations List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Diálogos Anteriores ({conversations.length})
          </p>

          {conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 italic">
              No tienes diálogos guardados. Tus conversaciones se guardan automáticamente en tu dispositivo.
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  onSelectConversation(conv.id);
                  onClose();
                }}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                  activeId === conv.id
                    ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-amber-400" />
                  <span className="truncate font-medium">{conv.title || 'Diálogo de fe'}</span>
                </div>
                <button
                  onClick={(e) => onDeleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all ml-1"
                  title="Eliminar diálogo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}

          {/* Favorited Verses / Prayers */}
          {favorites.length > 0 && (
            <div className="pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/80 mb-2 px-1 flex items-center gap-1.5">
                <Heart className="w-3 h-3 fill-amber-400" />
                Oraciones Guardadas ({favorites.length})
              </p>
              <div className="space-y-1.5">
                {favorites.map((fav, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectFavorite(fav);
                      onClose();
                    }}
                    className="p-2 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/20 rounded-lg text-xs text-amber-200/90 cursor-pointer line-clamp-2 transition-all"
                  >
                    "{fav}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info: 100% Private, No Login */}
        <div className="p-3 border-t border-slate-800/80 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Privado • Sin Autenticación</span>
          </div>
        </div>
      </aside>
    </>
  );
};
