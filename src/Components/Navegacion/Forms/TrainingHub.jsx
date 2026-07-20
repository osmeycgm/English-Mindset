import { useState, useRef } from "react"
import { useUser } from "../../Context/UserContext" 
import { Link, useNavigate } from "react-router-dom" //

const TrainingHub = () => {
    const { token, user } = useUser() //
    const navigate = useNavigate() // 🔥 Instanciamos navigate para controlar la redirección

    // 💡 INTERRUPTOR DE ACCESO REAL: 
    // En producción esto debe ser: const tieneCursoPagado = user?.hasActivePlan || false;
    // Por ahora lo forzamos a 'true' para que puedas ver el mapa y programar.
    const tieneCursoPagado = true; //
    const linkGoogleMeet = "https://meet.google.com/abc-defg-hij"; //

    // ESTADOS DE NAVEGACIÓN (macro, micro, unit-detail, exam)
    const [vistaActual, setVistaActual] = useState("macro") //
    const [nivelSeleccionado, setNivelSeleccionado] = useState(null) //
    const [unidadSeleccionada, setUnidadSeleccionada] = useState(null) //

    // REF PARA EL CARRUSEL
    const carouselRef = useRef(null) //

    // ─── DATOS DE LOS NIVELES (AHORA CON STAGE 0 INCLUIDO) ────────────────
    const nivelesAcademicos = [
        { id: 0, name: "Stage 00: Mindset Assessment", duration: "30 Minutos", desc: "Test de nivelación interactivo. Descubre tu punto de partida exacto.", status: "active", isExam: true },
        { id: 1, name: "Stage 01: Foundations", duration: "4-6 Meses", desc: "Rompe la traducción mental y automatiza tus respuestas.", status: "active" },
        { id: 2, name: "Stage 02: Fluency Explorer", duration: "4-6 Meses", desc: "Adquiere agilidad comercial, debate y conecta ideas complejas.", status: "locked" },
        { id: 3, name: "Stage 03: Professional Mastery", duration: "4-6 Meses", desc: "Modismos avanzados, negociación y alta complejidad corporativa.", status: "locked" },
        { id: 4, name: "Stage 04: Native Expansion", duration: "4-6 Meses", desc: "Inmersión cultural absoluta a nivel C1/C2.", status: "locked" },
    ] //

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
    })) //

    const actividadesMock = [
        { id: 1, type: "video", title: "Masterclass: Estrategias del Día", duration: "12 min" },
        { id: 2, type: "pdf", title: "Cambridge Interactive Canvas (Tu Sello)", duration: "25 min" },
        { id: 3, type: "audio", title: "Audio Drill: Pronunciación Nativa Sincronizada", duration: "15 min" },
        { id: 4, type: "quiz", title: "Mindset Check: Desafío de Retención", duration: "8 min" },
    ] //

    const handleEntrarNivel = (nivel) => {
        if (nivel.status === "locked") return; //
        
        // Si es el examen de nivelación, lo enviamos a su vista dedicada
        if (nivel.isExam) {
            setVistaActual("exam"); //
            return; //
        }

        setNivelSeleccionado(nivel) //
        setVistaActual("micro") //
    }

    const handleEntrarUnidad = (unidad) => {
        setUnidadSeleccionada(unidad) //
        setVistaActual("unit-detail") //
    }

    // FUNCIÓN DE DESPLAZAMIENTO DEL CARRUSEL
    const scrollCarousel = (direction) => {
        if (carouselRef.current) { //
            const { current } = carouselRef; //
            const scrollAmount = direction === "left" ? -284 : 284; //
            current.scrollBy({ left: scrollAmount, behavior: "smooth" }); //
        }
    }

    // ─── CASO 1: INVITADO ──────────────────────────────────────────────────
   if (!token) {
    return (
        <div style={{
            minHeight: "100vh",
            background: "radial-gradient(circle at 50% 0%, #1e3a8a 0%, #0b1329 70%, #050a14 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px"
        }}>
            <div style={{
                background: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(56, 189, 248, 0.15)",
                borderRadius: "24px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                padding: "3rem",
                maxWidth: "36rem",
                width: "100%",
                textAlign: "center"
            }}>
                {/* Ícono */}
                <div style={{
                    width: "70px", height: "70px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 25px rgba(2,132,199,0.45)",
                    border: "1px solid rgba(56,189,248,0.2)",
                    margin: "0 auto 1.5rem auto"
                }}>
                    <i className="bi bi-rocket-takeoff" style={{ fontSize: "1.8rem", color: "#38bdf8" }} />
                </div>

                <h2 style={{ fontWeight: 900, color: "#ffffff", marginBottom: "1rem" }}>
                    Expande tus Capacidades
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "2rem", lineHeight: 1.7 }}>
                    Aquí podrás tener el contenido guía y de trabajo estratégico para tu viaje hacia el dominio definitivo del inglés. Inicia sesión para desbloquear tu mapa de entrenamiento.
                </p>

                {/* Botones */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link to="/login" style={{
                        padding: "12px 28px",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderRadius: "12px",
                        color: "#ffffff",
                        fontWeight: 700,
                        textDecoration: "none",
                        backgroundColor: "transparent",
                        transition: "0.3s"
                    }}>
                        Iniciar Sesión
                    </Link>
                    <Link to="/planes" style={{
                        padding: "12px 28px",
                        background: "linear-gradient(135deg, #2563eb 0%, #0284c7 100%)",
                        borderRadius: "12px",
                        color: "#ffffff",
                        fontWeight: 700,
                        textDecoration: "none",
                        border: "none",
                        boxShadow: "0 0 15px rgba(37,99,235,0.4)"
                    }}>
                        Comenzar mi Viaje
                    </Link>
                </div>
            </div>
        </div>
    )
}

    // ─── CASO 2: LOGGEADO SIN PLAN (AQUÍ ESTÁ EL BLOQUEO REAL) ─────────────
    if (token && !tieneCursoPagado) { //
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
        ) //
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
                            
                            {/* SVG Línea Curva Fina Conectora */}
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
                                const esPar = idx % 2 === 0; //
                                const estaBloqueado = nivel.status === "locked"; //
                                const isExam = nivel.isExam; //

                                return (
                                    <div 
                                        key={nivel.id}
                                        className={`d-flex w-100 justify-content-md-${esPar ? "start" : "end"} justify-content-center position-relative`}
                                        style={{ zIndex: 2 }}
                                    >
                                        <div 
                                            className={`island-node text-center p-4 ${estaBloqueado ? "locked-node" : "active-node"} ${isExam ? "exam-node" : ""}`}
                                            onClick={() => handleEntrarNivel(nivel)}
                                        >
                                            {/* Ícono especial si es examen */}
                                            {isExam && (
                                                <div className="position-absolute top-0 start-50 translate-middle bg-cyan rounded-circle p-2 shadow-glow" style={{ marginTop: "-10px" }}>
                                                    <i className="bi bi-controller fs-4 text-dark" />
                                                </div>
                                            )}

                                            <div className="node-badge" style={{ backgroundColor: isExam ? "#f59e0b" : "#0284c7" }}>{nivel.duration}</div>
                                            <h4 className={`fw-bold mb-2 ${isExam ? "text-warning" : "text-white"}`}>{nivel.name}</h4>
                                            <p className="text-blue-200 small m-0 px-2">{nivel.desc}</p>
                                            
                                            {!estaBloqueado ? (
                                                <div className="node-action mt-3 small fw-bold text-cyan">
                                                    {isExam ? "Iniciar Examen" : "Entrar a la Isla"} <i className="bi bi-arrow-right ms-1" />
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

                {/* 🎮 VISTA EXAMEN: STAGE 0 (ESTILO KAHOOT) */}
                {vistaActual === "exam" && (
                    <div className="animate__animated animate__fadeInUp position-relative py-4">
                        <button className="btn-back mb-4" onClick={() => setVistaActual("macro")}>
                            <i className="bi bi-chevron-left" /> Volver al Mapa
                        </button>

                        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
                            <div className="glass-card text-center p-5 w-100" style={{ maxWidth: "600px", borderTop: "4px solid #f59e0b" }}>
                                <i className="bi bi-controller mb-3 d-block text-warning" style={{ fontSize: "4rem", textShadow: "0 0 20px rgba(245,158,11,0.5)" }} />
                                <h2 className="fw-black text-white text-uppercase tracking-widest mb-2">Leveling Exam</h2>
                                <p className="text-blue-200 mb-5">
                                    Aquí montaremos la interfaz estilo Kahoot interactivo para evaluar tu nivel exacto. Asegúrate de tener audio activado y estar en un lugar tranquilo.
                                </p>
                                
                                {/* 🔥 Se cambió la alerta por navigate a la ruta correspondiente */}
                                <button 
                                    className="btn btn-warning fw-bold py-3 px-5 rounded-pill shadow-glow text-dark fs-5 w-100" 
                                    onClick={() => navigate("/testing0")}
                                >
                                    <i className="bi bi-play-fill me-2" /> Comenzar Test Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🎬 VISTA MICRO: CARRUSEL LATERAL ESTILO NETFLIX PREMIUM */}
                {vistaActual === "micro" && (
                    <div className="animate__animated animate__fadeIn">
                        <button className="btn-back mb-4" onClick={() => setVistaActual("macro")}>
                            <i className="bi bi-chevron-left" /> Volver al Mapa
                        </button>

                        {/* BANNER PRINCIPAL Y ACCESO A SALA VIRTUAL (GOOGLE MEET) */}
                        <div className="p-4 p-md-5 text-white rounded-3 mb-4 shadow" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)", position: "relative", overflow: "hidden" }}>
                            <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
                                <div className="col-12 col-lg-8 text-center text-lg-start">
                                    <span className="badge mb-2 px-3 py-1 rounded-pill" style={{ backgroundColor: "#0284c7" }}>Estás Entrenando</span>
                                    <h1 className="fw-bold mb-2">{nivelSeleccionado?.name}</h1>
                                    <p className="text-white-50 mb-0">Gestiona tus unidades de estudio autónomo de Cambridge abajo y asiste a tus clases presenciales sincronizadas.</p>
                                </div>
                                
                                {/* CAJA INTEGRADA DE GOOGLE MEET */}
                                <div className="col-12 col-lg-4 mt-4 mt-lg-0 text-center text-lg-end">
                                    <div className="p-3 rounded-3 bg-white bg-opacity-10 backdrop-blur" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
                                        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                                            <span className="position-relative d-flex h-3 w-3">
                                                <span className="animate-ping position-absolute inline-flex h-100 w-100 rounded-circle bg-danger opacity-75" style={{ width: "10px", height: "10px", top: "6px" }}></span>
                                                <span className="position-relative inline-flex rounded-circle bg-danger" style={{ width: "10px", height: "10px" }}></span>
                                            </span>
                                            <span className="small fw-bold text-uppercase tracking-wider text-white">Sala Virtual Activa</span>
                                        </div>
                                        <a 
                                            href={linkGoogleMeet} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn btn-success w-100 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 py-2"
                                            style={{ borderRadius: "10px" }}
                                        >
                                            <i className="bi bi-camera-video-fill" /> Entrar a Clase en Vivo
                                        </a>
                                        <span className="d-block text-white-50 mt-1" style={{ fontSize: "0.75rem" }}>Se abrirá en una nueva pestaña</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Slider Horizontal Estilo Netflix con Botones de Exploración */}
                        <div className="netflix-section">
                            <h3 className="fw-bold text-white mb-4 tracking-tight">
                                <i className="bi bi-grid-3x3-gap-fill me-2 text-cyan" /> Unidades Disponibles
                            </h3>
                            
                            <div className="position-relative">
                                {/* Flecha Izquierda */}
                                <button className="carousel-control left d-none d-md-flex" onClick={() => scrollCarousel('left')}>
                                    <i className="bi bi-chevron-left fs-4" />
                                </button>

                                <div className="netflix-row" ref={carouselRef}>
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

                                {/* Flecha Derecha */}
                                <button className="carousel-control right d-none d-md-flex" onClick={() => scrollCarousel('right')}>
                                    <i className="bi bi-chevron-right fs-4" />
                                </button>
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
                /* Fondo Base de la Marca */
                .aesthetic-bg {
                    background: radial-gradient(circle at 50% 0%, #1e3a8a 0%, #0b1329 70%, #050a14 100%);
                    min-height: 100vh;
                    font-family: 'Poppins', system-ui, -apple-system, sans-serif;
                    color: #ffffff;
                }

                .text-cyan { color: #38bdf8 !important; }
                .text-blue-200 { color: #cbd5e1 !important; }
                .fw-black { font-weight: 900; }
                .bg-cyan { background-color: #38bdf8 !important; }
                
                /* Clases Utilitarias para Banner Meet */
                .backdrop-blur { backdrop-filter: blur(12px); }
                @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
                .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
                .shadow-glow { box-shadow: 0 0 20px rgba(56, 189, 248, 0.5); }
                
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
                .exam-node {
                    border-color: rgba(245, 158, 11, 0.4);
                }
                .exam-node:hover {
                    border-color: #f59e0b;
                    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.25);
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

                /* 🎬 ESTRUCTURA NETFLIX CAROUSEL */
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
                    scroll-behavior: smooth;
                }
                .netflix-row::-webkit-scrollbar { display: none; }
                
                .netflix-card {
                    flex-shrink: 0;
                    width: 260px;
                    height: 380px;
                    background: #1e293b;
                    border-radius: 16px;
                    overflow: hidden;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                }
                
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
                    flex-direction: column;
                    justify-content: space-between;
                }
                .netflix-card-meta {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    display: block;
                    margin-top: 8px;
                }

                /* ◀️ ▶️ BOTONES DE CONTROL LATERAL (CARRUSEL) */
                .carousel-control {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 20;
                    background: rgba(15, 23, 42, 0.8);
                    border: 1px solid rgba(56, 189, 248, 0.3);
                    color: #ffffff;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(8px);
                }
                .carousel-control:hover {
                    background: rgba(56, 189, 248, 0.9);
                    border-color: #38bdf8;
                    transform: translateY(-50%) scale(1.15);
                    box-shadow: 0 10px 30px rgba(56, 189, 248, 0.4);
                }
                .carousel-control.left {
                    left: -20px;
                }
                .carousel-control.right {
                    right: -20px;
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
            `}</style>
        </div>
    )
}

export default TrainingHub