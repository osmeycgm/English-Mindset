// src/Components/Profile/Profile.jsx
import { useEffect, useState } from "react"
import { useUser } from "../../Context/UserContext"
import { useNavigate } from "react-router-dom"

export const Profile = () => {
    const { email, id, token, logout, getProfile, nombre = "Estudiante", apellido = "", planes = [] } = useUser()
    const navigate = useNavigate()

    const [seccionActiva, setSeccionActiva] = useState("resumen")
    const [passForm, setPassForm] = useState({ actual: "", nueva: "", confirmar: "" })
    const [mindsetFact, setMindsetFact] = useState("")
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
        const facts = [
            "Aprender un nuevo idioma retrasa la aparición de síntomas de demencia hasta en 5 años.",
            "El cerebro bilingüe desarrolla mayor densidad de materia gris, optimizando la memoria.",
            "Pensar en inglés al tomar decisiones reduce los sesgos emocionales.",
            "La neuroplasticidad inducida por el bilingüismo mejora tus funciones ejecutivas.",
            "Hablar dos idiomas fortalece tu capacidad de concentración."
        ]
        
        setTimeout(() => {
            const randomFact = facts[Math.floor(Math.random() * facts.length)]
            setMindsetFact(randomFact)
            setLoadingFact(false)
        }, 800)
    }

    // LÓGICA DE INICIAL: Prioriza el Email
    const inicial = email ? email.charAt(0).toUpperCase() : (nombre ? nombre.charAt(0).toUpperCase() : "U")
    const idFormateado = id ? String(id).substring(0, 3) : "..."

    return (
        <>
            <style>{`
                .btn-hover-effect { transition: all 0.3s ease; }
                .btn-hover-effect:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .btn-logout:hover { background-color: #ef4444 !important; color: white !important; }
                .tab-btn { transition: all 0.2s ease; }
                .tab-btn:hover:not(.active-tab) { background-color: #e2e8f0 !important; }
            `}</style>

            <div className="container-fluid p-0" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", padding: "2rem 1rem" }}>
                <div className="container py-5" style={{ maxWidth: "1100px" }}> {/* Ancho aumentado */}
                    
                    <h2 className="fw-bold mb-4" style={{ color: "#1e3a8a", textShadow: "1px 1px 2px rgba(255,255,255,0.5)" }}>Mi Perfil</h2>

                    <div className="row g-4">
                        
                        {/* COLUMNA 1: Perfil (Izquierda) */}
                        <div className="col-12 col-lg-3">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
                                <div className="d-flex flex-column align-items-center text-center mb-4">
                                    <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "linear-gradient(135deg, #1e3a8a, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", color: "white", fontWeight: "bold", marginBottom: "1rem" }}>
                                        {inicial}
                                    </div>
                                    <h4 className="fw-bold mb-1">{nombre} {apellido}</h4>
                                    <p className="text-muted small">Estudiante</p>
                                </div>
                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase small mb-3 text-secondary">Tus Planes</h6>
                                    {planes && planes.length > 0 ? planes.map((p, i) => <span key={i} className="badge rounded-pill d-block mb-2 py-2" style={{ backgroundColor: "#e0f2fe", color: "#0369a1" }}>⭐ {p}</span>) : <p className="small text-muted">Sin planes.</p>}
                                </div>
                                <button className="btn btn-logout w-100 fw-bold mt-auto" style={{ backgroundColor: "#fef2f2", color: "#ef4444", borderRadius: "10px" }} onClick={handleLogout}>Cerrar sesión</button>
                            </div>
                        </div>

                        {/* COLUMNA 2: Ajustes (Centro) */}
                        <div className="col-12 col-lg-5">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
                                <div className="d-flex gap-2 mb-4">
                                    <button className={`btn tab-btn flex-grow-1 fw-bold ${seccionActiva === "resumen" ? "active-tab" : ""}`} style={{ borderRadius: "10px", backgroundColor: seccionActiva === "resumen" ? "#1e3a8a" : "#f1f5f9", color: seccionActiva === "resumen" ? "#fff" : "#475569" }} onClick={() => setSeccionActiva("resumen")}>Datos</button>
                                    <button className={`btn tab-btn flex-grow-1 fw-bold ${seccionActiva === "password" ? "active-tab" : ""}`} style={{ borderRadius: "10px", backgroundColor: seccionActiva === "password" ? "#1e3a8a" : "#f1f5f9", color: seccionActiva === "password" ? "#fff" : "#475569" }} onClick={() => setSeccionActiva("password")}>Seguridad</button>
                                </div>

                                {seccionActiva === "resumen" ? (
                                    <div className="d-flex flex-column gap-3">
                                        <div className="p-3 bg-light rounded-3">
                                            <small className="text-muted fw-bold d-block" style={{ fontSize: "10px" }}>EMAIL</small>
                                            <span className="fw-bold">{email}</span>
                                        </div>
                                        <div className="p-3 bg-light rounded-3">
                                            <small className="text-muted fw-bold d-block" style={{ fontSize: "10px" }}>ID</small>
                                            <span className="fw-bold font-monospace">{idFormateado}</span>
                                        </div>
                                    </div>
                                ) : (
                                    // ... lógica de contraseña (omitida para brevedad, igual a tu código original)
                                    <div>...</div> 
                                )}
                            </div>
                        </div>

                        {/* COLUMNA 3: Fact (Derecha) */}
                        <div className="col-12 col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", color: "white" }}>
                                <h5 className="fw-bold mb-4">🧠 Daily Mindset</h5>
                                {loadingFact ? <div className="spinner-border spinner-border-sm"></div> : <p className="fs-6 fst-italic lh-lg">{mindsetFact}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile