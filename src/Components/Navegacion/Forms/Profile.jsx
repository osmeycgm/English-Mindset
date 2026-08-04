// src/Components/Profile/Profile.jsx
import { useEffect, useState } from "react"
import { useUser } from "../../Context/UserContext"
import { useNavigate } from "react-router-dom"
import { getRandomFact } from "../../../Data/mindsetFacts"

export const Profile = () => {
    const { email, id, token, logout, getProfile, nombre = "Estudiante", apellido = "", planes = [] } = useUser()
    const navigate = useNavigate()

    const [seccionActiva, setSeccionActiva] = useState("resumen")
    const [passForm, setPassForm] = useState({ actual: "", nueva: "", confirmar: "" })
    
    // ESTADO PARA EL FACT DE LA COLECCIÓN COMBINADA
    const [mindsetFact, setMindsetFact] = useState(null)
    const [loadingFact, setLoadingFact] = useState(true)

    const isGoogleUser = email && email.includes("@gmail.com")

    useEffect(() => {
        getProfile()
        fetchRandomFact()
    }, [token])

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const fetchRandomFact = () => {
        setLoadingFact(true)
        setTimeout(() => {
            const fact = getRandomFact()
            setMindsetFact(fact)
            setLoadingFact(false)
        }, 300)
    }

    const inicial = email ? email.charAt(0).toUpperCase() : (nombre ? nombre.charAt(0).toUpperCase() : "U")
    const idFormateado = id ? String(id).substring(0, 3) : "..."

    return (
        <>
            <style>{`
                .btn-hover-effect { transition: all 0.2s ease; }
                .btn-hover-effect:hover { transform: translateY(-2px); }
                .btn-logout:hover { background-color: #ef4444 !important; color: white !important; }
                .tab-btn { transition: all 0.2s ease; }
                .tab-btn:hover:not(.active-tab) { background-color: #e2e8f0 !important; }
                .refresh-btn { transition: all 0.3s ease; }
                .refresh-btn:hover { transform: rotate(180deg); color: #fff !important; }
            `}</style>

            {/* CONTENEDOR TIPO DASHBOARD (Sin burbujas ni degradado pastel) */}
            <div className="container-fluid p-0" style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "2.5rem 1rem" }}>
                <div className="container py-3" style={{ maxWidth: "1000px" }}>
                    
                    {/* ENCABEZADO */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>Mi Perfil</h2>
                            <p className="text-muted small mb-0">Gestión de cuenta y conocimientos sobre aprendizaje inteligente</p>
                        </div>
                    </div>

                    {/* HERO BANNER: FACT COMBINADO DESTACADO */}
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden" 
                         style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", color: "white" }}>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", padding: "5px 14px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                                {mindsetFact?.category || "🧠 Mindset Fact"}
                            </span>
                            <button onClick={fetchRandomFact} className="btn btn-link text-white-50 p-0 refresh-btn" title="Descubrir otro dato">
                                🔄
                            </button>
                        </div>

                        {loadingFact || !mindsetFact ? (
                            <div className="py-3 text-center">
                                <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                            </div>
                        ) : (
                            <div>
                                <h4 className="fw-bold mb-2" style={{ fontSize: "1.35rem", color: "#f8fafc" }}>
                                    {mindsetFact.title}
                                </h4>
                                <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: "1.6" }} className="mb-0 fw-light">
                                    {mindsetFact.text}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* SECCIÓN DE DATOS Y AJUSTES */}
                    <div className="row g-4">
                        
                        {/* TARJETA DE USUARIO */}
                        <div className="col-12 col-md-5 col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                                <div className="d-flex flex-column align-items-center text-center mb-4">
                                    <div style={{ width: "88px", height: "88px", borderRadius: "50%", background: "linear-gradient(135deg, #1e3a8a, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem", color: "white", fontWeight: "bold", marginBottom: "1rem" }}>
                                        {inicial}
                                    </div>
                                    <h5 className="fw-bold mb-1" style={{ color: "#0f172a" }}>{nombre} {apellido}</h5>
                                    <span className="badge bg-light text-secondary border px-3 py-1 rounded-pill small">Estudiante</span>
                                </div>

                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase small mb-3 text-muted" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>Tus Planes</h6>
                                    {planes && planes.length > 0 ? (
                                        planes.map((p, i) => (
                                            <span key={i} className="badge rounded-pill d-block mb-2 py-2" style={{ backgroundColor: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>
                                                ⭐ {p}
                                            </span>
                                        ))
                                    ) : (
                                        <div className="p-3 bg-light rounded-3 text-center">
                                            <p className="small text-muted mb-0">Sin planes activos</p>
                                        </div>
                                    )}
                                </div>

                                <button className="btn btn-logout w-100 fw-bold mt-auto py-2" style={{ backgroundColor: "#fef2f2", color: "#ef4444", border: "none", borderRadius: "10px" }} onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>

                        {/* PANEL DE DATOS Y SEGURIDAD */}
                        <div className="col-12 col-md-7 col-lg-8">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                                <div className="d-flex gap-2 mb-4 bg-light p-1 rounded-3">
                                    <button 
                                        className={`btn tab-btn flex-grow-1 fw-bold py-2 ${seccionActiva === "resumen" ? "active-tab" : ""}`} 
                                        style={{ borderRadius: "8px", backgroundColor: seccionActiva === "resumen" ? "#1e3a8a" : "transparent", color: seccionActiva === "resumen" ? "#fff" : "#64748b", border: "none" }} 
                                        onClick={() => setSeccionActiva("resumen")}>
                                        Datos Personales
                                    </button>
                                    <button 
                                        className={`btn tab-btn flex-grow-1 fw-bold py-2 ${seccionActiva === "password" ? "active-tab" : ""}`} 
                                        style={{ borderRadius: "8px", backgroundColor: seccionActiva === "password" ? "#1e3a8a" : "transparent", color: seccionActiva === "password" ? "#fff" : "#64748b", border: "none" }} 
                                        onClick={() => setSeccionActiva("password")}>
                                        Seguridad
                                    </button>
                                </div>

                                {seccionActiva === "resumen" ? (
                                    <div className="d-flex flex-column gap-3">
                                        <div className="p-3 rounded-3" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                            <small className="text-muted fw-bold d-block mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>CORREO ELECTRÓNICO</small>
                                            <span className="fw-semibold text-dark">{email}</span>
                                        </div>
                                        <div className="p-3 rounded-3" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                            <small className="text-muted fw-bold d-block mb-1" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>ID DE ESTUDIANTE</small>
                                            <span className="fw-semibold font-monospace text-dark">{idFormateado}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-2">
                                        {isGoogleUser ? (
                                            <div className="alert alert-info border-0 rounded-3 small mb-0" style={{ backgroundColor: "#f0f9ff", color: "#0369a1" }}>
                                                Iniciaste sesión mediante Google. La gestión de tu contraseña se administra directamente desde tu cuenta de Google.
                                            </div>
                                        ) : (
                                            <p className="small text-muted mb-0">Formulario de cambio de contraseña disponible.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;