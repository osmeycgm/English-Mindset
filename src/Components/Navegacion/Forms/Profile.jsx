import { useEffect } from "react"
import { useUser } from "../../Context/UserContext"
import { useNavigate } from "react-router-dom"

export const Profile = () => {
    const { email, id, token, logout, getProfile } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        getProfile()
    }, [token])

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    // Extraer la inicial del email para el avatar
    const inicial = email ? email.charAt(0).toUpperCase() : "U"

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            padding: "20px"
        }}>
            <section className="shadow-lg" style={{
                width: "100%",
                maxWidth: "400px",
                padding: "2.5rem",
                borderRadius: "20px",
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                {/* Avatar Moderno */}
                <div style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #d63384, #fd7e14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    boxShadow: "0 4px 15px rgba(214, 51, 132, 0.4)"
                }}>
                    {inicial}
                </div>

                <h2 className="fw-bold mb-1" style={{ color: "#333" }}>Mi Perfil</h2>
                <p className="text-muted small mb-4">Miembro de ClaudFit</p>

                {/* Campos de Información */}
                <div className="w-100" style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
                    {[
                        { label: "Email de contacto", valor: email, icon: "✉️" },
                        { label: "ID de Usuario", valor: id, icon: "🆔" },
                    ].map(({ label, valor, icon }) => (
                        <div key={label} style={{
                            width: "100%",
                            padding: "12px 15px",
                            borderRadius: "12px",
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #eee"
                        }}>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <span style={{ fontSize: "0.8rem" }}>{icon}</span>
                                <small className="text-uppercase fw-bold" style={{ color: "#aaa", fontSize: "10px", letterSpacing: "1px" }}>
                                    {label}
                                </small>
                            </div>
                            <p className="text-truncate m-0" style={{ fontWeight: "600", color: "#444" }}>
                                {valor || "Cargando..."}
                            </p>
                        </div>
                    ))}
                </div>

                <button
                    className="btn btn-outline-danger w-100 fw-bold"
                    style={{ 
                        marginTop: "2rem", 
                        borderRadius: "10px",
                        borderWidth: "2px"
                    }}
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>
                
                <p className="mt-4 text-muted" style={{ fontSize: "12px" }}>
                    ¿Necesitas ayuda? <span style={{ color: "#d63384", cursor: "pointer" }}>Contacta a soporte</span>
                </p>
            </section>
        </div>
    )
}

export default Profile