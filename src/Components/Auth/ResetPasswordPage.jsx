// src/Components/Auth/ResetPasswordPage.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_URL =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5000"
        : "https://english-mindset-production.up.railway.app";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [completado, setCompletado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setTipo("error");
      setMensaje("Token de recuperación no encontrado o inválido.");
      return;
    }

    if (newPassword.length < 6) {
      setTipo("error");
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setTipo("error");
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    setMensaje("");

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTipo("success");
        setMensaje(data.message);
        setCompletado(true);
      } else {
        setTipo("error");
        setMensaje(data.message || "Error al actualizar contraseña.");
      }
    } catch (error) {
      console.error("Error en reset-password:", error);
      setTipo("error");
      setMensaje("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div className="card border-0 shadow-lg p-4 p-md-5" style={{ maxWidth: "450px", width: "100%", borderRadius: "16px" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold" style={{ color: "#1e3a8a" }}>Nueva Contraseña</h3>
          <p className="text-muted small">Crea una nueva clave de acceso para tu cuenta.</p>
        </div>

        {mensaje && (
          <div className={`alert ${tipo === "error" ? "alert-danger" : "alert-success"} py-2 small text-center rounded-3`}>
            {mensaje}
          </div>
        )}

        {!completado ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label small fw-bold text-secondary">Nueva Contraseña</label>
              <input 
                type="password" 
                className="form-control py-2.5 px-3" 
                style={{ borderRadius: "10px", border: "1px solid #cbd5e1" }}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={cargando}
              />
            </div>

            <div className="mb-4 text-start">
              <label className="form-label small fw-bold text-secondary">Confirmar Nueva Contraseña</label>
              <input 
                type="password" 
                className="form-control py-2.5 px-3" 
                style={{ borderRadius: "10px", border: "1px solid #cbd5e1" }}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={cargando}
              />
            </div>

            <button 
              type="submit" 
              className="btn w-100 fw-bold py-2.5"
              style={{ backgroundColor: "#1e3a8a", color: "#fff", border: "none", borderRadius: "10px" }}
              disabled={cargando}
            >
              {cargando ? "Guardando..." : "Guardar Nueva Contraseña"}
            </button>
          </form>
        ) : (
          <div className="text-center mt-3">
            <button 
              onClick={() => navigate("/login")} 
              className="btn w-100 fw-bold py-2.5"
              style={{ backgroundColor: "#22c55e", color: "#fff", border: "none", borderRadius: "10px" }}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;