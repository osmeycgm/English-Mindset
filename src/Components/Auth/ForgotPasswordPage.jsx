// src/Components/Auth/ForgotPasswordPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5000"
        : "https://english-mindset-production.up.railway.app";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Estado para el Mindset Fact enfocado en la Memoria y el Olvido
  const [mindsetFact, setMindsetFact] = useState({
    quote: "El olvido es la clave para un aprendizaje más profundo.",
    text: "En neurociencia, la curva del olvido demuestra que reaprender o recordar un dato tras haberlo olvidado fortalece las conexiones sinápticas. Restablecer tu acceso es el primer paso para reactivar tu rutina de entrenamiento mental."
  });

  // Simulación de selección de facts sobre memoria y aprendizaje
  useEffect(() => {
    const facts = [
      {
        quote: '"El olvido es la clave para un aprendizaje más profundo."',
        text: "En neurociencia, la 'curva del olvido' de Ebbinghaus demuestra que recuperar la información después de un intervalo fortalece la consolidación de la memoria a largo plazo."
      },
      {
        quote: '"Tu cerebro no pierde información, reorganiza rutas de acceso."',
        text: "Cuando no recuerdas una contraseña o una palabra en inglés, la huella de memoria sigue intacta; solo necesitas reconstruir la ruta cognitiva para volver a conectarla."
      }
    ];
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    setMindsetFact(randomFact);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setTipo("error");
      setMensaje("Por favor, ingresa tu correo electrónico.");
      return;
    }

    setCargando(true);
    setMensaje("");

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTipo("success");
        setMensaje(data.message);
      } else {
        setTipo("error");
        setMensaje(data.message || "No se pudo procesar la solicitud.");
      }
    } catch (error) {
      console.error("Error al solicitar recuperación:", error);
      setTipo("error");
      setMensaje("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: "100vh" }}>
      <div className="row g-0 min-vh-100">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-white p-4 p-md-5">
          <div style={{ width: "100%", maxWidth: "400px" }}>
            
            <div className="mb-4 text-center text-md-start">
              <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle" 
                   style={{ width: "50px", height: "50px", backgroundColor: "#e0f2fe", color: "#0284c7", fontSize: "1.25rem" }}>
                🔑
              </div>
              <h2 className="fw-bold" style={{ color: "#1e3a8a", letterSpacing: "-0.5px" }}>¿Olvidaste tu contraseña?</h2>
              <p className="text-muted small">Ingresa tu correo registrado y te enviaremos un enlace seguro para restablecerla.</p>
            </div>

            {mensaje && (
              <div className={`alert ${tipo === "error" ? "alert-danger" : "alert-success"} py-2.5 px-3 small text-center mb-4`} 
                   style={{ borderRadius: "10px", border: "none" }}>
                {mensaje}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-start">
                <label className="form-label small fw-bold" style={{ color: "#475569" }}>Correo Electrónico</label>
                <input 
                  type="email" 
                  className="form-control py-2.5 px-3" 
                  style={{ borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                  placeholder="estudiante@englishmindset.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={cargando}
                />
              </div>

              <button 
                type="submit" 
                className="btn w-100 fw-bold py-2.5 mb-3"
                style={{ 
                  backgroundColor: "#1e3a8a", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(30, 58, 138, 0.2)",
                  transition: "all 0.2s ease"
                }}
                disabled={cargando}
              >
                {cargando ? "Enviando enlace..." : "Enviar Enlace de Recuperación"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span 
                onClick={() => navigate("/login")} 
                style={{ color: "#0284c7", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem", textDecoration: "none" }}
              >
                ← Volver al inicio de sesión
              </span>
            </div>

          </div>
        </div>

        {/* COLUMNA DERECHA: SECCIÓN INFORMATIVA DINÁMICA (MINDSET FACT) */}
        <div className="col-md-6 d-none d-md-flex flex-column align-items-start justify-content-center p-5 text-white position-relative" 
             style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%)", overflow: "hidden" }}>
          
          {/* Elementos decorativos de fondo */}
          <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }}></div>
          <div style={{ position: "absolute", bottom: "-5%", left: "-5%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }}></div>

          <div style={{ maxWidth: "85%", zIndex: 10 }}>
            <span style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", padding: "6px 16px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }} className="mb-4 d-inline-block">
              🧠 Mindset & Memory
            </span>
            <h3 className="fw-bold mb-3 lh-base" style={{ fontSize: "1.8rem" }}>
              {mindsetFact.quote}
            </h3>
            <p style={{ color: "#e0f2fe", fontSize: "1.05rem", lineHeight: "1.6" }} className="fw-light">
              {mindsetFact.text}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;