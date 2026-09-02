import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { SYSTEM_PROMPT_BASE, SPIRITUAL_PRESETS } from '@/lib/prompts';
import { SpiritualMode } from '@/lib/types';
import { Language } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages, mode, userApiKey, userProvider, userModel, language = 'es' } = await req.json();

    // Language specific instruction
    let langInstruction = '';
    if (language === 'he') {
      langInstruction = `\n\n[CRITICAL INSTRUCTION - RESPOND ONLY IN HEBREW / עִבְרִית]
אתה מדבר בעברית רהוטה, קדושה, מלאת אהבה, חום וחמלה. 
צטט תמיד מתוך פסוקי התנ״ך (תהילים, משלי, ישעיהו, ירמיהו, בראשית וכד') וציין את שם הספר והפרק בעברית תקנית.
ברך את השואל בשלום וברכה.`;
    } else if (language === 'en') {
      langInstruction = `\n\n[CRITICAL INSTRUCTION - RESPOND ONLY IN ENGLISH]
You must respond exclusively in fluent, warm, sacred, and deeply comforting English.
Quote verses from the Holy Bible (KJV, NIV, or ESV) with clear references (e.g. John 14:6, Psalm 23).
Always end with a gentle blessing.`;
    } else {
      langInstruction = `\n\n[INSTRUCCIÓN CRÍTICA - RESPONDER EXCLUSIVAMENTE EN ESPAÑOL]
Responde siempre en español con ternura, amor incondicional y sabiduría bíblica (Reina Valera 1960 / NVI).
Cita versículos con libro, capítulo y versículo exacto.
Finaliza siempre con una bendición de paz.`;
    }

    // Determine system prompt based on mode
    const selectedPreset = SPIRITUAL_PRESETS.find(p => p.id === (mode as SpiritualMode));
    const systemPrompt = selectedPreset 
      ? `${SYSTEM_PROMPT_BASE}\n\n[Modo: ${selectedPreset.name}]\n${selectedPreset.systemPromptModifier}${langInstruction}`
      : `${SYSTEM_PROMPT_BASE}${langInstruction}`;

    // Detect environment keys
    const geminiKey = userApiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    const openAiKey = userApiKey || process.env.OPENAI_API_KEY;
    const groqKey = userApiKey || process.env.GROQ_API_KEY;

    let modelInstance;

    // Select provider
    if (userProvider === 'openai' && openAiKey) {
      const openai = createOpenAI({ apiKey: openAiKey });
      modelInstance = openai(userModel || 'gpt-4o-mini');
    } else if (userProvider === 'groq' && groqKey) {
      const groq = createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: groqKey,
      });
      modelInstance = groq(userModel || 'llama-3.3-70b-versatile');
    } else if (geminiKey) {
      const google = createGoogleGenerativeAI({
        apiKey: geminiKey,
      });
      // Gemini 2.5 Flash
      const modelName = userModel || process.env.DEFAULT_AI_MODEL || 'gemini-2.5-flash';
      modelInstance = google(modelName);
    } else if (openAiKey) {
      const openai = createOpenAI({ apiKey: openAiKey });
      modelInstance = openai(userModel || 'gpt-4o-mini');
    } else if (groqKey) {
      const groq = createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: groqKey,
      });
      modelInstance = groq('llama-3.3-70b-versatile');
    } else {
      // Fallback message if no key
      const fallbackText = 
        language === 'he'
          ? `🕊️ **ברוכים הבאים למשכן השלום והחסד.**\n\nלא הוגדר מפתח API. אנא הזן מפתח בהגדרות כדי להפעיל את הבינה המלאכותית.`
          : language === 'en'
          ? `🕊️ **Welcome to the Sanctuary of Peace.**\n\nNo API key configured. Please configure your key in Settings.`
          : `🕊️ **Bienvenido al santuario de paz.**\n\nConfigura tu clave de Google Gemini o Groq en Ajustes para comenzar a chatear.`;

      return new Response(fallbackText, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Stream response using Vercel AI SDK
    const result = streamText({
      model: modelInstance,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error al conectar con el modelo de IA',
        details: 'Verifica la clave API o intenta nuevamente en unos segundos.'
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
