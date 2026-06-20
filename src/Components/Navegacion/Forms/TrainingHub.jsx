import { useState } from "react"
import { useUser } from "../../Context/UserContext" 
import { Link } from "react-router-dom"

const TrainingHub = () => {
    const { token, user } = useUser()

    // SIMULACIÓN DE ACCESO (Cambiar a tu lógica real en producción)
    const tieneCursoPagado = token ? true : false; 
    const linkGoogleMeet = "https://meet.google.com/abc-defg-hij"; 

    // ESTADOS DE NAVEGACIÓN (macro, micro, unit-detail)
    const [vistaActual, setVistaActual] = useState("macro") 
    const [nivelSeleccionado, setNivelSeleccionado] = useState(null)
    const [unidadSeleccionada, setUnidadSeleccionada] = useState(null)

    // DATOS DE LOS 4 NIVELES
    const nivelesAcademicos = [
        { id: 1, name: "Stage 01: Foundations", duration: "4-6 Meses", desc: "Rompe la traducción mental y automatiza tus respuestas.", status: "active" },
        { id: 2, name: "Stage 02: Fluency Explorer", duration: "4-6 Meses", desc: "Adquiere agilidad comercial, debate y conecta ideas complejas.", status: "locked" },
        { id: 3, name: "Stage 03: Professional Mastery", duration: "4-6 Meses", desc: "Modismos avanzados, negociación y alta complejidad corporativa.", status: "locked" },
        { id: 4, name: "Stage 04: Native Expansion", duration: "4-6 Meses", desc: "Inmersión cultural absoluta a nivel C1/C2.", status: "locked" },
    ]

    // 16 UNIDADES ESTILO NETFLIX (Con imágenes ilustrativas abstractas)
    const unidadesMock = Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        title: `Unidad ${String(i + 1).padStart(2, '0')}`,
        subtitle: [
            "Mindset Tuning", "Breaking Ice", "Deep Dive", "Hadal Core", 
            "Speed Boost", "Natural Flow", "Clarity Lab", "Global Voice"
        ][i % 8],
        duration: "1 Semana de Inmersión",
        image: `https://images.unsplash.com/photo-${[
            "1618005182384-a83a8bd57fbe", "1634017839464-5c339ebe3cb4", 
            "1614741118887-7a4ee193a5fa", "1579783900882-c0d3dad7b119"
        ][i % 4]}?auto=format&fit=crop&w=600&q=80`
    }))

    const actividadesMock = [
        { id: 1, type: "video", title: "Masterclass: Estrategias del Día", duration: "12 min" },
        { id: 2, type: "pdf", title: "Cambridge Interactive Canvas (Tu Sello)", duration: "25 min" },
        { id: 3, type: "audio", title: "Audio Drill: Pronunciación Nativa Sincronizada", duration: "15 min" },
        { id: 4, type: "quiz", title: "Mindset Check: Desafío de Retención", duration: "8 min" },
    ]

    const handleEntrarNivel = (nivel) => {
        if (nivel.status === "locked") return;
        setNivelSeleccionado(nivel)
        setVistaActual("micro")
    }

    const handleEntrarUnidad = (unidad) => {
        setUnidadSeleccionada(unidad)
        setVistaActual("unit-detail")
    }

    // ─── CASO 1: INVITADO ──────────────────────────────────────────────────
    if (!token) {
        return (
            <div className="aesthetic-bg d-flex align-items-center justify-content-center p-4">
                <div className="glass-card text-center p-5" style={{ maxWidth: "34rem" }}>
                    <div className="glow-icon mb-4">
                        <i className="bi bi-rocket-takeoff text-cyan fs-1" />
                    </div>
                    <h2 className="fw-bold tracking-tight text-white mb-3">Expande tus Capacidades</h2>
                    <p className="text-blue-200 mb-4 lh-lg">
                        Aquí podrás tener el contenido guía y de trabajo estratégico para tu viaje hacia el dominio definitivo del inglés. Inicia sesión para desbloquear tu mapa.
                    </p>
                    <Link to="/cart" className="btn btn-neon w-100 py-3 fw-bold mb-3">
                        Comenzar mi Viaje
                    </Link>
                </div>
            </div>
        )
    }

    // ─── CASO 2: LOGGEADO SIN PLAN ─────────────────────────────────────────
    if (token && !tieneCursoPagado) {
        return (
            <div className="aesthetic-bg d-flex align-items-center justify-content-center p-4">
                <div className="glass-card text-center p-5" style={{ maxWidth: "34rem" }}>
                    <div className="glow-icon mb-4">
                        <i className="bi bi-compass text-warning fs-1" />
                    </div>
                    <h2 className="fw-bold text-white mb-2">¡Hola, {user?.name || "Explorer"}!</h2>
                    <p className="text-blue-200 mb-4 lh-lg">
                        No tienes ningún paquete o curso seleccionado. Inscríbete en uno de nuestros entrenamientos para activar tu acceso al Training Hub.
                    </p>
                    <Link to="/" className="btn btn-neon w-100 py-3 fw-bold">
                        Ver Programas Disponibles
                    </Link>
                </div>
            </div>
        )
    }

    // ─── CASO 3: ALUMNO ACTIVO ─────────────────────────────────────────────
    return (
        <div className="aesthetic-bg py-5">
            <div className="container" style={{ maxWidth: "1200px" }}>

                {/* 🗺️ VISTA MACRO: RUTA DEL MAPA DEL TESORO */}
                {vistaActual === "macro" && (
                    <div className="animate__animated animate__fadeIn position-relative py-4">
                        <div className="text-center mb-5">
                            <h1 className="fw-black tracking-widest text-white text-uppercase header-glow m-0">Training Hub</h1>
                            <p className="text-cyan small uppercase tracking-wider mt-2">Tu Mapa de Ruta y Expansión Lingüística</p>
                        </div>

                        {/* Contenedor del Mapa del Tesoro */}
                        <div className="position-relative d-flex flex-column align-items-center gap-5 my-5">
                            
                            {/* SVG Línea Curva Fina Conectora (Estilo Mapa del Tesoro) */}
                            <svg className="d-none d-md-block position-absolute w-100 h-100" style={{ top: 0, left: 0, pointerEvents: "none", zIndex: 0 }}>
                                <path 
                                    d="M 600, 50 Q 250, 180 600, 320 T 600, 600 T 600, 880" 
                                    fill="none" 
                                    stroke="#38bdf8" 
                                    strokeWidth="2" 
                                    strokeDasharray="8,8" 
                                    opacity="0.4"
                                />
                            </svg>

                            {nivelesAcademicos.map((nivel, idx) => {
                                const esPar = idx % 2 === 0;
                                const estaBloqueado = nivel.status === "locked";

                                return (
                                    <div 
                                        key={nivel.id}
                                        className={`d-flex w-100 justify-content-md-${esPar ? "start" : "end"} justify-content-center position-relative`}
                                        style={{ zIndex: 2 }}
                                    >
                                        <div 
                                            className={`island-node text-center p-4 ${estaBloqueado ? "locked-node" : "active-node"}`}
                                            onClick={() => handleEntrarNivel(nivel)}
                                        >
                                            <div className="node-badge">{nivel.duration}</div>
                                            <h4 className="fw-bold text-white mb-2">{nivel.name}</h4>
                                            <p className="text-blue-200 small m-0 px-2">{nivel.desc}</p>
                                            
                                            {!estaBloqueado ? (
                                                <div className="node-action mt-3 small fw-bold text-cyan">
                                                    Entrar a la Isla <i className="bi bi-arrow-right ms-1" />
                                                </div>
                                            ) : (
                                                <div className="mt-3 text-muted small">
                                                    <i className="bi bi-lock-fill me-1" /> Bloqueado
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* 🎬 VISTA MICRO: CARRUSEL LATERAL ESTILO NETFLIX PREMIUM */}
                {vistaActual === "micro" && (
                    <div className="animate__animated animate__fadeIn">
                        <button className="btn-back mb-4" onClick={() => setVistaActual("macro")}>
                            <i className="bi bi-chevron-left" /> Volver al Mapa
                        </button>

                        {/* Banner de Bienvenida Premium */}
                        <div className="glass-banner p-4 p-md-5 mb-5 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
                            <div>
                                <span className="badge-pill mb-2">Stage Activo</span>
                                <h1 className="fw-bold text-white m-0">{nivelSeleccionado?.name}</h1>
                                <p className="text-blue-200 m-0 mt-1">Selecciona una unidad expansiva para desplegar el contenido de trabajo interactivo.</p>
                            </div>

                            {/* Acceso Integrado a Sala Virtual */}
                            <div className="meet-widget p-3 text-center">
                                <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                                    <span className="live-dot" />
                                    <span className="small text-white tracking-widest fw-bold">SALA VIRTUAL DISPONIBLE</span>
                                </div>
                                <a href={linkGoogleMeet} target="_blank" rel="noopener noreferrer" className="btn btn-meet">
                                    <i className="bi bi-camera-video-fill me-2" /> Unirse a Clase Live
                                </a>
                            </div>
                        </div>

                        {/* Slider Horizontal Estilo Netflix */}
                        <div className="netflix-section">
                            <h3 className="fw-bold text-white mb-4 tracking-tight">
                                <i className="bi bi-grid-3x3-gap-fill me-2 text-cyan" /> Unidades Disponibles
                            </h3>
                            
                            <div className="netflix-row">
                                {unidadesMock.map((unidad) => (
                                    <div 
                                        key={unidad.id} 
                                        className="netflix-card"
                                        onClick={() => handleEntrarUnidad(unidad)}
                                    >
                                        <div className="netflix-card-img-wrapper">
                                            <img src={unidad.image} alt={unidad.title} className="netflix-card-img" />
                                            <div className="netflix-card-overlay" />
                                        </div>
                                        <div className="netflix-card-body">
                                            <h4 className="fw-black text-white m-0">{unidad.title}</h4>
                                            <p className="text-cyan text-uppercase fw-bold tracking-wider m-0 small">{unidad.subtitle}</p>
                                            <span className="netflix-card-meta">{unidad.duration}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 📖 VISTA DETALLE: ESPACIO COMPLETO DE LA UNIDAD SELECCIONADA */}
                {vistaActual === "unit-detail" && (
                    <div className="animate__animated animate__fadeInUp">
                        <button className="btn-back mb-4" onClick={() => setVistaActual("micro")}>
                            <i className="bi bi-chevron-left" /> Volver a las Unidades
                        </button>

                        <div className="glass-card p-4 p-md-5">
                            <div className="border-bottom border-secondary border-opacity-20 pb-4 mb-4 text-center text-md-start">
                                <span className="text-cyan small fw-bold tracking-widest text-uppercase">Entrenamiento Abierto</span>
                                <h2 className="fw-black text-white m-0 text-uppercase tracking-wide" style={{ fontSize: "2.5rem" }}>
                                    {unidadSeleccionada?.title} — {unidadSeleccionada?.subtitle}
                                </h2>
                                <p className="text-blue-200 m-0 mt-2">Aquí se montará el set completo de actividades con el sello de English Mindset.</p>
                            </div>

                            {/* Lista de Trabajo Interno */}
                            <div className="d-flex flex-column gap-3">
                                {actividadesMock.map((act) => (
                                    <div 
                                        key={act.id} 
                                        className="activity-strip d-flex align-items-center justify-content-between p-3"
                                        onClick={() => alert(`Iniciando panel táctico interactivo para: ${act.title}`)}
                                    >
                                        <div className="d-flex align-items-center gap-3 text-truncate">
                                            <div className={`activity-icon-box ${act.type}`}>
                                                <i className={`bi ${act.type === 'video' ? 'bi-play-fill' : act.type === 'pdf' ? 'bi-file-earmark-pdf' : act.type === 'audio' ? 'bi-headphones' : 'bi-lightning-fill'}`} />
                                            </div>
                                            <span className="text-white fw-semibold text-truncate small">{act.title}</span>
                                        </div>
                                        <span className="badge bg-dark bg-opacity-40 text-blue-200 border border-secondary border-opacity-20 px-3 py-2 rounded-pill small">
                                            {act.duration}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* ─── INYECCIÓN DE ESTILOS CSS AESTHETIC — NO TOCAR ──────────────────── */}
            <style>{`
                /* Fondo Base de la Marca (Inspirado en el header de image_2cfe82.jpg) */
                .aesthetic-bg {
                    background: radial-gradient(circle at 50% 0%, #1e3a8a 0%, #0b1329 70%, #050a14 100%);
                    min-height: 100vh;
                    font-family: 'Poppins', system-ui, -apple-system, sans-serif;
                    color: #ffffff;
                }

                .text-cyan { color: #38bdf8 !important; }
                .text-blue-200 { color: #cbd5e1 !important; }
                .fw-black { font-weight: 900; }
                
                /* Estilo de Tarjetas de Cristal (Glassmorphism) */
                .glass-card {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(56, 189, 248, 0.15);
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                }

                /* Botones de Neón */
                .btn-neon {
                    background: linear-gradient(135deg, #2563eb 0%, #0284c7 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);
                    transition: 0.3s;
                }
                .btn-neon:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 25px rgba(56, 189, 248, 0.7);
                    color: white;
                }

                /* Nodos del Mapa del Tesoro */
                .island-node {
                    background: rgba(30, 41, 59, 0.7);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    width: 320px;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                }
                .active-node:hover {
                    transform: scale(1.06) translateY(-5px);
                    border-color: #38bdf8;
                    box-shadow: 0 10px 30px rgba(56, 189, 248, 0.25);
                }
                .locked-node {
                    opacity: 0.4;
                    cursor: not-allowed;
                    background: rgba(15, 23, 42, 0.8);
                }
                .node-badge {
                    position: absolute;
                    top: -12px;
                    left: 20px;
                    background: #0284c7;
                    padding: 2px 12px;
                    font-size: 0.75rem;
                    border-radius: 20px;
                    font-weight: bold;
                }

                /* Banner Microventana */
                .glass-banner {
                    background: linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
                    backdrop-filter: blur(12px);
                    border-radius: 20px;
                    border: 1px solid rgba(56, 189, 248, 0.1);
                }
                .badge-pill {
                    background: rgba(56, 189, 248, 0.2);
                    color: #38bdf8;
                    padding: 4px 12px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: bold;
                    display: inline-block;
                }

                /* Widget Google Meet */
                .meet-widget {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 14px;
                    min-width: 240px;
                }
                .btn-meet {
                    background: #10b981;
                    color: white;
                    font-weight: bold;
                    border-radius: 8px;
                    width: 100%;
                    transition: 0.2s;
                }
                .btn-meet:hover { background: #059669; color: white; }
                .live-dot {
                    width: 8px;
                    height: 8px;
                    background-color: #ef4444;
                    border-radius: 50%;
                    display: inline-block;
                    animation: blink 1.5s infinite;
                }

                /* 🎬 ESTRUCTURA NETFLIX CAROUSEL (MÁS GRANDE Y VERTICAL) */
                .netflix-section {
                    position: relative;
                    padding: 10px 0;
                }
                .netflix-row {
                    display: flex;
                    gap: 24px;
                    overflow-x: auto;
                    padding-bottom: 25px;
                    padding-top: 10px;
                    scrollbar-width: none;
                }
                .netflix-row::-webkit-scrollbar { display: none; }
                
                .netflix-card {
                    flex-shrink: 0;
                    width: 260px; /* Tamaño de tarjeta más grande vertical */
                    height: 380px;
                    background: #1e293b;
                    border-radius: 16px;
                    overflow: hidden;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                }
                
                /* Animación Expandible Estilo Netflix */
                .netflix-card:hover {
                    transform: scale(1.06) translateY(-8px);
                    box-shadow: 0 20px 35px rgba(56, 189, 248, 0.35);
                    z-index: 10;
                }
                
                .netflix-card-img-wrapper {
                    width: 100%;
                    height: 65%;
                    position: relative;
                    overflow: hidden;
                }
                .netflix-card-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                .netflix-card:hover .netflix-card-img {
                    transform: scale(1.1);
                }
                .netflix-card-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to bottom, transparent 40%, #1e293b 100%);
                }
                .netflix-card-body {
                    padding: 16px;
                    height: 35%;
                    display: flex;
                    flex-column;
                    justify-content: space-between;
                }
                .netflix-card-meta {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    display: block;
                    margin-top: 8px;
                }

                /* Tiras de Actividades Internas */
                .activity-strip {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 14px;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .activity-strip:hover {
                    background: rgba(56, 189, 248, 0.08);
                    border-color: rgba(56, 189, 248, 0.3);
                    transform: translateX(4px);
                }
                .activity-icon-box {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                }
                .activity-icon-box.video { background: rgba(37, 99, 235, 0.2); color: #38bdf8; }
                .activity-icon-box.pdf { background: rgba(239, 68, 68, 0.2); color: #f87171; }
                .activity-icon-box.audio { background: rgba(16, 185, 129, 0.2); color: #34d399; }
                .activity-icon-box.quiz { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }

                /* Botones de Regresar */
                .btn-back {
                    background: transparent;
                    color: #94a3b8;
                    border: none;
                    font-weight: bold;
                    transition: 0.2s;
                }
                .btn-back:hover { color: #ffffff; transform: translateX(-2px); }

                @keyframes blink {
                    0% { opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { opacity: 0.3; }
                }
            `}</style>
        </div>
    )
}

export default TrainingHub