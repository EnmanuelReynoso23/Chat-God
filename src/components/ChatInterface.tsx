'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
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
import { OnboardingModal } from './OnboardingModal';
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
  Language, 
  TRANSLATIONS 
} from '@/lib/i18n';
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
  const [language, setLanguage] = useState<Language>('es');
  
  // UI Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const t = TRANSLATIONS[language];
  const isRtl = language === 'he';

  // Initialize from localStorage on mount
  useEffect(() => {
    const loadedConvs = getStoredConversations();
    const loadedActiveId = getActiveConversationId();
    const loadedSettings = getStoredSettings();
    const loadedFavs = getFavorites();

    setConversations(loadedConvs);
    setSettings(loadedSettings);
    setFavorites(loadedFavs);

    // Language preference
    const savedLang = localStorage.getItem('chat_dios_language') as Language;
    if (savedLang && (savedLang === 'es' || savedLang === 'en' || savedLang === 'he')) {
      setLanguage(savedLang);
    }

    // Check if onboarding was already completed
    const onboardingSeen = localStorage.getItem('chat_dios_onboarding_seen');
    if (!onboardingSeen) {
      setIsOnboardingOpen(true);
    }

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

  const handleSelectLanguage = (newLang: Language) => {
    setLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_dios_language', newLang);
    }
  };

  // Handle creating a new chat
  const handleNewChat = (mode: SpiritualMode = selectedMode) => {
    const newId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: t.newChat,
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
          language: language,
          userApiKey: settings.apiKey,
          userProvider: settings.provider,
          userModel: settings.model,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No stream body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const textContent = JSON.parse(line.substring(2));
              accumulatedContent += textContent;
            } catch {
              accumulatedContent += line.substring(2);
            }
          } else if (line.startsWith('3:')) {
            // Protocol error line from AI SDK
            console.warn('AI SDK stream error received:', line);
            if (!accumulatedContent) {
              accumulatedContent = language === 'he'
                ? '🕊️ שגיאה בחיבור למודל הבינה המלאכותית. אנא נסה שוב בעוד מספר רגעים.'
                : language === 'en'
                ? '🕊️ Connection error with the AI model. Please try again in a few moments.'
                : '🕊️ Hubo un inconveniente momentáneo con el servicio de IA. Por favor intenta de nuevo en unos segundos.';
            }
          } else if (line.startsWith('d:') || line.startsWith('e:') || line.startsWith('f:') || line.startsWith('2:') || line.startsWith('8:')) {
            continue;
          } else if (line.length > 0 && !/^[0-9a-z]:/i.test(line)) {
            accumulatedContent += line;
          }
        }

        if (accumulatedContent) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: accumulatedContent }
                : msg
            )
          );
        }
      }

      // Finalize and save to conversation history
      const finalContent = accumulatedContent || (
        language === 'he'
          ? '🕊️ לא התקבלה תגובה. אנא נסה שוב.'
          : language === 'en'
          ? '🕊️ No response received. Please try again.'
          : '🕊️ No se recibió respuesta. Por favor intenta de nuevo.'
      );

      const finalAssistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: finalContent,
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
                  title: c.title === t.newChat || c.title === 'Nuevo Diálogo' ? title : c.title,
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
                    language === 'he'
                      ? '🕊️ לא ניתן להתחבר לשירות כרגע. אנא בדוק את החיבור לאינטרנט או הגדר מפתח API בהגדרות.'
                      : language === 'en'
                      ? '🕊️ Could not connect to the AI service. Please check your internet or configure your API key in Settings.'
                      : '🕊️ No se pudo conectar con el servicio de IA. Verifica tu conexión o configura tu clave en Ajustes.',
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

  const activeModeKey = selectedMode === 'bible-study' ? 'bibleStudy' : (selectedMode as keyof typeof t.modes);
  const currentModeInfo = t.modes[activeModeKey] || t.modes.general;

  return (
    <div className={`flex h-screen w-full bg-celestial-950 text-slate-100 overflow-hidden font-sans ${isRtl ? 'font-hebrew' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
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
          handleSendMessage(
            language === 'he'
              ? `ברצוני להרהר ולהתפלל על זה: "${fav}"`
              : language === 'en'
              ? `I wish to reflect and pray upon this: "${fav}"`
              : `Deseo reflexionar y orar sobre esto: "${fav}"`
          );
        }}
        language={language}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 relative">
        {/* Top Navbar */}
        <Navbar
          onNewChat={() => handleNewChat(selectedMode)}
          onOpenVerses={() => setIsVerseModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          activePreset={SPIRITUAL_PRESETS.find((p) => p.id === selectedMode)}
          language={language}
          onSelectLanguage={handleSelectLanguage}
        />

        {/* Chat Stream & Welcome Area */}
        <main className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-4">
          {messages.length === 0 ? (
            /* Welcome Celestial Hero */
            <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 flex flex-col items-center text-center space-y-5">
              {/* Resplendent Halo Icon with Jesus Portrait */}
              <div 
                className="relative group cursor-pointer" 
                onClick={() => setIsOnboardingOpen(true)}
                title="Presencia de Cristo"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl shadow-amber-500/40 animate-float transition-all group-hover:scale-105 bg-slate-950">
                  <img 
                    src="/jesus_compassion.jpg" 
                    alt="Jesús" 
                    className="w-full h-full object-cover object-[center_15%]"
                  />
                </div>
                <div className="absolute -inset-2 bg-amber-400/25 rounded-3xl blur-2xl -z-10 animate-pulse-glow" />
              </div>

              {/* Title & Introduction */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight gold-gradient-text">
                  {t.heroGreeting}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                  {currentModeInfo.greeting}
                </p>
              </div>

              {/* Spiritual Mode Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {SPIRITUAL_PRESETS.map((preset) => {
                  const mKey = preset.id === 'bible-study' ? 'bibleStudy' : (preset.id as keyof typeof t.modes);
                  const modeText = t.modes[mKey]?.name || preset.name;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedMode(preset.id);
                        handleNewChat(preset.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        selectedMode === preset.id
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {modeText}
                    </button>
                  );
                })}
              </div>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
                {currentModeInfo.suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug)}
                    className="p-4 rounded-2xl glass-panel glass-panel-hover text-left flex items-center justify-between group transition-all"
                    dir={isRtl ? 'rtl' : 'ltr'}
                  >
                    <span className="text-xs sm:text-sm text-slate-200 group-hover:text-amber-300 font-medium">
                      "{sug}"
                    </span>
                    <ArrowRight className={`w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-all shrink-0 ml-2 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                  </button>
                ))}
              </div>

              {/* Daily Verse Banner Teaser */}
              <div
                onClick={() => setIsVerseModalOpen(true)}
                className="w-full p-4 rounded-2xl bg-amber-950/20 border border-amber-500/25 hover:border-amber-500/50 cursor-pointer transition-all flex items-center justify-between text-left"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {t.dailyPromise} • {DAILY_VERSES[0].reference}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-1 italic">
                      "{DAILY_VERSES[0].text}"
                    </p>
                  </div>
                </div>
                <span className="text-xs text-amber-300 font-medium hidden sm:inline shrink-0">
                  {t.viewReflection}
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
                  language={language}
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
          suggestions={messages.length === 0 ? [] : currentModeInfo.suggestions.slice(0, 3)}
          onSelectSuggestion={(sug) => handleSendMessage(sug)}
          suggestionsTitle={t.suggestionsTitle}
        />
      </div>

      {/* Biblical Onboarding with Jesus */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        language={language}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Daily Verse Modal */}
      <VerseModal
        isOpen={isVerseModalOpen}
        onClose={() => setIsVerseModalOpen(false)}
        onUseVerseInChat={(verse) => {
          handleSendMessage(
            language === 'he'
              ? `הבה נהרהר בפסוק זה: "${verse.text}" (${verse.reference})`
              : language === 'en'
              ? `Let us reflect on this scripture: "${verse.text}" (${verse.reference})`
              : `Reflexionemos en este versículo: "${verse.text}" (${verse.reference})`
          );
        }}
        language={language}
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
