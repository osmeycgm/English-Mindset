// src/Components/Pages/Test.jsx (o la ruta donde organices tus páginas)
import { useNavigate } from "react-router-dom";

export const Test = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate("/testing");
    // Aquí redirigirás al componente del test real cuando lo programemos
    console.log("Iniciando test...");
    // navigate("/test-quiz"); 
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <div className="row g-0 min-vh-100">
        
        {/* COLUMNA IZQUIERDA: ANTESALA DEL TEST */}
        <div className="col-12 col-md-7 d-flex align-items-center justify-content-center bg-white p-4 p-md-5">
          <div style={{ width: "100%", maxWidth: "550px" }}>
            
            {/* Encabezado e indicador de Gratis */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <span style={{ 
                backgroundColor: "#e0f2fe", 
                color: "#0369a1", 
                padding: "4px 12px", 
                borderRadius: "6px", 
                fontSize: "0.75rem", 
                fontWeight: "700",
                textTransform: "uppercase"
              }}>
                Free Access
              </span>
              <span className="text-muted small">• Evaluación Inicial</span>
            </div>

            <h1 className="fw-bold mb-3" style={{ color: "#1e3a8a", letterSpacing: "-0.5px", fontSize: "2.25rem" }}>
              Test de Nivelación Rápida
            </h1>
            
            <p className="text-muted mb-4" style={{ fontSize: "1.05rem", lineHeight: "1.6" }}>
             Este test de <strong>English Mindset</strong> evalúa tus bases lingüísticas clave para recomendarte el punto de partida ideal en tu ruta de aprendizaje.
            </p>

            {/* Tarjetas de Información del Test */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6">
                <div className="p-3 rounded-3" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <h6 className="fw-bold mb-1" style={{ color: "#1e3a8a" }}>🎯 Objetivos</h6>
                  <p className="text-muted small mb-0">Medir tu dominio en gramática, vocabulario y comprensión lectora bajo el marco europeo (MCER).</p>
                </div>
              </div>
              
              <div className="col-12 col-sm-6">
                <div className="p-3 rounded-3" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <h6 className="fw-bold mb-1" style={{ color: "#1e3a8a" }}>⏱️ Duración</h6>
                  <p className="text-muted small mb-0">Aproximadamente 5-10 minutos. Te recomendamos realizarlo en un lugar tranquilo y sin interrupciones.</p>
                </div>
              </div>
            </div>

            {/* Aviso/Nota informativa sobre el test premium */}
            <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <div className="d-flex gap-2">
                <span style={{ fontSize: "1.1rem" }}>💡</span>
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: "#166534", fontSize: "0.9rem" }}>¿Buscas un diagnóstico 100% exhaustivo?</h6>
                  <p className="mb-0 text-muted small" style={{ lineHeight: "1.5" }}>
                    Este es un diagnóstico rápido de cortesía. Al inscribirte en cualquiera de nuestros servicios, accederás a un <strong>test de nivelación avanzado y completo</strong> que te permitirá evaluar tu fluidez oral y auditiva.
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
              <button 
                onClick={handleStartTest}
                className="btn fw-bold py-3 px-4 flex-grow-1 flex-sm-grow-0" 
                style={{ backgroundColor: "#1e3a8a", color: "#fff", border: "none", transition: "0.2s", cursor: "pointer" }}
              >
                Comenzar Evaluación
              </button>
              <button 
                onClick={() => navigate(-1)} 
                className="btn fw-bold py-3 px-4 btn-light"
                style={{ color: "#475569" }}
              >
                Volver atrás
              </button>
            </div>

          </div>
        </div>

        {/* COLUMNA DERECHA: DATOS / CURIOSIDADES (ESTILO LOGIN) */}
        <div className="col-md-5 d-none d-md-flex flex-column align-items-start justify-content-center p-5 text-white position-relative" 
          style={{ 
            background: "linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%)",
            overflow: "hidden"
          }}
        >
          {/* Elementos geométricos de fondo */}
          <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(255,255,255,0.025)" }}></div>
          <div style={{ position: "absolute", bottom: "-5%", left: "-5%", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(255,255,255,0.025)" }}></div>

          <div style={{ maxWidth: "90%", zIndex: 10 }}>
            <span style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.15)", 
              padding: "6px 16px", 
              borderRadius: "20px", 
              fontSize: "0.8rem", 
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }} className="mb-4 d-inline-block">
              📊 Assessment Fact
            </span>
            
            <h3 className="fw-bold mb-3 lh-base" style={{ fontSize: "1.85rem" }}>
              "Estudiar en la 'Zona de Confort' frena tu progreso real."
            </h3>
            
            <p style={{ color: "#e0f2fe", fontSize: "1rem", lineHeight: "1.6" }} className="fw-light mb-4">
              En la adquisición de lenguas existe el concepto de <em>"Input Comprensible + 1"</em> (Krashen). Si estudias material por debajo de tu nivel verdadero, te aburres; si estudias algo demasiado avanzado, tu cerebro se frustra y se bloquea. 
            </p>

            <p style={{ color: "#e0f2fe", fontSize: "1rem", lineHeight: "1.6" }} className="fw-light">
              Medir con precisión tu estado actual nos permite estructurar desafíos óptimos para expandir tus habilidades cognitivas sin perder tiempo repasando lo que ya dominas.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Test;