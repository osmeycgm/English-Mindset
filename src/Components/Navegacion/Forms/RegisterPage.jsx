// src/Components/Auth/RegisterPage.jsx
import { useState } from "react"
import { useUser } from "../../Context/UserContext"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export const RegisterPage = () => {
  const [mensaje, setMensaje] = useState("")
  const [tipo, setTipo] = useState("")
  
  // NUEVOS ESTADOS
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [edad, setEdad] = useState("")
  const [email, setEmail] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [confirmar, setConfirmar] = useState("")
  
  const { register, loginWithGoogle } = useUser()
  const navigate = useNavigate()

  const handleGoogleSuccess = async (credentialResponse) => {
    setMensaje("");
    const tokenGoogle = credentialResponse.credential;
    const infoUsuario = jwtDecode(tokenGoogle);
    
    // Enviamos la petición al backend con modo "register"
    const result = await loginWithGoogle(infoUsuario.email, tokenGoogle, "register");
    
    // Interceptamos si el backend nos avisa que el usuario ya se encuentra registrado
    const usuarioYaExiste = result?.message?.toLowerCase().includes("ya existe") || 
                            result?.message?.toLowerCase().includes("registrado") ||
                            result?.isNewUser === false; // Por si tu backend maneja un flag booleano

    if (usuarioYaExiste) {
      // No mostrar mensaje en RegisterPage. Redirigir rápidamente al Login.
      setTimeout(() => navigate("/login?existente=true"), 300);
      return; // Cortamos la ejecución aquí
    }

    if (result && result.success) {
      setTipo("success");
      setMensaje("¡Registro exitoso con Google! Welcome to English Mindset"); 
      setTimeout(() => navigate("/"), 2000);
    } else {
      setTipo("error");
      setMensaje(result?.message || "Ocurrió un error al intentar registrarse con Google.");
    }
  };

  const validarInput = async (e) => {
    e.preventDefault()
    setMensaje("")
    
    // Validamos que los nuevos campos no estén vacíos
    if (!nombre.trim() || !apellido.trim() || !edad.trim() || !email.trim() || !contraseña.trim() || !confirmar.trim()) {
      setTipo("error"); setMensaje("Por favor, completa todos los campos"); return
    }
    if (isNaN(edad) || Number(edad) < 1) {
      setTipo("error"); setMensaje("Por favor ingresa una edad válida"); return
    }
    if (contraseña.length < 6) {
      setTipo("error"); setMensaje("Mínimo 6 caracteres para tu seguridad"); return
    }
    if (contraseña !== confirmar) {
      setTipo("error"); setMensaje("Las contraseñas no coinciden"); return
    }
    
    // Le pasamos los nuevos datos a la función register del Context
    const result = await register(email, contraseña, nombre, apellido, edad)
    if (result.success) {
      setTipo("success");
      setMensaje("¡Registro exitoso! Welcome to English Mindset"); 
      setTimeout(() => navigate("/"), 2000);
    } else {
      setTipo("error"); setMensaje(result.message)
    }
  }

  return (
    <div className="container-fluid p-0" style={{ minHeight: "100vh" }}>
      <div className="row g-0 min-vh-100">
        
        {/* COLUMNA IZQUIERDA: SECCIÓN INFORMATIVA */}
        <div className="col-md-6 d-none d-md-flex flex-column align-items-start justify-content-center p-5 text-white position-relative" 
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "15%", left: "-5%", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(255,255,255,0.02)" }}></div>

          <div style={{ maxWidth: "85%", zIndex: 10 }}>
            <span style={{ backgroundColor: "rgba(255, 255, 255, 0.12)", padding: "6px 16px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }} className="mb-4 d-inline-block">
              🚀 Neuroplasticidad
            </span>
            <h3 className="fw-bold mb-3 lh-base" style={{ fontSize: "2rem" }}>
              "Tu cerebro cambia físicamente de tamaño al aprender inglés."
            </h3>
            <p style={{ color: "#e2e8f0", fontSize: "1.05rem", lineHeight: "1.6" }} className="fw-light">
              Aprender un segundo idioma activa la neuroplasticidad estructural. Monitoreos cerebrales revelan que la materia gris en la corteza cerebral y el hipocampo se expande notablemente. No solo estás adquiriendo vocabulario, estás haciendo que tu cerebro sea más joven, flexible y resistente al paso del tiempo.
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-white p-4 p-md-5">
          <div style={{ width: "100%", maxWidth: "420px" }}>
            <div className="mb-4 text-center text-md-start">
              <h2 className="fw-bold" style={{ color: "#1e3a8a", letterSpacing: "-0.5px", textAlign: "center" }}>Crea tu Cuenta</h2>
            </div>

            {/* BOTÓN OFICIAL DE GOOGLE */}
            <div className="d-flex justify-content-center mb-2" 
                 style={{ filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.08))", transition: "all 0.2s ease" }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setTipo("error");
                  setMensaje("Ocurrió un error al intentar registrarse con Google.");
                }}
                theme="outline"
                size="large"
                shape="pill"
                width="420"
                text="signup_with"
              />
            </div>

            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1" style={{ borderColor: "#e2e8f0" }}/>
              <span className="mx-3 text-muted small fw-medium" style={{ color: "#94a3b8" }}>o con tu correo</span>
              <hr className="flex-grow-1" style={{ borderColor: "#e2e8f0" }}/>
            </div>

            <form onSubmit={validarInput}>
              {mensaje && (
                <div className={`alert ${tipo === "error" ? "alert-danger" : "alert-success"} py-2 small text-center`} style={{ borderRadius: "10px" }}>
                  {mensaje}
                </div>
              )}
              
              {/* FILA PARA NOMBRE Y APELLIDO */}
              <div className="row mb-3">
                <div className="col-6 text-start">
                  <label className="form-label small fw-bold" style={{ color: "#475569" }}>Nombre</label>
                  <input type="text" className="form-control py-2.5 px-3" placeholder="Ej: María" style={{ borderRadius: "10px", border: "1px solid #cbd5e1" }}
                    onChange={(e) => setNombre(e.target.value)} value={nombre} />
                </div>
                <div className="col-6 text-start">
                  <label className="form-label small fw-bold" style={{ color: "#475569" }}>Apellido</label>
                  <input type="text" className="form-control py-2.5 px-3" placeholder="Ej: Pérez" style={{ borderRadius: "10px", border: "1px solid #cbd5e1" }}
                    onChange={(e) => setApellido(e.target.value)} value={apellido} />
                </div>
              </div>

              {/* FILA PARA EDAD Y EMAIL */}
              <div className="row mb-3">
                <div className="col-4 text-start">
                  <label className="form-label small fw-bold" style={{ color: "#475569" }}>Edad</label>
                  <input type="number" className="form-control py-2.5 px-3" placeholder="18" style={{ borderRadius: "10px", border: "1px solid #cbd5e1" }}
                    onChange={(e) => setEdad(e.target.value)} value={edad} min="1" max="120" />
                </div>
                <div className="col-8 text-start">
                  <label className="form-label small fw-bold" style={{ color: "#475569" }}>Correo</label>
                  <input type="email" className="form-control py-2.5 px-3" placeholder="estudiante@englishmindset.com" style={{ borderRadius: "10px", border: "1px solid #cbd5e1" }}
                    onChange={(e) => setEmail(e.target.value)} value={email} />
                </div>
              </div>
              
              {/* FILA PARA CONTRASEÑAS */}
              <div className="row mb-4">
                <div className="col-6 text-start">
                  <label className="form-label small fw-bold" style={{ color: "#475569" }}>Contraseña</label>
                  <input type="password" className="form-control py-2.5 px-3" placeholder="Clave segura" style={{ borderRadius: "10px", border: "1px solid #cbd5e1" }}
                    onChange={(e) => setContraseña(e.target.value)} value={contraseña} />
                </div>
                <div className="col-6 text-start">
                  <label className="form-label small fw-bold" style={{ color: "#475569" }}>Confirmar</label>
                  <input type="password" className="form-control py-2.5 px-3" placeholder="Repetir clave" style={{ borderRadius: "10px", border: "1px solid #cbd5e1" }}
                    onChange={(e) => setConfirmar(e.target.value)} value={confirmar} />
                </div>
              </div>
              
              <button type="submit" className="btn w-100 fw-bold py-2.5" 
                style={{ backgroundColor: "#1e3a8a", color: "#fff", border: "none", borderRadius: "10px", boxShadow: "0 4px 6px rgba(30, 58, 138, 0.2)" }}>
                Sign Up
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="small text-muted">¿Ya eres miembro? <span onClick={() => navigate("/login")} 
                style={{ color: "#0284c7", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}>Inicia sesión</span></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default RegisterPage;