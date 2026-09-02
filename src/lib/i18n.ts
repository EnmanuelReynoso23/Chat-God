export type Language = 'es' | 'en' | 'he';

export interface Translation {
  appName: string;
  appSubtitle: string;
  freeBadge: string;
  newChat: string;
  dailyVerse: string;
  settings: string;
  history: string;
  spiritualFocus: string;
  noHistory: string;
  savedPrayers: string;
  privateBadge: string;
  inputPlaceholder: string;
  suggestionsTitle: string;
  disclaimer: string;
  heroGreeting: string;
  heroSubtitle: string;
  reflectInChat: string;
  viewReflection: string;
  dailyPromise: string;
  verseOf: string;
  listen: string;
  pause: string;
  copy: string;
  copied: string;
  share: string;
  close: string;
  onboardingTitle: string;
  onboardingWelcome: string;
  onboardingDesc: string;
  onboardingJesusQuote: string;
  onboardingJesusRef: string;
  onboardingStep1Title: string;
  onboardingStep1Desc: string;
  onboardingStep2Title: string;
  onboardingStep2Desc: string;
  onboardingStep3Title: string;
  onboardingStep3Desc: string;
  selectLanguage: string;
  startChatButton: string;
  nextButton: string;
  prevButton: string;
  skipButton: string;
  modes: {
    general: { name: string; desc: string; greeting: string; suggestions: string[] };
    peace: { name: string; desc: string; greeting: string; suggestions: string[] };
    prayer: { name: string; desc: string; greeting: string; suggestions: string[] };
    bibleStudy: { name: string; desc: string; greeting: string; suggestions: string[] };
    counsel: { name: string; desc: string; greeting: string; suggestions: string[] };
    gratitude: { name: string; desc: string; greeting: string; suggestions: string[] };
  };
}

export const TRANSLATIONS: Record<Language, Translation> = {
  es: {
    appName: 'Chat con Dios',
    appSubtitle: 'Guía Espiritual & Bíblica',
    freeBadge: 'Libre',
    newChat: 'Nuevo Diálogo',
    dailyVerse: 'Versículo Diario',
    settings: 'Ajustes',
    history: 'Diálogos Anteriores',
    spiritualFocus: 'Modo Espiritual',
    noHistory: 'No tienes diálogos guardados. Tus conversaciones se guardan en tu dispositivo.',
    savedPrayers: 'Oraciones Guardadas',
    privateBadge: '100% Privado • Sin Autenticación',
    inputPlaceholder: 'Escribe tu inquietud, pide una oración o una guía bíblica...',
    suggestionsTitle: 'Sugerencias',
    disclaimer: 'Un refugio de paz y sabiduría bíblica. No reemplaza el discernimiento pastoral ni profesional.',
    heroGreeting: 'Que la Paz y la Gracia estén contigo',
    heroSubtitle: 'Un espacio sagrado para dialogar con sabiduría, recibir consuelo en momentos difíciles, orar y profundizar en las Sagradas Escrituras.',
    reflectInChat: 'Reflexionar en el Chat',
    viewReflection: 'Ver reflexión →',
    dailyPromise: 'Promesa del Día',
    verseOf: 'de',
    listen: 'Escuchar',
    pause: 'Pausar',
    copy: 'Copiar',
    copied: 'Copiado',
    share: 'Compartir',
    close: 'Cerrar',
    onboardingTitle: 'Bienvenido al Refugio de Paz',
    onboardingWelcome: 'La Presencia de Cristo te Acompaña',
    onboardingDesc: 'Un espacio espiritual gratuito, sin registros, fundamentado en el amor incondicional, la oración y la sabiduría de las Sagradas Escrituras.',
    onboardingJesusQuote: 'Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.',
    onboardingJesusRef: 'Juan 14:6',
    onboardingStep1Title: 'Diálogo con Amor y Sabiduría',
    onboardingStep1Desc: 'Encuentra consuelo, dirección y respuestas respaldadas por pasajes bíblicos en cualquier momento de aflicción o búsqueda.',
    onboardingStep2Title: 'Oración e Intercesión',
    onboardingStep2Desc: 'Redacta oraciones profundas para tu familia, tu salud y tu propósito. Escúchalas en audio relajante.',
    onboardingStep3Title: 'Totalmente Libre y Privado',
    onboardingStep3Desc: 'Sin registros ni contraseñas. Tus conversaciones se guardan únicamente en tu navegador de forma segura.',
    selectLanguage: 'Selecciona tu Idioma',
    startChatButton: 'Entrar al Santuario de Oración',
    nextButton: 'Siguiente',
    prevButton: 'Anterior',
    skipButton: 'Omitir',
    modes: {
      general: {
        name: 'Guía y Sabiduría',
        desc: 'Conversación espiritual abierta y orientación diaria.',
        greeting: 'Hijo mío / Amigo del alma, ¿qué anhelo o pregunta guarda tu corazón el día de hoy? Estoy aquí para escucharte en paz.',
        suggestions: [
          '¿Cómo puedo saber el propósito de Dios para mi vida?',
          '¿Cómo superar el miedo al futuro o la incertidumbre?',
          '¿Qué dice la Biblia acerca del amor verdadero?',
          '¿Cómo aprender a perdonar a quien me lastimó?'
        ]
      },
      peace: {
        name: 'Paz ante la Ansiedad',
        desc: 'Consuelo, serenidad mental y promesas para calmar el corazón.',
        greeting: 'La paz que sobrepasa todo entendimiento sea contigo. Suelta la carga que pesa sobre tus hombros; cuéntame qué te inquieta.',
        suggestions: [
          'Tengo mucha ansiedad y no puedo dormir, ayúdame.',
          'Siento que no puedo más con tantas presiones.',
          'Dame versículos para calmar el temor.',
          'Guíame en un momento de oración y entrega a Dios.'
        ]
      },
      prayer: {
        name: 'Oración & Intercesión',
        desc: 'Oraciones poderosas por sanidad, familia y provisión.',
        greeting: 'Oremos juntos. Donde dos o tres se reúnen en Su nombre, allí está la gracia. ¿Por qué deseas que oremos?',
        suggestions: [
          'Haz una oración por la salud y sanidad de mi familia.',
          'Oración para abrir puertas de trabajo y provisión.',
          'Oración de protección espiritual para mi hogar.',
          'Oración de liberación y paz interior.'
        ]
      },
      bibleStudy: {
        name: 'Estudio Bíblico Profundo',
        desc: 'Explicación de pasajes, parábolas y contexto histórico.',
        greeting: 'Lámpara es a tus pies la Palabra y lumbrera a tu camino. ¿Qué pasaje o parábola deseas explorar hoy?',
        suggestions: [
          'Explícame el Salmo 23 versículo por versículo.',
          '¿Qué significa el Sermón del Monte y las Bienaventuranzas?',
          '¿Cuál es el significado de la parábola del hijo pródigo?',
          '¿Cómo aplicar el libro de Romanos en mi vida cotidiana?'
        ]
      },
      counsel: {
        name: 'Consejo para Decisiones',
        desc: 'Discernimiento sabio ante dilemas personales y de vida.',
        greeting: 'El principio de la sabiduría es el discernimiento. Comparte tu situación con confianza para buscar la mejor senda.',
        suggestions: [
          'Tengo que tomar una decisión laboral difícil y tengo dudas.',
          'Tengo problemas en mi relación de pareja, ¿cómo actuar?',
          '¿Cómo saber si una decisión agrada a Dios?',
          '¿Cómo poner límites sanos a personas con amor?'
        ]
      },
      gratitude: {
        name: 'Agradecimiento & Alabanza',
        desc: 'Reconocer bendiciones y cultivar un corazón alegre.',
        greeting: 'Entremos por Sus puertas con acción de gracias. Cuéntame por qué bendiciones estás agradecido hoy.',
        suggestions: [
          'Quiero agradecer a Dios por un milagro en mi vida.',
          'Escribe un salmo de alabanza por un nuevo día.',
          '¿Cómo mantener gratitud en tiempos difíciles?',
          'Oración matutina de agradecimiento y gozo.'
        ]
      }
    }
  },

  en: {
    appName: 'Chat with God',
    appSubtitle: 'Spiritual & Biblical Guidance',
    freeBadge: 'Free',
    newChat: 'New Dialogue',
    dailyVerse: 'Daily Verse',
    settings: 'Settings',
    history: 'Previous Dialogues',
    spiritualFocus: 'Spiritual Focus',
    noHistory: 'No saved dialogues yet. Your conversations are stored locally on your device.',
    savedPrayers: 'Saved Prayers',
    privateBadge: '100% Private • No Login Required',
    inputPlaceholder: 'Share your burden, ask for a prayer or seek scripture guidance...',
    suggestionsTitle: 'Suggestions',
    disclaimer: 'A sanctuary of peace and biblical wisdom. Does not replace pastoral or professional counsel.',
    heroGreeting: 'May Grace and Peace Be with You',
    heroSubtitle: 'A sacred space to receive comfort in hardship, pray together, and discover the timeless wisdom of the Holy Scriptures.',
    reflectInChat: 'Reflect in Chat',
    viewReflection: 'Read reflection →',
    dailyPromise: 'Daily Promise',
    verseOf: 'of',
    listen: 'Listen',
    pause: 'Pause',
    copy: 'Copy',
    copied: 'Copied',
    share: 'Share',
    close: 'Close',
    onboardingTitle: 'Welcome to the Sanctuary of Peace',
    onboardingWelcome: 'The Presence of Christ Is with You',
    onboardingDesc: 'A free, registration-free spiritual haven grounded in unconditional love, sincere prayer, and the wisdom of the Holy Bible.',
    onboardingJesusQuote: 'I am the way, the truth, and the life: no man cometh unto the Father, but by me.',
    onboardingJesusRef: 'John 14:6',
    onboardingStep1Title: 'Dialogue with Love & Wisdom',
    onboardingStep1Desc: 'Find solace, clarity, and answers backed by scripture in any time of trial or seeking.',
    onboardingStep2Title: 'Prayer & Intercession',
    onboardingStep2Desc: 'Compose heartfelt prayers for your family, health, and purpose. Listen to them with soothing voice audio.',
    onboardingStep3Title: 'Completely Free & Private',
    onboardingStep3Desc: 'No login, no passwords. All conversations stay safely on your local device.',
    selectLanguage: 'Choose Your Language',
    startChatButton: 'Enter Sanctuary of Prayer',
    nextButton: 'Next',
    prevButton: 'Previous',
    skipButton: 'Skip',
    modes: {
      general: {
        name: 'Wisdom & Guidance',
        desc: 'Open spiritual conversation and daily counsel.',
        greeting: 'Dear friend, what longing or question rests upon your heart today? I am here to listen in peace.',
        suggestions: [
          'How can I know God\'s purpose for my life?',
          'How do I overcome fear of the future and anxiety?',
          'What does the Bible teach about true love?',
          'How do I truly forgive someone who hurt me?'
        ]
      },
      peace: {
        name: 'Peace in Anxiety',
        desc: 'Comfort, serene thoughts, and promises for storm times.',
        greeting: 'Peace that surpasses all understanding be with you. Cast your burdens upon the Lord; tell me what troubles you.',
        suggestions: [
          'I feel intense anxiety and cannot sleep, please help.',
          'I feel overwhelmed by life pressures.',
          'Give me scripture verses to overcome fear.',
          'Lead me in a prayer of surrender and calm.'
        ]
      },
      prayer: {
        name: 'Prayer & Intercession',
        desc: 'Powerful prayers for healing, family, and provision.',
        greeting: 'Let us pray together. Where two or three gather in His name, grace is there. What shall we pray for today?',
        suggestions: [
          'Pray for the healing and health of my family.',
          'A prayer to open doors for work and provision.',
          'A prayer of spiritual protection for my home.',
          'A prayer for inner liberation and peace.'
        ]
      },
      bibleStudy: {
        name: 'Deep Bible Study',
        desc: 'Scripture breakdown, parables, and historical context.',
        greeting: 'Your Word is a lamp to my feet and a light to my path. Which passage or parable shall we study today?',
        suggestions: [
          'Explain Psalm 23 verse by verse.',
          'What is the meaning of the Sermon on the Mount?',
          'What is the message of the Prodigal Son parable?',
          'How do I apply the Book of Romans today?'
        ]
      },
      counsel: {
        name: 'Decision Counsel',
        desc: 'Wise discernment for personal, career, or life decisions.',
        greeting: 'The beginning of wisdom is discernment. Share your situation with confidence to seek the right path.',
        suggestions: [
          'I face a difficult career decision and need wisdom.',
          'I have struggles in my relationship, how should I act?',
          'How can I know if a decision honors God?',
          'How do I set healthy boundaries in love?'
        ]
      },
      gratitude: {
        name: 'Praise & Thanksgiving',
        desc: 'Recognizing blessings and nurturing a joyful spirit.',
        greeting: 'Enter His gates with thanksgiving. Tell me what blessings you are celebrating today.',
        suggestions: [
          'I want to thank God for a miracle in my life.',
          'Write a psalm of praise for a brand new day.',
          'How do I maintain gratitude during tough times?',
          'A morning prayer of thanksgiving and joy.'
        ]
      }
    }
  },

  he: {
    appName: 'שיחה עם אלוהים',
    appSubtitle: 'הדרכה רוחנית ותנ״כית',
    freeBadge: 'חינם',
    newChat: 'שיחה חדשה',
    dailyVerse: 'פסוק יומי',
    settings: 'הגדרות',
    history: 'שיחות קודמות',
    spiritualFocus: 'מצב רוחני',
    noHistory: 'אין שיחות שמורות עדיין. השיחות נשמרות מקומית במכשיר שלך.',
    savedPrayers: 'תפילות שמורות',
    privateBadge: '100% פרטי • ללא הרשמה',
    inputPlaceholder: 'שתף את שעל ליבך, בקש תפילה או הדרכה מכתבי הקודש...',
    suggestionsTitle: 'הצעות',
    disclaimer: 'מקדש של שלום וחוכמת התנ״ך. אינו מחליף ייעוץ רבני או מקצועי.',
    heroGreeting: 'שלום וחסד יהיו עמכם',
    heroSubtitle: 'מרחב קדוש לשיחה בחוכמה, קבלת נחמה בעת מצוקה, תפילה והעמקה בכתבי הקודש ובתורה.',
    reflectInChat: 'להרהר בצ׳אט',
    viewReflection: 'קרא הרהור ←',
    dailyPromise: 'הבטחה יומית',
    verseOf: 'מתוך',
    listen: 'האזן',
    pause: 'השהה',
    copy: 'העתק',
    copied: 'הועתק',
    share: 'שתף',
    close: 'סגור',
    onboardingTitle: 'ברוכים הבאים למשכן השלום',
    onboardingWelcome: 'נוכחות השלום והחסד עמכם',
    onboardingDesc: 'מרחב רוחני פתוח ללא תשלום וללא הרשמה, המושתת על אהבת חינם, תפילה כנה וחוכמת התנ״ך וכתבי הקודש.',
    onboardingJesusQuote: 'כִּי אָנֹכִי יָדַעְתִּי אֶת־הַמַּחֲשָׁבֹת אֲשֶׁר אָנֹכִי חֹשֵׁב עֲלֵיכֶם נְאֻם־יְהוָה מַחְשְׁבוֹת שָׁלוֹם וְלֹא לְרָעָה לָתֵת לָכֶם אַחֲרִית וְתִקְוָה׃',
    onboardingJesusRef: 'ירמיהו כ״ט:י״א',
    onboardingStep1Title: 'שיח באהבה ובחוכמה',
    onboardingStep1Desc: 'מצא נחמה, כיוון ותשובות המושרשות בפסוקי התנ״ך וכתבי הקודש בכל עת של חיפוש ומצוקה.',
    onboardingStep2Title: 'תפילה ובקשה',
    onboardingStep2Desc: 'חברו תפילות מעומק הלב לבריאות, למשפחה ולייעוד. הקשיבו לתפילות בקול מרגיע.',
    onboardingStep3Title: 'פתוח ופרטי לחלוטין',
    onboardingStep3Desc: 'ללא צורך בהתחברות או סיסמאות. כל השיחות נשמרות אך ורק במכשיר שלך.',
    selectLanguage: 'בחר שפה',
    startChatButton: 'היכנס למקדש התפילה',
    nextButton: 'הבא',
    prevButton: 'הקודם',
    skipButton: 'דלג',
    modes: {
      general: {
        name: 'חוכמה והדרכה',
        desc: 'שיחה רוחנית פתוחה והדרכה יומיומית.',
        greeting: 'אחי היקר / ידיד נפשי, מהי השאלה או הכמיהה שעל ליבך היום? אני כאן להקשיב בשלווה.',
        suggestions: [
          'כיצד אוכל לדעת את רצון ה׳ וייעודי בחיים?',
          'כיצד להתגבר על פחד מהעתיד ואי-וודאות?',
          'מה מלמדים כתבי הקודש על אהבת אמת?',
          'כיצד למחול ולסלוח בלב שלם למי שפגע בי?'
        ]
      },
      peace: {
        name: 'שלווה מול חרדה',
        desc: 'נחמה, רוגע נפשי והבטחות להרגעת הלב.',
        greeting: 'שלום המעבר לכל בינה יהיה עמך. השלך על ה׳ יהבך והוא יכלכלך; ספר לי מה מעיק עליך.',
        suggestions: [
          'אני חווה חרדה עמוקה ומתקשה לישון, עזור לי.',
          'אני מרגיש עומס כבד בחיים ולא יכול לשאת עוד.',
          'תן לי פסוקים ותהילים להרגעת הפחד.',
          'הנחה אותי ברגע של תפילה, נשימה והרפיה.'
        ]
      },
      prayer: {
        name: 'תפילה ותחנונים',
        desc: 'תפילות עוצמתיות לרפואה, משפחה ופרנסה.',
        greeting: 'נתפלל יחדיו. קרוב ה׳ לכל קוראיו, לכל אשר יקראוהו באמת. על מה נתפלל היום?',
        suggestions: [
          'תפילה לבריאות ורפואה שלמה למשפחתי.',
          'תפילה לפתיחת שערי פרנסה והצלחה.',
          'תפילת הגנה רוחנית ושמירה על הבית.',
          'תפילה לשחרור ולשלוות הנפש.'
        ]
      },
      bibleStudy: {
        name: 'לימוד תנ״ך מעמיק',
        desc: 'ביאור פסוקים, משלים והקשר היסטורי.',
        greeting: 'נר לרגלי דבריך ואור לנתיבתי. איזה פרק, מזמור או פסוק נחקור היום?',
        suggestions: [
          'הסבר לי את מזמור כ״ג בתהילים (ה׳ רועי לא אחסר).',
          'מהי המשמעות העמוקה של עשרת הדיברות לחיינו?',
          'איזה מוסר השכל נלמד מסיפור יוסף ואחיו?',
          'כיצד ליישם את חוכמת משלי ביומיום?'
        ]
      },
      counsel: {
        name: 'עצה להחלטות',
        desc: 'שיקול דעת נבון בדילמות אישיות ובחיים.',
        greeting: 'ראשית חוכמה קנה חוכמה. שתף בביטחון את הדילמה כדי למצוא את הנתיב הנכון.',
        suggestions: [
          'אני עומד בפני החלטה מקצועית קשה ומתלבט.',
          'יש לי קשיים בזוגיות ובמשפחה, כיצד לפעול?',
          'כיצד לדעת אם החלטה מסוימת נכונה וישרה בעיני שמיים?',
          'כיצד להציב גבולות בריאים באהבה?'
        ]
      },
      gratitude: {
        name: 'הודיה ושבח',
        desc: 'הכרת הטוב, טיפוח שמחה ומזמורי תהילה.',
        greeting: 'בואו שעריו בתודה חצרותיו בתהילה. ספר לי על אילו חסדים וטובות אתה מודה היום.',
        suggestions: [
          'אני רוצה להודות על נס וטובה שקרו בחיי.',
          'כתוב מזמור תודה ושבח על יום חדש.',
          'כיצד לשמור על הכרת הטוב גם בימים מאתגרים?',
          'תפילת בוקר של שמחה והודיה.'
        ]
      }
    }
  }
};
