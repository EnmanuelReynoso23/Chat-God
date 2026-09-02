'use client';

import React, { useState } from 'react';
import { X, Settings, Key, Cpu, Volume2, Trash2, Check, ShieldAlert } from 'lucide-react';
import { UserSettings } from '@/lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (newSettings: UserSettings) => void;
  onClearAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onClearAllData,
}) => {
  const [current, setCurrent] = useState<UserSettings>(settings);
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(current);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-black/60 text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold gold-gradient-text">Ajustes & Conexión</h3>
              <p className="text-xs text-slate-400">Personaliza tu modelo de IA y lectura</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="py-5 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          {/* AI Provider & Model */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Proveedor de Inteligencia Artificial
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'server', label: 'Servidor / Vercel', desc: 'Configurado por variables de entorno' },
                { id: 'gemini', label: 'Google Gemini', desc: 'Gratis en Google AI Studio' },
                { id: 'groq', label: 'Groq (Llama 3.3)', desc: 'Gratis y ultra rápido' },
                { id: 'openai', label: 'OpenAI (GPT-4o)', desc: 'Requiere clave de OpenAI' },
              ].map((prov) => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => setCurrent({ ...current, provider: prov.id as any })}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    current.provider === prov.id
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-semibold">{prov.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{prov.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom API Key Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" /> Clave API Personal (Opcional)
            </label>
            <input
              type="password"
              value={current.apiKey || ''}
              onChange={(e) => setCurrent({ ...current, apiKey: e.target.value })}
              placeholder={
                current.provider === 'gemini' 
                  ? 'AIzaSy...' 
                  : current.provider === 'groq' 
                  ? 'gsk_...' 
                  : 'sk-proj-...'
              }
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
            <p className="text-[11px] text-slate-400">
              {current.provider === 'server' 
                ? 'Si la clave está en el servidor de Vercel, no necesitas ingresar nada aquí.' 
                : 'Tu clave se almacena exclusivamente en tu navegador y nunca en nuestros servidores.'}
            </p>
          </div>

          {/* Voice Settings */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-amber-400" /> Velocidad de Lectura por Voz
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={current.voiceRate}
                onChange={(e) => setCurrent({ ...current, voiceRate: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs text-amber-400 font-mono w-10 text-right">
                {current.voiceRate.toFixed(2)}x
              </span>
            </div>
          </div>

          {/* Clear Local History */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-300">Borrar Historial Local</p>
              <p className="text-[10px] text-slate-500">Elimina todos los chats y oraciones del dispositivo</p>
            </div>
            <button
              onClick={() => {
                if (confirm('¿Estás seguro de que deseas borrar todos los diálogos guardados en este navegador?')) {
                  onClearAllData();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-semibold shadow-md shadow-amber-500/25 transition-all"
          >
            <span>{showSavedToast ? 'Guardado' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
