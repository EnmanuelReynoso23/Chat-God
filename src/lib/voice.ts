import { Language } from './i18n';

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  displayName: string;
  isNatural: boolean;
  gender: 'male' | 'female' | 'neutral';
}

export const getAvailableSpiritualVoices = (language: Language): VoiceOption[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];

  const voices = window.speechSynthesis.getVoices();
  const langPrefix = language === 'he' ? 'he' : language === 'en' ? 'en' : 'es';
  const matchingVoices = voices.filter(v => v.lang.startsWith(langPrefix));

  return matchingVoices.map(v => {
    const isNatural = v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Neural');
    const nameLower = v.name.toLowerCase();
    
    let gender: 'male' | 'female' | 'neutral' = 'neutral';
    if (nameLower.includes('alvaro') || nameLower.includes('jorge') || nameLower.includes('guy') || nameLower.includes('christopher') || nameLower.includes('avri') || nameLower.includes('pablo') || nameLower.includes('raul') || nameLower.includes('david') || nameLower.includes('diego')) {
      gender = 'male';
    } else if (nameLower.includes('sabina') || nameLower.includes('elvira') || nameLower.includes('jenny') || nameLower.includes('hila') || nameLower.includes('helena') || nameLower.includes('laura') || nameLower.includes('monica') || nameLower.includes('samantha') || nameLower.includes('carmit') || nameLower.includes('sofia')) {
      gender = 'female';
    }

    let cleanName = v.name.replace('Microsoft ', '').replace(' Online (Natural)', ' (Natural)').replace(' Desktop', '');
    if (isNatural) cleanName = `✨ ${cleanName}`;

    return {
      voice: v,
      displayName: cleanName,
      isNatural,
      gender,
    };
  }).sort((a, b) => {
    // Prioritize natural neural voices
    if (a.isNatural && !b.isNatural) return -1;
    if (!a.isNatural && b.isNatural) return 1;
    return a.displayName.localeCompare(b.displayName);
  });
};

export const getBestSpiritualVoice = (
  language: Language, 
  preferredURI?: string,
  preferredTone?: 'serene-male' | 'gentle-female' | 'natural-auto'
): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // 1. Direct URI preference
  if (preferredURI) {
    const found = voices.find(v => v.voiceURI === preferredURI);
    if (found) return found;
  }

  const langPrefix = language === 'he' ? 'he' : language === 'en' ? 'en' : 'es';
  const matching = voices.filter(v => v.lang.startsWith(langPrefix));
  if (matching.length === 0) return voices[0] || null;

  // 2. Filter by tone if requested
  if (preferredTone === 'serene-male') {
    const maleNatural = matching.find(v => 
      (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google')) &&
      (v.name.toLowerCase().includes('alvaro') || v.name.toLowerCase().includes('jorge') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('avri') || v.name.toLowerCase().includes('raul'))
    );
    if (maleNatural) return maleNatural;
  } else if (preferredTone === 'gentle-female') {
    const femaleNatural = matching.find(v => 
      (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google')) &&
      (v.name.toLowerCase().includes('sabina') || v.name.toLowerCase().includes('elvira') || v.name.toLowerCase().includes('jenny') || v.name.toLowerCase().includes('hila') || v.name.toLowerCase().includes('helena'))
    );
    if (femaleNatural) return femaleNatural;
  }

  // 3. Best overall Natural Neural voice
  const bestNatural = matching.find(v => 
    v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Alvaro') || v.name.includes('Guy') || v.name.includes('Avri')
  );
  if (bestNatural) return bestNatural;

  return matching[0] || null;
};

export const speakSpiritualText = (
  text: string,
  options: {
    language: Language;
    voiceRate?: number;
    voicePitch?: number;
    preferredURI?: string;
    preferredTone?: 'serene-male' | 'gentle-female' | 'natural-auto';
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/[#*`_>\[\]]/g, '')
    .replace(/\(http[^\)]+\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = options.language === 'he' ? 'he-IL' : options.language === 'en' ? 'en-US' : 'es-ES';
  
  // Serene and calm pacing for spiritual reflection
  utterance.rate = options.voiceRate ?? 0.88;
  utterance.pitch = options.voicePitch ?? 0.98;

  const voice = getBestSpiritualVoice(options.language, options.preferredURI, options.preferredTone);
  if (voice) {
    utterance.voice = voice;
  }

  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;
  if (options.onError) utterance.onerror = options.onError;

  window.speechSynthesis.speak(utterance);
};
