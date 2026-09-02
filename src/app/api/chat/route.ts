import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { SYSTEM_PROMPT_BASE, SPIRITUAL_PRESETS } from '@/lib/prompts';
import { SpiritualMode } from '@/lib/types';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, mode, userApiKey, userProvider, userModel } = await req.json();

    // Determine system prompt based on mode
    const selectedPreset = SPIRITUAL_PRESETS.find(p => p.id === (mode as SpiritualMode));
    const systemPrompt = selectedPreset 
      ? `${SYSTEM_PROMPT_BASE}\n\n[Enfoque especial para esta conversación: ${selectedPreset.name}]\n${selectedPreset.systemPromptModifier}`
      : SYSTEM_PROMPT_BASE;

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
      // Default to Google Gemini (Fast, high-quality, free-tier friendly)
      const google = createGoogleGenerativeAI({
        apiKey: geminiKey,
      });
      const modelName = userModel || process.env.DEFAULT_AI_MODEL || 'gemini-2.0-flash';
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
      // Friendly fallback stream if no API key is yet configured
      const fallbackText = `🕊️ **Bienvenido a la presencia de paz.**\n\nPara activar la conexión directa con los modelos de Inteligencia Artificial (Google Gemini, Groq o OpenAI):\n\n1. **Si eres el administrador**: Agrega tu clave en el archivo \`.env.local\` o en las variables de entorno de **Vercel** como \`GOOGLE_GENERATIVE_AI_API_KEY\` o \`GROQ_API_KEY\` (ambas son gratuitas).\n2. **Si estás probando como usuario**: Haz clic en el ícono de **⚙️ Ajustes** en la barra superior e ingresa tu propia clave gratuita de Google AI Studio o Groq.\n\n> "Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá." — Mateo 7:7\n\nQue la bendición y la tranquilidad te acompañen siempre. ✨`;

      return new Response(fallbackText, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Stream the response with Vercel AI SDK
    const result = streamText({
      model: modelInstance,
      system: systemPrompt,
      messages,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error al procesar la respuesta espiritual',
        details: 'Verifica la configuración de la clave API o intenta nuevamente en unos segundos.'
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
