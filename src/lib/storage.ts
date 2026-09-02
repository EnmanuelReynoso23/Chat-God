import { Conversation, UserSettings } from './types';

const CONVERSATIONS_KEY = 'chat_dios_conversations';
const ACTIVE_CONV_KEY = 'chat_dios_active_id';
const SETTINGS_KEY = 'chat_dios_user_settings';
const FAVORITES_KEY = 'chat_dios_saved_prayers';

export const DEFAULT_SETTINGS: UserSettings = {
  provider: 'server',
  model: 'gemini-2.5-flash',
  voicePitch: 1.0,
  voiceRate: 0.95,
  autoReadVoice: false,
};

export const getStoredConversations = (): Conversation[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
};

export const saveStoredConversations = (conversations: Conversation[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving conversations:', error);
  }
};

export const getActiveConversationId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_CONV_KEY);
};

export const setActiveConversationId = (id: string | null): void => {
  if (typeof window === 'undefined') return;
  if (id) {
    localStorage.setItem(ACTIVE_CONV_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_CONV_KEY);
  }
};

export const getStoredSettings = (): UserSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(data);
    if (!parsed.model || parsed.model === 'gemini-2.0-flash' || parsed.model === 'gemini-1.5-flash') {
      parsed.model = 'gemini-2.5-flash';
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
    }
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: UserSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const getFavorites = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleFavorite = (text: string): string[] => {
  const current = getFavorites();
  const exists = current.includes(text);
  const updated = exists ? current.filter(item => item !== text) : [text, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }
  return updated;
};
