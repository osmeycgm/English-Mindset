import { useState } from "react"
import { Link } from "react-router-dom"
// IMPORTACIÓN DE LOS DATOS CENTRALIZADOS
import { timelineMethods, goalsData } from "../../../servicios"

const Metodologia = () => {
    // Estado para manejar la línea de tiempo (ordenada cronológicamente de antiguo a moderno)
    const [currentStep, setCurrentStep] = useState(0)
    
    // Estado para el simulador de metas
    const [selectedGoal, setSelectedGoal] = useState(null)

    const currentMethod = timelineMethods[currentStep]

    return (
        <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "60px 20px" }}>
            <div className="container" style={{ maxWidth: "76rem" }}>
                
                {/* ENCABEZADO */}
                <div className="text-center mb-5">
                    <h1 className="fw-bold mb-2" style={{ color: "#1e3a8a", letterSpacing: "-1px" }}>Métodos de aprendizaje de un idioma</h1>
                    <p className="text-muted mx-auto" style={{ maxWidth: "45rem", fontSize: "0.95rem" }}>
                        Explora los enfoques de la enseñanza del idioma de forma cronologica y descubre cuál es el que mejor se adapta a tu estilo de aprendizaje y objetivos. Desde los métodos tradicionales hasta las estrategias más innovadoras se integran en un solo lugar para que puedas tomar una decisión informada sobre tu camino hacia tu expansión lingüística.
                    </p>
                </div>

                {/* CONTENEDOR 1: LÍNEA DE TIEMPO INTERACTIVA */}
                <div className="card shadow-sm border-0 rounded-4 p-4 mb-5" style={{ backgroundColor: "#ffffff" }}>
                    
                    {/* BARRA DE NAVEGACIÓN HORIZONTAL DE LA LÍNEA DE TIEMPO */}
                    <div className="position-relative mb-5 pt-3 d-flex justify-content-between align-items-center" style={{ overflowX: "auto" }}>
                        <div className="position-absolute start-0 end-0 bg-light" style={{ height: "4px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }} />
                        
                        {timelineMethods.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentStep(index)}
                                className="btn position-relative d-flex flex-column align-items-center border-0 p-0"
                                style={{ zIndex: 2, minWidth: "120px", background: "none" }}
                            >
                                <div 
                                    className="d-flex align-items-center justify-content-center border"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "50%",
                                        backgroundColor: currentStep === index ? item.color : "#ffffff",
                                        borderColor: currentStep === index ? item.color : "#cbd5e1",
                                        color: currentStep === index ? "#ffffff" : "#64748b",
                                        transition: "all 0.25s ease",
                                        boxShadow: currentStep === index ? `0 0 12px ${item.color}40` : "none"
                                    }}
                                >
                                    <i className={`bi ${item.icon}`} />
                                </div>
                                <span className="fw-bold mt-2 d-block text-dark" style={{ fontSize: "0.75rem" }}>{item.short}</span>
                            </button>
                        ))}
                    </div>

                    {/* PANTALLA ESPEJO (MITO VS REALIDAD) */}
                    <div className="rounded-4 p-4" style={{ backgroundColor: "#fdfdfd", border: "1px solid #e2e8f0" }}>
                        <div className="d-md-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                            <div>
                                <span className="badge mb-1 text-white text-uppercase" style={{ backgroundColor: currentMethod.color, fontSize: "0.65rem" }}>
                                    {currentMethod.badge}
                                </span>
                                <h3 className="fw-bold h4 m-0 text-dark">{currentMethod.name}</h3>
                            </div>
                            
                            <div className="d-flex gap-4 mt-3 mt-md-0">
                                <div className="text-center">
                                    <span className="text-muted d-block small" style={{ fontSize: "0.7rem" }}>Presencia Escolar</span>
                                    <span className="fw-bold h5 text-secondary">{currentMethod.popularity}%</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-muted d-block small" style={{ fontSize: "0.7rem" }}>Efectividad Oral</span>
                                    <span className="fw-bold h5" style={{ color: currentMethod.color }}>{currentMethod.effectiveness}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="row g-4">
                            <div className="col-12 col-md-6">
                                <div className="p-3 rounded-3 h-100" style={{ backgroundColor: "#f8fafc", borderLeft: "3px solid #64748b" }}>
                                    <h5 className="fw-bold text-dark h6 mb-2">⚙️ Enfoque Técnico y Dinámica:</h5>
                                    <p className="text-muted small mb-0" style={{ lineHeight: "1.5" }}>{currentMethod.focus}</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="p-3 rounded-3 h-100" style={{ backgroundColor: `${currentMethod.color}08`, borderLeft: `3px solid ${currentMethod.color}` }}>
                                    <h5 className="fw-bold h6 mb-2" style={{ color: currentMethod.color }}>🧠 Respuesta a Nivel Neurológico:</h5>
                                    <p className="text-secondary small mb-0" style={{ lineHeight: "1.5" }}>{currentMethod.neuroscience}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENEDOR 2: SIMULADOR DE METAS */}
                <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5" style={{ backgroundColor: "#ffffff" }}>
                    <div className="mb-4">
                        <h3 className="fw-bold h5 text-dark m-0">
                            <i className="bi bi-patch-question-fill me-2 text-primary" /> Simulador: Encuentra tu Estrategia Ideal
                        </h3>
                        <p className="text-muted small mt-1">Selecciona tu meta principal de aprendizaje para desplegar el peso porcentual exacto de tu mapa de ruta.</p>
                    </div>

                    <div className="row g-4">
                        {/* Selector de Metas (Izquierda) */}
                        <div className="col-12 col-md-5 d-flex flex-column gap-2">
                            {goalsData.map((goal) => (
                                <div 
                                    key={goal.id}
                                    className="p-3 rounded-3 text-start"
                                    style={{
                                        backgroundColor: selectedGoal?.id === goal.id ? "#e0f2fe" : "#f8fafc",
                                        border: "2px solid",
                                        borderColor: selectedGoal?.id === goal.id ? "#0284c7" : "#e2e8f0",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                    onClick={() => setSelectedGoal(goal)}
                                >
                                    <span className="fw-bold text-dark d-block" style={{ fontSize: "0.88rem" }}>{goal.title}</span>
                                </div>
                            ))}
                        </div>

                        {/* Panel de Diagnóstico por Barras (Derecha) */}
                        <div className="col-12 col-md-7">
                            {selectedGoal ? (
                                <div className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: "#fafafa", border: "1px solid #e2e8f0" }}>
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="badge bg-dark px-2.5 py-1.5" style={{ fontSize: "0.7rem" }}>Mix de Ingeniería Educativa</span>
                                            <span className="text-muted small italic" style={{ fontSize: "0.75rem" }}>Total: 100% Eficiencia</span>
                                        </div>
                                        
                                        <div className="mb-3 bg-white p-3 rounded-3 border-start border-3 border-danger mb-4">
                                            <span className="text-muted d-block small fw-bold" style={{ fontSize: "0.7rem" }}>Tu Obstáculo Crítico:</span>
                                            <p className="text-dark small mb-0 fw-medium">"{selectedGoal.problem}"</p>
                                        </div>

                                        {/* BARRAS DE PORCENTAJE DINÁMICAS */}
                                        <div className="d-flex flex-column gap-3 mb-4">
                                            {selectedGoal.metrics.map((metric, idx) => (
                                                <div key={idx}>
                                                    <div className="d-flex justify-content-between align-items-baseline mb-1">
                                                        <span className="text-secondary fw-semibold" style={{ fontSize: "0.8rem" }}>{metric.label}</span>
                                                        <span className="fw-bold small" style={{ color: metric.color }}>{metric.value}%</span>
                                                    </div>
                                                    <div className="progress" style={{ height: "8px", backgroundColor: "#e2e8f0", borderRadius: "20px" }}>
                                                        <div 
                                                            className="progress-bar progress-bar-striped progress-bar-animated" 
                                                            role="progressbar" 
                                                            style={{ 
                                                                width: `${metric.value}%`, 
                                                                backgroundColor: metric.color,
                                                                borderRadius: "20px",
                                                                transition: "width 0.5s ease-in-out"
                                                            }} 
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-3 rounded-3" style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                                            <span className="text-success d-block small fw-bold" style={{ fontSize: "0.75rem" }}>📌 Estrategia de Implementación English Mindset:</span>
                                            <p className="text-muted small mb-0" style={{ lineHeight: "1.4" }}>{selectedGoal.howWeSolve}</p>
                                        </div>
                                    </div>

                                    {/* 💡 REDIRECCIÓN MODIFICADA AQUÍ A /planes */}
                                    <div className="mt-4 pt-2 text-end">
                                        <Link to="/planes" className="btn btn-sm text-white fw-bold px-3 py-2 w-100 w-md-auto" style={{ backgroundColor: "#1e3a8a", borderRadius: "6px", fontSize: "0.8rem" }}>
                                            Iniciar el viaje →
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-4 rounded-4 border-2 border-dashed" style={{ backgroundColor: "#fafafa", borderColor: "#cbd5e1" }}>
                                    <i className="bi bi-pie-chart text-muted mb-2 fs-3 d-none d-md-block" />
                                    <p className="text-muted small mb-0 px-4">Selecciona un objetivo estratégico a la izquierda para calcular el balance de métodos interactivos en tiempo real.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Metodologia;