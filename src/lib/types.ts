export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  mode?: SpiritualMode;
}

export type SpiritualMode = 
  | 'general'
  | 'peace'
  | 'prayer'
  | 'bible-study'
  | 'counsel'
  | 'gratitude';

export interface SpiritualPreset {
  id: SpiritualMode;
  name: string;
  description: string;
  icon: string;
  promptGreeting: string;
  systemPromptModifier: string;
  suggestions: string[];
}

export interface DailyVerse {
  reference: string;
  text: string;
  reflection: string;
  category: string;
}

export interface UserSettings {
  apiKey?: string;
  provider: 'gemini' | 'openai' | 'groq' | 'server';
  model: string;
  voicePitch: number;
  voiceRate: number;
  autoReadVoice: boolean;
  selectedVoiceURI?: string;
  voiceTone?: 'serene-male' | 'gentle-female' | 'natural-auto';
}
