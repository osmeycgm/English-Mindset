import { useState } from "react"
import { useUser } from "../../Context/UserContext"
import { useNavigate } from "react-router-dom"

export const RegisterPage = () => {
  const [mensaje, setMensaje] = useState("")
  const [tipo, setTipo] = useState("")
  const [email, setEmail] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const { register } = useUser()
  const navigate = useNavigate()

  const validarInput = async (e) => {
    e.preventDefault()
    if (!email.trim() || !contraseña.trim() || !confirmar.trim()) {
      setTipo("error"); setMensaje("Por favor, completa todos los campos"); return
    }
    if (contraseña.length < 6) {
      setTipo("error"); setMensaje("La seguridad es primero: mínimo 6 caracteres"); return
    }
    if (contraseña !== confirmar) {
      setTipo("error"); setMensaje("Las contraseñas deben ser idénticas"); return
    }
    const result = await register(email, contraseña)
    if (result.success) {
      setTipo("success"); setMensaje("¡Registro exitoso! Preparando tu perfil...");
      setTimeout(() => navigate("/"), 1500)
    } else {
      setTipo("error"); setMensaje(result.message)
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #f0f2f5 0%, #6e0543 80%)", padding: "40px"
    }}>
      <section className="shadow-lg" style={{
        width: "100%", maxWidth: "420px", padding: "2rem", borderRadius: "15px", backgroundColor: "#fff"
      }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Únete a ClaudFit</h2>
          <p className="text-muted small">Tu transformación física y lingüística empieza hoy</p>
        </div>
        <form onSubmit={validarInput}>
          {mensaje && (
            <div className={`alert ${tipo === "error" ? "alert-danger" : "alert-success"} py-2 small text-center`}>
              {mensaje}
            </div>
          )}
          <div className="mb-3 text-start">
            <label className="form-label small fw-bold">Correo Electrónico</label>
            <input type="email" className="form-control" placeholder="tu@email.com"
              onChange={(e) => setEmail(e.target.value)} value={email} />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label small fw-bold">Contraseña</label>
            <input type="password" className="form-control" placeholder="Crea una clave segura"
              onChange={(e) => setContraseña(e.target.value)} value={contraseña} />
          </div>
          <div className="mb-4 text-start">
            <label className="form-label small fw-bold">Confirmar Contraseña</label>
            <input type="password" className="form-control" placeholder="Repite tu clave"
              onChange={(e) => setConfirmar(e.target.value)} value={confirmar} />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold py-2" 
            style={{ backgroundColor: "#d63384", border: "none", boxShadow: "0 4px 15px rgba(214, 51, 132, 0.3)" }}>
            Registrarme Ahora
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="small text-muted">¿Ya eres parte de nosotros? <span onClick={() => navigate("/login")} 
            style={{ color: "#d63384", cursor: "pointer", fontWeight: "bold" }}>Inicia sesión</span></p>
        </div>
      </section>
    </div>
  )
}

export default RegisterPage