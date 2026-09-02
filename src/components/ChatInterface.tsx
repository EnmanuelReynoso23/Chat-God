'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Heart, 
  BookOpen, 
  Shield, 
  Flame, 
  Compass, 
  Sun, 
  ArrowRight,
  HeartHandshake
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { VerseModal } from './VerseModal';
import { SettingsModal } from './SettingsModal';
import { 
  Conversation, 
  Message, 
  SpiritualMode, 
  UserSettings, 
  DailyVerse 
} from '@/lib/types';
import { 
  SPIRITUAL_PRESETS, 
  DAILY_VERSES 
} from '@/lib/prompts';
import { 
  getStoredConversations, 
  saveStoredConversations, 
  getActiveConversationId, 
  setActiveConversationId, 
  getStoredSettings, 
  saveStoredSettings, 
  getFavorites, 
  toggleFavorite 
} from '@/lib/storage';

export const ChatInterface: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<SpiritualMode>('general');
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // UI Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const loadedConvs = getStoredConversations();
    const loadedActiveId = getActiveConversationId();
    const loadedSettings = getStoredSettings();
    const loadedFavs = getFavorites();

    setConversations(loadedConvs);
    setSettings(loadedSettings);
    setFavorites(loadedFavs);

    if (loadedActiveId) {
      const activeConv = loadedConvs.find((c) => c.id === loadedActiveId);
      if (activeConv) {
        setActiveId(activeConv.id);
        setMessages(activeConv.messages);
        if (activeConv.mode) setSelectedMode(activeConv.mode);
        return;
      }
    }

    if (loadedConvs.length > 0) {
      setActiveId(loadedConvs[0].id);
      setMessages(loadedConvs[0].messages);
      if (loadedConvs[0].mode) setSelectedMode(loadedConvs[0].mode);
    }
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle creating a new chat
  const handleNewChat = (mode: SpiritualMode = selectedMode) => {
    const newId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'Nuevo Diálogo',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      mode: mode,
    };

    const updated = [newConv, ...conversations];
    setConversations(updated);
    saveStoredConversations(updated);
    setActiveId(newId);
    setActiveConversationId(newId);
    setMessages([]);
    setSelectedMode(mode);
  };

  // Select an existing conversation
  const handleSelectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setActiveId(id);
      setActiveConversationId(id);
      setMessages(conv.messages);
      if (conv.mode) setSelectedMode(conv.mode);
    }
  };

  // Delete a conversation
  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    saveStoredConversations(updated);

    if (activeId === id) {
      if (updated.length > 0) {
        setActiveId(updated[0].id);
        setActiveConversationId(updated[0].id);
        setMessages(updated[0].messages);
      } else {
        handleNewChat(selectedMode);
      }
    }
  };

  // Clear all data
  const handleClearAllData = () => {
    localStorage.clear();
    setConversations([]);
    setActiveId(null);
    setMessages([]);
    setFavorites([]);
    handleNewChat('general');
  };

  // Save settings
  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  // Toggle favorite message
  const handleToggleFavorite = (text: string) => {
    const updated = toggleFavorite(text);
    setFavorites(updated);
  };

  // Stop streaming
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const userText = (textToSend || input).trim();
    if (!userText || isLoading) return;

    setInput('');

    const userMessage: Message = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: userText,
      createdAt: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Prepare assistant placeholder message
    const assistantMessageId = `msg_ast_${Date.now()}`;
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
    };

    setMessages([...updatedMessages, initialAssistantMessage]);

    // Setup abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          mode: selectedMode,
          userApiKey: settings.apiKey,
          userProvider: settings.provider,
          userModel: settings.model,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No se recibió flujo de datos');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        // Handle standard AI SDK data stream or plain text
        // Vercel AI SDK text streams typically prefix text with 0:"..." format
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const textContent = JSON.parse(line.substring(2));
              accumulatedContent += textContent;
            } catch {
              accumulatedContent += line.substring(2);
            }
          } else if (line.startsWith('d:') || line.startsWith('e:')) {
            // metadata / end tokens
            continue;
          } else if (line.length > 0 && !line.startsWith('8:') && !line.startsWith('2:')) {
            accumulatedContent += line;
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      }

      // Finalize and save to conversation history
      const finalAssistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: accumulatedContent,
        createdAt: Date.now(),
      };

      const finalMessagesList = [...updatedMessages, finalAssistantMessage];

      // Update conversations list
      let currentConvId = activeId;
      if (!currentConvId) {
        currentConvId = `conv_${Date.now()}`;
        setActiveId(currentConvId);
        setActiveConversationId(currentConvId);
      }

      // Title generation from first message if new
      const title =
        userText.length > 35 ? `${userText.slice(0, 35)}...` : userText;

      setConversations((prev) => {
        const exists = prev.some((c) => c.id === currentConvId);
        let updatedList: Conversation[];

        if (exists) {
          updatedList = prev.map((c) =>
            c.id === currentConvId
              ? {
                  ...c,
                  updatedAt: Date.now(),
                  messages: finalMessagesList,
                  title: c.title === 'Nuevo Diálogo' ? title : c.title,
                }
              : c
          );
        } else {
          updatedList = [
            {
              id: currentConvId!,
              title,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              messages: finalMessagesList,
              mode: selectedMode,
            },
            ...prev,
          ];
        }

        saveStoredConversations(updatedList);
        return updatedList;
      });

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error in chat request:', error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content:
                    '🕊️ No se pudo conectar en este instante con el servicio de IA. Por favor verifica tu conexión a internet o configura tu clave API en Ajustes.',
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const activePreset = SPIRITUAL_PRESETS.find((p) => p.id === selectedMode);

  return (
    <div className="flex h-screen w-full bg-celestial-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onNewChat={handleNewChat}
        selectedMode={selectedMode}
        onSelectMode={(mode) => {
          setSelectedMode(mode);
          handleNewChat(mode);
        }}
        favorites={favorites}
        onSelectFavorite={(fav) => {
          handleSendMessage(`Deseo reflexionar y orar sobre esto: "${fav}"`);
        }}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 relative">
        {/* Top Navbar */}
        <Navbar
          onNewChat={() => handleNewChat(selectedMode)}
          onOpenVerses={() => setIsVerseModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          activePreset={activePreset}
        />

        {/* Chat Stream & Welcome Area */}
        <main className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-4">
          {messages.length === 0 ? (
            /* Welcome Celestial Hero */
            <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 flex flex-col items-center text-center space-y-6">
              {/* Resplendent Halo Icon with Divine Artwork */}
              <div className="relative group cursor-pointer" onClick={() => setIsVerseModalOpen(true)}>
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl shadow-amber-500/40 animate-float transition-all group-hover:scale-105">
                  <img 
                    src="/divine_avatar.jpg" 
                    alt="Presencia Celestial" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -inset-2 bg-amber-400/25 rounded-3xl blur-2xl -z-10 animate-pulse-glow" />
              </div>

              {/* Title & Introduction */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight gold-gradient-text">
                  Que la Paz y la Gracia estén contigo
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                  {activePreset?.promptGreeting || 'Un espacio sagrado para dialogar con sabiduría, recibir consuelo en momentos difíciles, orar y profundizar en las Escrituras.'}
                </p>
              </div>

              {/* Spiritual Mode Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {SPIRITUAL_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedMode(preset.id);
                      handleNewChat(preset.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedMode === preset.id
                        ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
                {(activePreset?.suggestions || SPIRITUAL_PRESETS[0].suggestions).map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug)}
                    className="p-4 rounded-2xl glass-panel glass-panel-hover text-left flex items-center justify-between group transition-all"
                  >
                    <span className="text-xs sm:text-sm text-slate-200 group-hover:text-amber-300 font-medium">
                      "{sug}"
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>

              {/* Daily Verse Banner Teaser */}
              <div
                onClick={() => setIsVerseModalOpen(true)}
                className="w-full p-4 rounded-2xl bg-amber-950/20 border border-amber-500/25 hover:border-amber-500/50 cursor-pointer transition-all flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      Promesa del Día • {DAILY_VERSES[0].reference}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-1 italic">
                      "{DAILY_VERSES[0].text}"
                    </p>
                  </div>
                </div>
                <span className="text-xs text-amber-300 font-medium hidden sm:inline">
                  Ver reflexión →
                </span>
              </div>
            </div>
          ) : (
            /* Active Messages Stream */
            <div className="max-w-4xl mx-auto space-y-4 pb-4">
              {messages.map((message, idx) => (
                <ChatMessage
                  key={message.id || idx}
                  message={message}
                  isStreaming={isLoading && idx === messages.length - 1}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(message.content)}
                  voiceRate={settings.voiceRate}
                  voicePitch={settings.voicePitch}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Bottom Input Field */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          isLoading={isLoading}
          onStop={handleStop}
          suggestions={messages.length === 0 ? [] : activePreset?.suggestions.slice(0, 3)}
          onSelectSuggestion={(sug) => handleSendMessage(sug)}
        />
      </div>

      {/* Daily Verse Modal */}
      <VerseModal
        isOpen={isVerseModalOpen}
        onClose={() => setIsVerseModalOpen(false)}
        onUseVerseInChat={(verse) => {
          handleSendMessage(`Reflexionemos en este versículo: "${verse.text}" (${verse.reference})`);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onClearAllData={handleClearAllData}
      />
    </div>
  );
};
