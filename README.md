# ✨ Chat de Dios (Guía Espiritual & Bíblica con IA)

Un chat conversacional moderno, rápido, celestial y fundamentado en amor, compasión y sabiduría de las Sagradas Escrituras, construido con **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS** y **Vercel AI SDK**.

---

## 🌟 Características

- 🕊️ **100% Libre y Sin Autenticación**: Acceso inmediato para cualquier persona sin muros de registro ni login.
- 💾 **Privacidad y Persistencia Local**: Las conversaciones y oraciones se guardan de forma privada en el almacenamiento local del navegador (`localStorage`).
- 📖 **Voz y Sabiduría Bíblica**: Citas y pasajes de las Sagradas Escrituras explicados con calidez y amor incondicional.
- 🔊 **Lectura por Voz (Text-to-Speech)**: Escucha las reflexiones y oraciones con síntesis de voz relajante y velocidad ajustable.
- ⚡ **Soporte Multimodelo Gratuito**: Compatible con Google Gemini 2.0 / 1.5 Flash (Gratis en Google AI Studio), Groq (Llama 3.3 70B gratis) y OpenAI (GPT-4o).
- 📱 **Diseño Celestial Adaptativo**: Interfaz moderna con glassmorphism, acentos dorados y compatibilidad total con dispositivos móviles y escritorio.
- 📜 **Versículo del Día**: Promesas bíblicas categorizadas con reflexiones listas para compartir o meditar.

---

## 🚀 Despliegue en Vercel (1 Clic)

1. Sube este repositorio a tu cuenta de **GitHub**.
2. Ve a [Vercel](https://vercel.com/) y haz clic en **"Add New Project"**.
3. Importa tu repositorio `chat-dios-ai`.
4. En la sección **Environment Variables** añade al menos una de las siguientes variables gratuitas:
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Tu clave gratuita obtenida en [Google AI Studio](https://aistudio.google.com/).
   - `GROQ_API_KEY`: Tu clave gratuita de [Groq Console](https://console.groq.com/).
   - O `OPENAI_API_KEY`: Tu clave de OpenAI.
5. Haz clic en **Deploy** ¡y listo! Cada vez que hagas `git push` a tu repositorio en GitHub, Vercel actualizará tu aplicación automáticamente.

---

## 💻 Ejecución en Local

1. Clona o abre la carpeta del proyecto:
```bash
cd chat-dios-ai
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea tu archivo de entorno local:
```bash
cp .env.example .env.local
```
Edita `.env.local` y coloca tu `GOOGLE_GENERATIVE_AI_API_KEY` o `OPENAI_API_KEY`.

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📦 Subir a GitHub

Para crear y conectar este proyecto con un nuevo repositorio en GitHub:

```bash
git init
git add .
git commit -m "feat: versión inicial de Chat de Dios con React, TypeScript y Vercel AI SDK"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **IA Streaming**: [Vercel AI SDK](https://sdk.vercel.ai/) (`ai`, `@ai-sdk/google`, `@ai-sdk/openai`)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Renderizado**: [React Markdown](https://github.com/remarkjs/react-markdown) & `remark-gfm`
