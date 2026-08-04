// src/data/mindsetFacts.js
export const mindsetFacts = [
  // --- SECCIÓN: NEUROPLASTICIDAD & METACOGNICIÓN (RegisterPage) ---
  {
    category: "🚀 Neuroplasticidad",
    title: '"Tu cerebro cambia físicamente al aprender inglés."',
    text: "Aprender un segundo idioma activa la neuroplasticidad estructural. Monitoreos cerebrales revelan que la materia gris en la corteza cerebral y el hipocampo se expande notablemente. No solo estás adquiriendo vocabulario, estás remodelando tu estructura cerebral."
  },
  {
    category: "🧠 Metacognición",
    title: '"Aprender a aprender acelera la fluidez x2."',
    text: "La metacognición es la capacidad de monitorear tus propios procesos de pensamiento. Cuando analizas conscientemente cómo aprendes pronunciación o estructura en lugar de memorizar sin reflexionar, tus redes neuronales consolidan la información mucho más rápido."
  },
  {
    category: "🛡️ Reserva Cognitiva",
    title: '"El bilingüismo frena el envejecimiento mental."',
    text: "Múltiples estudios neurocientíficos demuestran que alternar entre dos idiomas fortalece la función ejecutiva del cerebro, creando una 'reserva cognitiva' que retrasa síntomas de deterioro mental hasta por 4 a 5 años."
  },
  {
    category: "⚡ Flexibilidad Sináptica",
    title: '"No hay límite de edad para la plasticidad mental."',
    text: "Aunque los niños aprenden por inmersión implícita, los adultos poseen un sistema metacognitivo superior. Esto te permite conectar patrones gramaticales complejos de forma consciente, reconfigurando tus conexiones sinápticas a cualquier edad."
  },

  // --- SECCIÓN: CIENCIA COGNITIVA & HISTORIA LINGÜÍSTICA (LoginPage) ---
  {
    category: "⚖️ Toma de Decisiones",
    title: '"Pensar en otro idioma te hace tomar decisiones más racionales."',
    text: "Estudios científicos de la Universidad de Chicago demuestran que al procesar problemas en una segunda lengua, tu cerebro reduce los sesgos emocionales y automáticos. Al eliminar la traducción mental, analizas los riesgos de forma mucho más analítica, lógica y clara."
  },
  {
    category: "🔬 Anatómico",
    title: '"El bilingüismo altera físicamente la densidad de tu materia gris."',
    text: "La neuroplasticidad inducida por el aprendizaje de un nuevo idioma fortalece la corteza cingulada anterior. Este cambio anatómico no solo mejora la fluidez verbal, sino que optimiza drásticamente las funciones ejecutivas del cerebro."
  },
  {
    category: "🌍 Lingüística Histórica",
    title: '"La diplomacia global está condicionada por el determinismo lingüístico."',
    text: "A lo largo de la historia política, la estructura de un idioma ha dictado los términos de la paz y la guerra. Dado que ciertos conceptos no tienen una traducción directa (intraducibilidad), las adaptaciones lingüísticas moldean la realidad jurídica internacional."
  },
  {
    category: "🏛️ Origen del Idioma",
    title: '"El inglés moderno es un accidente histórico de invasiones cruzadas."',
    text: "La estructura actual del idioma inglés es el resultado de una colisión tectónica entre el germánico de los anglosajones y el francés antiguo de los normandos en 1066. Esta dualidad explica por qué el inglés posee un vocabulario tan inmenso con términos germánicos y latinos para un mismo concepto."
  }
];

// Función helper para obtener un fact aleatorio
export const getRandomFact = () => {
  const randomIndex = Math.floor(Math.random() * mindsetFacts.length);
  return mindsetFacts[randomIndex];
};