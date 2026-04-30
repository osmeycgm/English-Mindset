import { useState } from "react"
import { useUser } from "../../Context/UserContext"
import { useNavigate } from "react-router-dom"

export const LoginPage = () => {
  const [mensaje, setMensaje] = useState("")
  const [tipo, setTipo] = useState("")
  const [email, setEmail] = useState("")
  const [contraseña, setContraseña] = useState("")
  
  const { login } = useUser()
  const navigate = useNavigate()

  const validarInput = async (e) => {
    e.preventDefault()

    // 1. Validación de campos vacíos
    if (!email.trim() || !contraseña.trim()) {
      setTipo("error")
      setMensaje("Todos los campos son obligatorios")
      return
    }

    // 2. Validación de formato de correo válido usando una Expresión Regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setTipo("error")
      setMensaje("Por favor, ingresa un correo electrónico válido")
      return
    }

    // 3. Validación de longitud de contraseña (mínimo 6 caracteres)
    if (contraseña.length < 6) {
      setTipo("error")
      setMensaje("La contraseña debe tener al menos 6 caracteres")
      return
    }

    // 4. Procesar el login
    const result = await login(email, contraseña)
    
    if (result.success) {
      setTipo("success")
      setMensaje("¡Bienvenido a ClaudFit!")
      // Redirigir al Home. Asegúrate de que tu ruta en App.jsx sea "/" o "/home"
      setTimeout(() => navigate("/"), 1000) 
    } else {
      setTipo("error")
      setMensaje(result.message)
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #f0f2f5 0%, #6e0543 100%)", padding: "10px"
    }}>
      <section className="shadow-lg" style={{
        width: "100%", maxWidth: "400px", padding: "2rem", borderRadius: "12px", backgroundColor: "#fff"
      }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Iniciar Sesión</h2>
          <p className="text-muted small">Accede a tus planes y clases</p>
        </div>
        
        <form onSubmit={validarInput}>
          {mensaje && (
            <div className={`alert ${tipo === "error" ? "alert-danger" : "alert-success"} py-2 small text-center`}>
              {mensaje}
            </div>
          )}
          
          <div className="mb-3 text-start">
            <label className="form-label small fw-bold">Correo electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="ejemplo@claudfit.com"
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
            />
          </div>
          
          <div className="mb-4 text-start">
            <label className="form-label small fw-bold">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              onChange={(e) => setContraseña(e.target.value)} 
              value={contraseña} 
            />
          </div>
          
          <button type="submit" className="btn btn-dark w-100 fw-bold" style={{ backgroundColor: "#d63384", border: "none" }}>
            Entrar
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="small">¿Nuevo en la plataforma? <span onClick={() => navigate("/register")} 
            style={{ color: "#d63384", cursor: "pointer", fontWeight: "bold" }}>Crea una cuenta</span>
          </p>
        </div>
      </section>
    </div>
  )
}

export default LoginPage