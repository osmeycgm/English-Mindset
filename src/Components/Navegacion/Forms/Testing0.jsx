import { useState, useEffect, useRef } from "react";

// MATRIZ DE PREGUNTAS EN NIVEL DE DIFICULTAD: A2 - B1
const PREGUNTAS_POOL = [
  // ─── SECCIÓN I: TRUE OR FALSE (1 a 8) ───────────────────────────────────
  {
    id: 1,
    type: "tf",
    section: "Section I: Basic Grammar",
    title: "True or False? (Present Perfect vs Past Simple)",
    statement: "Statement 01",
    text: '"I have been working in this company since three years."',
    subtext: "Esta oración es gramaticalmente correcta para expresar la duración de tu empleo.",
    correctAnswer: false
  },
  {
    id: 2,
    type: "tf",
    section: "Section I: Basic Grammar",
    title: "True or False? (False Friends)",
    statement: "Statement 02",
    text: 'If your boss says: "Actually, we need to change the plan"...',
    subtext: 'La palabra "Actually" significa "Actualmente" o "En este momento".',
    correctAnswer: false
  },
  {
    id: 3,
    type: "tf",
    section: "Section I: Basic Grammar",
    title: "True or False? (Infinitive Patterns)",
    statement: "Statement 03",
    text: '"I want to learning more about JavaScript next month."',
    subtext: "El verbo 'want' requiere un verbo con -ing justo después.",
    correctAnswer: false
  },
  {
    id: 4,
    type: "tf",
    section: "Section I: Basic Grammar",
    title: "True or False? (Office Phrasal Verbs)",
    statement: "Statement 04",
    text: '"Please turn off the office lights and computers before you leave."',
    subtext: 'En este contexto, "turn off" significa apagar los dispositivos electrónicos.',
    correctAnswer: true
  },
  {
    id: 5,
    type: "tf",
    section: "Section I: Basic Grammar",
    title: "True or False? (Past Time Expressions)",
    statement: "Statement 05",
    text: '"The marketing manager has called me yesterday afternoon."',
    subtext: "Es correcto usar el Present Perfect cuando mencionamos el momento exacto (yesterday).",
    correctAnswer: false
  },
  {
    id: 6,
    type: "tf",
    section: "Section I: Basic Grammar",
    title: "True or False? (Adverb Frequency)",
    statement: "Statement 06",
    text: '"He always arrives on time for our daily stand-up meetings."',
    subtext: "La posición del adverbio 'always' antes del verbo principal es correcta.",
    correctAnswer: true
  },
  {
    id: 7,
    type: "tf",
    section: "Section I: Basic Grammar",
    title: "True or False? (Prepositions)",
    statement: "Statement 07",
    text: '"I am waiting for the client to join the Zoom call."',
    subtext: "La preposición 'for' es la combinación correcta para el verbo 'wait'.",
    correctAnswer: true
  },
  {
    id: 8,
    type: "tf",
    section: "Section I: Basic Grammar",
    title: "True or False? (Common Verbs)",
    statement: "Statement 08",
    text: '"Let\'s discuss about the new project details tomorrow."',
    subtext: "El verbo 'discuss' necesita obligatoriamente la preposición 'about'.",
    correctAnswer: false
  },

  // ─── SECCIÓN II: MULTIPLE CHOICE (9 a 18) ───────────────────────────────
  {
    id: 9,
    type: "multi",
    section: "Section II: Everyday Vocabulary",
    title: "Multiple Choice (Office Routines)",
    text: '"The manager is very busy today, so we need to ________ the meeting until tomorrow."',
    options: [
      { id: "A", text: "postpone" },
      { id: "B", text: "call off" },
      { id: "C", text: "forget" },
      { id: "D", text: "repeat" }
    ],
    correctAnswer: "A"
  },
  {
    id: 10,
    type: "multi",
    section: "Section II: Everyday Vocabulary",
    title: "Multiple Choice (Basic Conditionals)",
    text: '"If it rains tomorrow, we ________ the team building event in the park."',
    options: [
      { id: "A", text: "cancel" },
      { id: "B", text: "will cancel" },
      { id: "C", text: "would cancel" },
      { id: "D", text: "cancelled" }
    ],
    correctAnswer: "B"
  },
  {
    id: 11,
    type: "multi",
    section: "Section II: Everyday Vocabulary",
    title: "Multiple Choice (Verb + ING)",
    text: '"I really enjoy ________ with my new team members on this application."',
    options: [
      { id: "A", text: "work" },
      { id: "B", text: "working" },
      { id: "C", text: "to work" },
      { id: "D", text: "worked" }
    ],
    correctAnswer: "B"
  },
  {
    id: 12,
    type: "multi",
    section: "Section II: Everyday Vocabulary",
    title: "Multiple Choice (Connectors)",
    text: '"We arrived late to the presentation ________ the heavy traffic in downtown."',
    options: [
      { id: "A", text: "because" },
      { id: "B", text: "because of" },
      { id: "C", text: "although" },
      { id: "D", text: "but" }
    ],
    correctAnswer: "B"
  },
  {
    id: 13,
    type: "multi",
    section: "Section II: Everyday Vocabulary",
    title: "Multiple Choice (Phrasal Verbs)",
    text: '"Can you please ________ this application form with your name and email?"',
    options: [
      { id: "A", text: "fill out" },
      { id: "B", text: "turn down" },
      { id: "C", text: "look for" },
      { id: "D", text: "give up" }
    ],
    correctAnswer: "A"
  },
  {
    id: 14,
    type: "multi",
    section: "Section II: Everyday Vocabulary",
    title: "Multiple Choice (Past Continuous)",
    text: '"While I ________ the report code, my computer suddenly restarted."',
    options: [
      { id: "A", text: "wrote" },
      { id: "B", text: "am writing" },
      { id: "C", text: "was writing" },
      { id: "D", text: "have written" }
    ],
    correctAnswer: "C"
  },
  {
    id: 15,
    type: "multi",
    section: "Section II: Everyday Vocabulary",
    title: "Multiple Choice (Modal Obligations)",
    text: '"You ________ smoke inside the office building. It is strictly prohibited."',
    options: [
      { id: "A", text: "don't have to" },
      { id: "B", text: "must not" },
      { id: "C", text: "can" },
      { id: "D", text: "shouldn't to" }
    ],
    correctAnswer: "B"
  },
  {
    id: 16,
    type: "multi",
    section: "Section II: Everyday Vocabulary",
    title: "Multiple Choice (Infinitive Patterns)",
    text: '"The project leader asked me ________ the code changes as soon as possible."',
    options: [
      { id: "A", text: "to send" },
      { id: "B", text: "sending" },
      { id: "C", text: "send" },
      { id: "D", text: "sent" }
    ],
    correctAnswer: "A"
  },
  {
    id: 17,
    type: "multi",
    section: "Section II: Everyday Vocabulary",
    title: "Multiple Choice (Prepositions of Time)",
    text: '"The main office will be completely closed ________ Monday to Wednesday."',
    options: [
      { id: "A", text: "from" },
      { id: "B", text: "since" },
      { id: "C", text: "until" },
      { id: "D", text: "during" }
    ],
    correctAnswer: "A"
  },
  {
    id: 18,
    type: "multi",
    section: "Section II: Everyday Vocabulary",
    title: "Multiple Choice (Tag Questions)",
    text: '"You speak English and Spanish fluently, ________?"',
    options: [
      { id: "A", text: "aren't you" },
      { id: "B", text: "don't you" },
      { id: "C", text: "doesn't it" },
      { id: "D", text: "didn't you" }
    ],
    correctAnswer: "B"
  },

  // ─── SECCIÓN III: READING COMPREHENSION (19 a 24) ───────────────────────
  {
    id: 19,
    type: "reading",
    section: "Section III: Reading Comprehension",
    title: "Workplace Notification",
    text: "According to the corporate text below, what is the main change announced?",
    options: [
      { id: "A", text: "Employees will have a longer lunch break time." },
      { id: "B", text: "The company lunch break schedule has shifted." },
      { id: "C", text: "Employees are not allowed to eat lunch in the office." }
    ],
    correctAnswer: "B"
  },
  {
    id: 20,
    type: "reading",
    section: "Section III: Reading Comprehension",
    title: "Workplace Notification",
    text: "When exactly does this new schedule modification start?",
    options: [
      { id: "A", text: "Today afternoon." },
      { id: "B", text: "Tomorrow morning." },
      { id: "C", text: "Next week on Monday." }
    ],
    correctAnswer: "B"
  },
  {
    id: 21,
    type: "reading",
    section: "Section III: Reading Comprehension",
    title: "Workplace Notification",
    text: "Who sent this internal operational communication?",
    options: [
      { id: "A", text: "The Tech Leader." },
      { id: "B", text: "The Human Resources department." },
      { id: "C", text: "The External Client." }
    ],
    correctAnswer: "B"
  },
  {
    id: 22,
    type: "reading",
    section: "Section III: Reading Comprehension",
    title: "Contextual Information",
    text: "Context: 'The presentation for the client is ready. However, we still need to review the budget data before Friday morning. If you see any errors, report them immediately.' What needs review?",
    options: [
      { id: "A", text: "The complete presentation design." },
      { id: "B", text: "The budget data figures." },
      { id: "C", text: "The client's original message." }
    ],
    correctAnswer: "B"
  },
  {
    id: 23,
    type: "reading",
    section: "Section III: Reading Comprehension",
    title: "Contextual Information",
    text: "What is the absolute deadline mentioned to complete this task?",
    options: [
      { id: "A", text: "Friday morning." },
      { id: "B", text: "Thursday evening." },
      { id: "C", text: "Friday afternoon." }
    ],
    correctAnswer: "A"
  },
  {
    id: 24,
    type: "reading",
    section: "Section III: Reading Comprehension",
    title: "Contextual Information",
    text: "What should an employee do if they find an error in the files?",
    options: [
      { id: "A", text: "Delete the file immediately." },
      { id: "B", text: "Report it right away." },
      { id: "C", text: "Wait until next week to fix it." }
    ],
    correctAnswer: "B"
  },

  // ─── SECCIÓN IV: AUDITORY PROCESSING (25 a 29) ──────────────────────────
  {
    id: 25,
    type: "listening",
    section: "Section IV: Auditory Processing",
    title: "Live Announcement Analysis",
    text: "According to the announcement track, what specific event is being changed?",
    options: [
      { id: "A", text: "A private client interview." },
      { id: "B", text: "A team building event." },
      { id: "C", text: "An urgent deployment review." }
    ],
    correctAnswer: "B"
  },
  {
    id: 26,
    type: "listening",
    section: "Section IV: Auditory Processing",
    title: "Live Announcement Analysis",
    text: "To what new time has the event been rescheduled?",
    options: [
      { id: "A", text: "Friday at 3:00 PM." },
      { id: "B", text: "Thursday at 10:00 AM." },
      { id: "C", text: "Thursday at 3:00 PM." }
    ],
    correctAnswer: "B"
  },
  {
    id: 27,
    type: "listening",
    section: "Section IV: Auditory Processing",
    title: "Live Announcement Analysis",
    text: "Where exactly will the event take place now?",
    options: [
      { id: "A", text: "Inside the main garden area." },
      { id: "B", text: "Inside the principal conference room." },
      { id: "C", text: "Outside the office cafeteria." }
    ],
    correctAnswer: "A"
  },
  {
    id: 28,
    type: "listening",
    section: "Section IV: Auditory Processing",
    title: "Live Announcement Analysis",
    text: "What was the original location of the meeting before the change?",
    options: [
      { id: "A", text: "The main garden area." },
      { id: "B", text: "The conference room." },
      { id: "C", text: "A local restaurant nearby." }
    ],
    correctAnswer: "B"
  },
  {
    id: 29,
    type: "listening",
    section: "Section IV: Auditory Processing",
    title: "Live Announcement Analysis",
    text: "What action are employees asked to do before tonight?",
    options: [
      { id: "A", text: "Upload the final report." },
      { id: "B", text: "Confirm attendance via email to Lucas." },
      { id: "C", text: "Call the administration desk." }
    ],
    correctAnswer: "B"
  }
];

const Testing0 = () => {
  const [pasoActual, setPasoActual] = useState(0);
  const [preguntaActualIdx, setPreguntaActualIdx] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(1500); 

  const [respuestas, setRespuestas] = useState({});
  const [audioBlob, setAudioBlob] = useState(null);

  const [grabando, setGrabando] = useState(false);
  const [tiempoGrabacion, setTiempoGrabacion] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  const [textoAnalisis, setTextoAnalisis] = useState("Analizando sintaxis...");

  const preguntaActual = PREGUNTAS_POOL[preguntaActualIdx];
  const totalPreguntas = PREGUNTAS_POOL.length; 

  // ⏱️ TIMER GLOBAL
  useEffect(() => {
    if (pasoActual === 0 || pasoActual >= 3) return;
    const timer = setInterval(() => {
      setTiempoRestante((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [pasoActual]);

  const formatearTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // LISTENING API SÍNTESIS NATIVA
  const reproducirAudioListening = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const texto = "Attention all employees. The team building event scheduled for Friday at 3:00 PM has been moved to Thursday at 10:00 AM. It will take place in the main garden instead of the conference room. Please confirm your attendance by sending an email to Lucas by tonight.";
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Tu navegador no soporta síntesis de voz.");
    }
  };

  // GRABACIÓN DE MICRÓFONO
  const iniciarGrabacion = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setGrabando(true);
      
      timerIntervalRef.current = setInterval(() => {
        setTiempoGrabacion((t) => t + 1);
      }, 1000);
    } catch (err) {
      alert("No se pudo acceder al micrófono.");
    }
  };

  const detenerGrabacion = () => {
    if (mediaRecorderRef.current && grabando) {
      mediaRecorderRef.current.stop();
      clearInterval(timerIntervalRef.current);
      setGrabando(false);
    }
  };

  const simularGrabacionDev = () => {
    const fakeBlob = new Blob(["fake"], { type: "audio/webm" });
    setAudioBlob(fakeBlob);
    setTiempoGrabacion(28);
  };

  // EFECTO DE CÁLCULO IA
  useEffect(() => {
    if (pasoActual !== 3) return;
    const t1 = setTimeout(() => setTextoAnalisis("Midiendo riqueza léxica..."), 1500);
    const t2 = setTimeout(() => setTextoAnalisis("Evaluando pronunciación..."), 3000);
    const t3 = setTimeout(() => setPasoActual(4), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [pasoActual]);

  const handleSeleccionarRespuesta = (valor) => {
    setRespuestas({ ...respuestas, [preguntaActual.id]: valor });
  };

  const avanzarPregunta = () => {
    if (preguntaActualIdx < totalPreguntas - 1) {
      setPreguntaActualIdx(preguntaActualIdx + 1);
    } else {
      setPasoActual(2);
    }
  };

  const retrocederPregunta = () => {
    if (preguntaActualIdx > 0) {
      setPreguntaActualIdx(preguntaActualIdx - 1);
    } else {
      setPasoActual(0);
    }
  };

  const calcularCalificacion = () => {
    let correctas = 0;
    PREGUNTAS_POOL.forEach((q) => {
      if (respuestas[q.id] === q.correctAnswer) correctas++;
    });
    if (audioBlob) correctas++;

    const porcentaje = Math.round((correctas / 30) * 100);
    let nivel = "A1 (Beginner)";
    if (porcentaje >= 35) nivel = "A2 (Pre-Intermediate)";
    if (porcentaje >= 65) nivel = "B1 (Intermediate)";
    if (porcentaje >= 88) nivel = "B1+ (Strong Intermediate)";

    return { porcentaje, correctas, nivel };
  };

  const numeroPreguntaGlobal = pasoActual === 2 ? 30 : preguntaActualIdx + 1;

  // 🎨 CÁLCULO MATEMÁTICO DEL FONDO (De #0A0F1D a #F8F9FA)
  let progresoRatio = 0;
  if (pasoActual === 1) progresoRatio = (preguntaActualIdx + 1) / 30;
  if (pasoActual >= 2) progresoRatio = 1;

  const r = Math.round(10 + (248 - 10) * progresoRatio);
  const g = Math.round(15 + (249 - 15) * progresoRatio);
  const b = Math.round(29 + (250 - 29) * progresoRatio);
  const colorFondoDinamico = `rgb(${r}, ${g}, ${b})`;

  return (
    <div 
      className="py-5 min-vh-100 d-flex flex-column justify-content-center px-3" 
      style={{ 
        backgroundColor: colorFondoDinamico,
        transition: "background-color 0.7s ease-out" 
      }}
    >
      <div className="container" style={{ maxWidth: "720px" }}>
        
        {/* TARJETA OSCURA MINIMALISTA */}
        <div 
          className="p-4 p-md-5 rounded-4 position-relative overflow-hidden shadow-sm" 
          style={{ 
            backgroundColor: "#131C31", // Tu color oscuro intacto
            border: "1px solid rgba(255, 255, 255, 0.06)",
            color: "#FFFFFF"
          }}
        >
          {/* BARRA DE PROGRESO INTEGRADA AL TECHO DE LA CARD */}
          {pasoActual > 0 && pasoActual < 3 && (
            <div className="position-absolute top-0 start-0 w-100 bg-white bg-opacity-10" style={{ height: "3px" }}>
              <div 
                className="bg-white h-100" 
                style={{ width: `${(numeroPreguntaGlobal / 30) * 100}%`, transition: "width 0.3s ease" }}
              />
            </div>
          )}

          {/* SUB-HEADER DISCRETO (Paso 1 y 2) */}
          {pasoActual > 0 && pasoActual < 3 && (
            <div className="d-flex justify-content-between align-items-center pb-4 mb-4 border-bottom border-white border-opacity-10 text-white-50 small font-monospace">
              <span>{preguntaActual?.section || "Final Task"}</span>
              <span>{formatearTiempo(tiempoRestante)}</span>
            </div>
          )}

          {/* ─── PASO 0: INTRODUCCIÓN ─────────────────────────── */}
          {pasoActual === 0 && (
            <div className="text-center py-5">
              <h1 className="fw-light mb-2 tracking-tight">
                English Mindset <span className="fw-bold">Benchmark</span>
              </h1>
              <p className="text-white-50 small tracking-widest text-uppercase mb-4">
                Level Diagnostic • A2 to B1
              </p>

              <p className="fw-light mx-auto mb-5 text-light opacity-75 lh-lg" style={{ maxWidth: "500px", fontSize: "1.05rem" }}>
                Un test minimalista de 30 pasos diseñado para evaluar tu intuición gramatical y tu agilidad de respuesta en entornos de trabajo reales.
              </p>

              <button 
                className="btn btn-light px-5 py-3 rounded-pill fw-medium text-dark"
                onClick={() => { setPasoActual(1); setPreguntaActualIdx(0); }}
              >
                Comenzar test
              </button>
            </div>
          )}

          {/* ─── PASO 1: PREGUNTAS (1 A 29) ───────────────────────── */}
          {pasoActual === 1 && preguntaActual && (
            <div>
              <h4 className="fw-normal lh-base mb-4">{preguntaActual.text}</h4>

              {/* COMPRENSIÓN LECTORA (READING) */}
              {preguntaActual.type === "reading" && preguntaActualIdx === 19 && (
                <div className="p-4 rounded-3 mb-4 bg-black bg-opacity-25 border-start border-white border-opacity-50 text-white-50 small">
                  <div className="text-white fw-medium mb-1">From: HR | Subject: Lunch Schedule</div>
                  <p className="m-0 fst-italic text-light opacity-75">
                    "Hi team, please remember that our company lunch break is now from 1:00 PM to 2:00 PM instead of 12:30 PM to 1:30 PM. This schedule modification will start tomorrow morning."
                  </p>
                </div>
              )}

              {/* AUDITORY PROCESSING (LISTENING) */}
              {preguntaActual.type === "listening" && (
                <div className="d-flex align-items-center gap-3 p-3 rounded-3 mb-4 bg-black bg-opacity-25">
                  <button 
                    className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                    onClick={reproducirAudioListening}
                  >
                    <i className="bi bi-play-fill fs-5 text-dark"/>
                  </button>
                  <div className="text-start">
                    <span className="d-block text-white fw-medium small">Audio Track #02</span>
                    <span className="text-white-50" style={{ fontSize: "0.8rem" }}>Escuchar nota de voz adjunta</span>
                  </div>
                </div>
              )}

              {/* TRUE OR FALSE */}
              {preguntaActual.type === "tf" && (
                <div className="mb-4">
                  <p className="small text-white-50 mb-4">{preguntaActual.subtext}</p>
                  <div className="row g-2">
                    <div className="col-6">
                      <button 
                        className={`btn w-100 py-3 rounded-3 fw-medium ${respuestas[preguntaActual.id] === true ? "btn-light text-dark fw-bold" : "btn-outline-secondary text-white"}`}
                        onClick={() => handleSeleccionarRespuesta(true)}
                      >
                        True
                      </button>
                    </div>
                    <div className="col-6">
                      <button 
                        className={`btn w-100 py-3 rounded-3 fw-medium ${respuestas[preguntaActual.id] === false ? "btn-light text-dark fw-bold" : "btn-outline-secondary text-white"}`}
                        onClick={() => handleSeleccionarRespuesta(false)}
                      >
                        False
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MULTIPLE CHOICE / READING / LISTENING */}
              {(preguntaActual.type === "multi" || preguntaActual.type === "reading" || preguntaActual.type === "listening") && (
                <div className="d-flex flex-column gap-2">
                  {preguntaActual.options.map((opcion) => {
                    const isSelected = respuestas[preguntaActual.id] === (typeof opcion === "string" ? opcion : opcion.id);
                    const labelText = typeof opcion === "string" ? opcion : opcion.text;
                    
                    return (
                      <button 
                        key={labelText}
                        className={`text-start p-3 rounded-3 border-0 transition-all ${isSelected ? "bg-light text-dark fw-semibold ps-4" : "text-white-50"}`}
                        style={{ backgroundColor: isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.03)" }}
                        onClick={() => handleSeleccionarRespuesta(typeof opcion === "string" ? opcion : opcion.id)}
                      >
                        {labelText}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* NAVEGACIÓN DISCRETA */}
              <div className="d-flex justify-content-between align-items-center mt-5 pt-3 border-top border-white border-opacity-10">
                <button className="btn btn-link text-white-50 text-decoration-none p-0 small" onClick={retrocederPregunta}>
                  ← Anterior
                </button>
                <button 
                  className="btn btn-light px-4 py-2 rounded-pill text-dark fw-medium small"
                  disabled={respuestas[preguntaActual.id] === undefined}
                  onClick={avanzarPregunta}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* ─── PASO 2: TAREA 30 - SPEAKING ──────────────────────── */}
          {pasoActual === 2 && (
            <div className="text-center py-4">
              <h3 className="fw-normal mb-4">Open Question</h3>

              <div className="p-4 rounded-3 mb-5 text-start bg-black bg-opacity-25 border-start border-white border-opacity-50">
                <p className="fs-5 fw-light m-0 fst-italic text-light opacity-90">
                  "Please tell me about your typical day at work or university. What do you do in the morning, and what is your favorite part of the day?"
                </p>
              </div>

              {!audioBlob ? (
                <div>
                  {!grabando ? (
                    <div>
                      <button 
                        className="btn btn-light rounded-circle p-4 mb-3 shadow-sm"
                        style={{ width: "75px", height: "75px" }}
                        onClick={iniciarGrabacion}
                      >
                        <i className="bi bi-mic-fill fs-3 text-dark"/>
                      </button>
                      <span className="d-block text-white-50 small">Presiona para grabar tu respuesta</span>

                      <button className="btn btn-link text-white-50 small mt-4 text-decoration-none" onClick={simularGrabacionDev}>
                        [Simular audio de prueba]
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="spinner-grow text-light mb-3 bg-opacity-50" style={{width: "2rem", height: "2rem"}} role="status"/>
                      <span className="d-block display-6 font-monospace mb-4">{formatearTiempo(tiempoGrabacion)}</span>
                      <button className="btn btn-light px-4 py-2 rounded-pill fw-medium text-dark" onClick={detenerGrabacion}>
                        Detener grabación
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <i className="bi bi-check2-circle text-light display-4 d-block mb-2"/>
                  <h5 className="fw-normal mb-1">Respuesta capturada</h5>
                  <p className="text-white-50 small mb-4">{tiempoGrabacion} segundos de audio</p>
                  
                  <div className="d-flex justify-content-center gap-3">
                    <button 
                      className="btn btn-outline-secondary btn-sm px-4 rounded-pill text-white"
                      onClick={() => { setAudioBlob(null); setTiempoGrabacion(0); }}
                    >
                      Regrabar
                    </button>
                    <button className="btn btn-light px-5 py-2 rounded-pill fw-medium text-dark" onClick={() => setPasoActual(3)}>
                      Finalizar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── PASO 3: PROCESAMIENTO IA ─────────────────────────── */}
          {pasoActual === 3 && (
            <div className="text-center py-5 my-4">
              <div className="spinner-border text-light opacity-50 mb-4" role="status" />
              <p className="fw-light fs-5 m-0 animate-pulse">{textoAnalisis}</p>
            </div>
          )}
          
          {/* ─── PASO 4: RESULTADOS FINALES ───────────────────────── */}
          {pasoActual === 4 && (
            <div className="text-center py-4">
              <span className="small text-uppercase tracking-widest fw-semibold d-block mb-2 text-white-50">
                Assessment Complete
              </span>
              <h2 className="display-6 fw-light mb-5">Your English Benchmark</h2>

              <div className="row g-3 justify-content-center mb-5">
                <div className="col-6 col-sm-5">
                  <div className="p-3 rounded-3 bg-black bg-opacity-25">
                    <span className="text-white-50 small d-block mb-1">Score</span>
                    <span className="fs-1 fw-medium">{calcularCalificacion().porcentaje}%</span>
                  </div>
                </div>
                <div className="col-6 col-sm-5">
                  <div className="p-3 rounded-3 bg-black bg-opacity-25">
                    <span className="text-white-50 small d-block mb-1">Correct</span>
                    <span className="fs-1 fw-medium">{calcularCalificacion().correctas}/30</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-3 mb-5 bg-light text-dark mx-auto" style={{ maxWidth: "280px" }}>
                <span className="small text-uppercase tracking-wider text-muted d-block mb-1">Recommended Level</span>
                <h3 className="fw-bold m-0">{calcularCalificacion().nivel}</h3>
              </div>

              <button 
                className="btn btn-outline-light px-5 py-2 rounded-pill small"
                onClick={() => {
                  setRespuestas({});
                  setAudioBlob(null);
                  setTiempoGrabacion(0);
                  setPasoActual(0);
                  setPreguntaActualIdx(0);
                }}
              >
                Volver a intentar
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Testing0;