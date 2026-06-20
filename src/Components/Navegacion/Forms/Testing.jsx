// src/Components/Navegacion/Forms/Testing.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// IMPORTACIÓN DE PREGUNTAS: Asegúrate de ajustar los "../" según la ubicación exacta de tu Servicios.jsx
import { questions } from "../../../servicios"; 

export const Testing = () => {
  const navigate = useNavigate();

  // 1. ESTADOS DE CONTROL
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // 2. CÁLCULO DINÁMICO DEL COLOR DE FONDO
  const totalQuestions = questions.length;
  const progressFactor = currentIndex / (totalQuestions - 1);

  // Interpolación para el transcurso del test (Celeste a Azul)
  const r = Math.round(240 + (30 - 240) * progressFactor);
  const g = Math.round(249 + (58 - 249) * progressFactor);
  const b = Math.round(255 + (138 - 255) * progressFactor);

  // Al finalizar, conmuta directamente al Verde Manzana alegre (#7cb342)
  const dynamicBackground = showResults ? "#7cb342" : `rgb(${r}, ${g}, ${b})`;

  // 3. MANEJADORES DE FLUJO
  const handleOptionSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    const updatedAnswers = [...answers, selectedAnswer];
    setAnswers(updatedAnswers);
    setSelectedAnswer("");

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer("");
    setAnswers([]);
    setShowResults(false);
  };

  // 4. PROCESAMIENTO DEL RESULTADO Y MINDSET FACTS
  const correctCount = answers.filter(
    (ans, index) => ans === questions[index].correctAnswer
  ).length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  const getMindsetFact = (score) => {
    if (score < 20) {
      return {
        title: "Capacidad Expandible y sin Límites",
        desc: "¡Tu punto de partida ideal! Recuerda que el aprendizaje de un idioma no es una cualidad fija con la que naces, sino una habilidad que se construye. Tu cerebro tiene una plasticidad asombrosa esperando ser estimulada; cada error hoy es solo información valiosa para expandir tus capacidades desde cero."
      };
    } else if (score >= 20 && score < 50) {
      return {
        title: "La Constancia en los Idiomas",
        desc: "¡Buen intento! Tienes nociones flotando en tu mente que solo necesitan estructura. En la adquisición de lenguas, la constancia supera por completo al talento natural. Establecer un ritmo constante permitirá que tu cerebro mude estos conocimientos a tu memoria lingüística permanente."
      };
    } else if (score >= 50 && score < 80) {
      return {
        title: "Agilidad Cognitiva y Conexión",
        desc: "¡Dominio intermedio sólido! Tu cerebro ya reconoce patrones complejos y estructuras de transición de forma semiautomática. Estás en la etapa perfecta para dejar atrás la traducción mental y empezar a consolidar tu fluidez mediante un enfoque práctico."
      };
    } else {
      return {
        title: "Neuroplasticidad Avanzada",
        desc: "¡Impresionante rendimiento! Esto demuestra la increíble neuroplasticidad de tu cerebro. Has logrado crear autopistas neuronales capaces de almacenar y procesar un sistema lingüístico complejo de forma casi nativa. Tu potencial de asimilación es verdaderamente ilimitado."
      };
    }
  };

  const currentFact = getMindsetFact(scorePercentage);

  return (
    <div 
      className="container-fluid d-flex align-items-center justify-content-center p-3 position-relative" 
      style={{ 
        minHeight: "100vh", 
        backgroundColor: dynamicBackground,
        transition: "background-color 0.8s ease-in-out",
        overflow: "hidden"
      }}
    >
      {/* BURBUJAS DE DISEÑO ESTILO ANTESALA */}
      <div style={{ 
        position: "absolute", 
        top: "-5%", 
        right: "-5%", 
        width: "380px", 
        height: "380px", 
        borderRadius: "50%", 
        background: "rgba(255, 255, 255, 0.15)", 
        filter: "blur(70px)",
        pointerEvents: "none"
      }}></div>
      <div style={{ 
        position: "absolute", 
        bottom: "-8%", 
        left: "-5%", 
        width: "280px", 
        height: "280px", 
        borderRadius: "50%", 
        background: "rgba(255, 255, 255, 0.12)", 
        filter: "blur(60px)",
        pointerEvents: "none"
      }}></div>

      {/* TARJETA DEL TEST */}
      <div 
        className="card shadow-lg p-4 p-md-5 border-0 bg-white" 
        style={{ 
          width: "100%", 
          maxWidth: "850px", 
          borderRadius: "18px",
          zIndex: 5 
        }}
      >
        {!showResults ? (
          // ─── VISTA INTERACTIVA DE PREGUNTAS ───
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold small text-uppercase tracking-wider" style={{ color: "#0284c7" }}>
                English Mindset • Test de Nivelación Rápida
              </span>
              <span className="text-muted small fw-semibold">
                Pregunta {currentIndex + 1} de {totalQuestions}
              </span>
            </div>

            {/* Barra de Progreso Lineal */}
            <div className="progress mb-4" style={{ height: "7px", backgroundColor: "#e2e8f0", borderRadius: "10px" }}>
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${((currentIndex + 1) / totalQuestions) * 100}%`, 
                  backgroundColor: "#1e3a8a",
                  transition: "width 0.4s ease",
                  borderRadius: "10px"
                }}
              ></div>
            </div>

            {/* Enunciado Amplio */}
            <h3 className="fw-bold mb-4 mt-2" style={{ color: "#1e3a8a", lineHeight: "1.4", fontSize: "1.45rem" }}>
              {questions[currentIndex].question}
            </h3>

            {/* Opciones organizadas con espaciado elegante */}
            <div className="d-flex flex-column gap-3 mb-5">
              {questions[currentIndex].options.map((option) => {
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className="btn text-start p-3 fw-medium"
                    style={{
                      border: isSelected ? "2px solid #1e3a8a" : "1px solid #e2e8f0",
                      backgroundColor: isSelected ? "#e0f2fe" : "#ffffff",
                      color: isSelected ? "#1e3a8a" : "#475569",
                      borderRadius: "10px",
                      transition: "all 0.15s ease-in-out",
                      fontSize: "1.05rem"
                    }}
                  >
                    <span className="me-2" style={{ color: isSelected ? "#1e3a8a" : "#cbd5e1" }}>
                      {questions[currentIndex].type === "boolean" ? "•" : "■"}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Botón de Confirmación / Avance */}
            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="btn w-100 py-3 fw-bold shadow-sm"
              style={{
                backgroundColor: selectedAnswer ? "#1e3a8a" : "#94a3b8",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                transition: "all 0.2s",
                fontSize: "1.1rem"
              }}
            >
              {currentIndex === totalQuestions - 1 ? "Finalizar Test y Ver Resultados" : "Siguiente Pregunta"}
            </button>
          </div>
        ) : (
          // ─── PANTALLA DE RESULTADOS FINALES ───
          <div className="text-center py-3">
            <div className="mb-4">
              <span style={{ fontSize: "4rem" }}>🎯</span>
              <h2 className="fw-bold mt-2" style={{ color: "#1e3a8a", fontSize: "2.2rem" }}>Evaluación Completada</h2>
              <p className="text-muted">Aquí tienes tu indicador de desarrollo conceptual</p>
            </div>

            {/* Círculo de porcentaje estilizado */}
            <div 
              className="d-inline-flex align-items-center justify-content-center m-auto mb-4 rounded-circle shadow-sm"
              style={{
                width: "140px",
                height: "140px",
                backgroundColor: "#f0f9ff",
                border: "5px solid #0284c7"
              }}
            >
              <span className="fs-1 fw-black" style={{ color: "#1e3a8a", fontWeight: "800" }}>
                {scorePercentage}%
              </span>
            </div>

            {/* Caja Dinámica de Mindset Facts (Actualizada con verde alegre a juego) */}
            <div className="p-4 rounded-3 text-start mb-5" style={{ backgroundColor: "#f8fafc", borderLeft: "5px solid #2e7d32" }}>
              <h4 className="fw-bold mb-2" style={{ color: "#2e7d32", fontSize: "1.2rem" }}>{currentFact.title}</h4>
              <p className="text-muted mb-0" style={{ lineHeight: "1.6", fontSize: "1rem" }}>
                {currentFact.desc}
              </p>
            </div>

            {/* Acciones de Navegación Sin Iconos */}
            <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
              <button 
                onClick={handleReset} 
                className="btn py-3 fw-bold text-white flex-grow-1"
                style={{ backgroundColor: "#1e3a8a", border: "none", borderRadius: "8px", fontSize: "1.05rem" }}
              >
                Rehacer Test
              </button>
              <button 
                onClick={() => navigate("/")} 
                className="btn py-3 fw-bold btn-light flex-grow-1"
                style={{ color: "#475569", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "1.05rem" }}
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testing;