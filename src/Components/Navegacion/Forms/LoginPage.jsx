// src/Components/Auth/LoginPage.jsx
import { useState, useEffect } from "react"
import { useUser } from "../../Context/UserContext"
import { useNavigate, useSearchParams } from "react-router-dom"
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export const LoginPage = () => {
  const [mensaje, setMensaje] = useState("")
  const [tipo, setTipo] = useState("")
  const [email, setEmail] = useState("")
  const [contraseña, setContraseña] = useState("")
    const [searchParams] = useSearchParams()
  
  const { login, loginWithGoogle } = useUser() 
  const navigate = useNavigate()

  // Si viene de un intento de registro con cuenta existente, mostrar mensaje
  useEffect(() => {
    if (searchParams.get("existente") === "true") {
      setTipo("info");
      setMensaje("Esta cuenta ya existe. Por favor, inicia sesión para continuar.");
      // Limpiar el parámetro de la URL después de leer el mensaje
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, navigate])
  const handleGoogleSuccess = async (credentialResponse) => {
    const tokenGoogle = credentialResponse.credential;
    const infoUsuario = jwtDecode(tokenGoogle);
    
    const result = await loginWithGoogle(infoUsuario.email, tokenGoogle, "login");
    
    if (result && result.success) {
      setTipo("success");
      setMensaje("¡Welcome back con Google!");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setTipo("error");
      setMensaje(result?.message || "Esta cuenta no está registrada con English Mindset. Por favor, regístrate primero.");
    }
  };

  const validarInput = async (e) => {
    e.preventDefault()
    if (!email.trim() || !contraseña.trim()) {
      setTipo("error"); setMensaje("Todos los campos son obligatorios"); return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setTipo("error"); setMensaje("Por favor, ingresa un correo electrónico válido"); return
    }
    if (contraseña.length < 6) {
      setTipo("error"); setMensaje("La contraseña debe tener al menos 6 caracteres"); return
    }

    const result = await login(email, contraseña)
    if (result.success) {
      setTipo("success")
      setMensaje("¡Welcome back!")
      setTimeout(() => navigate("/"), 1500) 
    } else {
      setTipo("error"); setMensaje(result.message)
    }
  }

  return (
    <div className="container-fluid p-0" style={{ minHeight: "100vh" }}>
      <div className="row g-0 min-vh-100">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-white p-4 p-md-5">
          <div style={{ width: "100%", maxWidth: "380px" }}>
            <div className="mb-4 text-center text-md-start">
              <h2 className="fw-bold" style={{ color: "#1e3a8a", letterSpacing: "-0.5px" }}>Welcome Back</h2>
              <p className="text-muted small">Accede a tus clases y material exclusivo</p>
            </div>

            {/* BOTÓN OFICIAL DE GOOGLE (ESTILO AESTHETIC) */}
            <div className="d-flex justify-content-center mb-2" 
                 style={{ filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.08))", transition: "all 0.2s ease" }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setTipo("error");
                  setMensaje("Ocurrió un error al intentar acceder con Google.");
                }}
                theme="outline"
                size="large"
                shape="pill" // Bordes redondeados modernos
                width="380"
                text="signin_with"
              />
            </div>

            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1" style={{ borderColor: "#e2e8f0" }}/>
              <span className="mx-3 text-muted small fw-medium" style={{ color: "#94a3b8" }}>o con tu cuenta</span>
              <hr className="flex-grow-1" style={{ borderColor: "#e2e8f0" }}/>
            </div>
            
            <form onSubmit={validarInput}>
              {mensaje && (
                 <div className={`alert ${tipo === "error" ? "alert-danger" : tipo === "info" ? "alert-info" : "alert-success"} py-2 small text-center`} style={{ borderRadius: "10px" }}>
                  {mensaje}
                </div>
              )}
              
              <div className="mb-3 text-start">
                <label className="form-label small fw-bold" style={{ color: "#475569" }}>Email</label>
                <input 
                  className="form-control py-2.5 px-3" 
                  style={{ borderRadius: "10px", border: "1px solid #cbd5e1" }}
                  placeholder="estudiante@englishmindset.com"
                  onChange={(e) => setEmail(e.target.value)} 
                  value={email} 
                />
              </div>
              
              <div className="mb-4 text-start">
                <label className="form-label small fw-bold" style={{ color: "#475569" }}>Contraseña</label>
                <input 
                  type="password" 
                  className="form-control py-2.5 px-3" 
                  style={{ borderRadius: "10px", border: "1px solid #cbd5e1" }}
                  placeholder="••••••••"
                  onChange={(e) => setContraseña(e.target.value)} 
                  value={contraseña} 
                />
              </div>
              
              <button type="submit" className="btn w-100 fw-bold py-2.5" 
                      style={{ backgroundColor: "#1e3a8a", color: "#fff", border: "none", borderRadius: "10px", boxShadow: "0 4px 6px rgba(30, 58, 138, 0.2)" }}>
                Sign In
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="small text-muted">¿Aún no tienes cuenta? <span onClick={() => navigate("/register")} 
                style={{ color: "#0284c7", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}>Regístrate gratis</span>
              </p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: SECCIÓN INFORMATIVA */}
        <div className="col-md-6 d-none d-md-flex flex-column align-items-start justify-content-center p-5 text-white position-relative" 
          style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }}></div>
          <div style={{ position: "absolute", bottom: "-5%", left: "-5%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }}></div>

          <div style={{ maxWidth: "85%", zIndex: 10 }}>
            <span style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", padding: "6px 16px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }} className="mb-4 d-inline-block">
              🧠 Mindset Fact
            </span>
            <h3 className="fw-bold mb-3 lh-base" style={{ fontSize: "2rem" }}>
              "Pensar en otro idioma te hace tomar decisiones más racionales."
            </h3>
            <p style={{ color: "#e0f2fe", fontSize: "1.05rem", lineHeight: "1.6" }} className="fw-light">
              Estudios científicos de la Universidad de Chicago demuestran que al procesar problemas en una segunda lengua, tu cerebro reduce los sesgos emocionales y automáticos. Al eliminar la traducción mental, analizas los riesgos de forma mucho más analítica, lógica y clara.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginPage