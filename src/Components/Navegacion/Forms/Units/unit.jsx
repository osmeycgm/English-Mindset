// Layout genérico — igual para todas las unidades
const Unit = ({ unidad, onVolver }) => {
    if (!unidad) return null

    return (
        <div className="animate__animated animate__fadeInUp">
            <button className="btn-back mb-4" onClick={onVolver}>
                <i className="bi bi-chevron-left" /> Volver a las Unidades
            </button>

            <div className="glass-card p-4 p-md-5">
                <div className="border-bottom border-secondary border-opacity-20 pb-4 mb-4 text-center text-md-start">
                    <span className="text-cyan small fw-bold text-uppercase">
                        Módulo 1 — Foundations
                    </span>
                    <h2 className="fw-black text-white m-0 text-uppercase" style={{ fontSize: "2rem" }}>
                        {unidad.title} — {unidad.subtitle}
                    </h2>
                    <p className="text-blue-200 m-0 mt-2">{unidad.duration}</p>
                </div>

                {/* ACTIVIDADES */}
                <div className="d-flex flex-column gap-3">
                    {unidad.actividades.map((act) => (
                        <div
                            key={act.id}
                            className="activity-strip d-flex align-items-center justify-content-between p-3"
                            onClick={() => alert(`Iniciando: ${act.title}`)}
                        >
                            <div className="d-flex align-items-center gap-3 text-truncate">
                                <div className={`activity-icon-box ${act.type}`}>
                                    <i className={`bi ${
                                        act.type === 'video' ? 'bi-play-fill' :
                                        act.type === 'pdf' ? 'bi-file-earmark-pdf' :
                                        act.type === 'audio' ? 'bi-headphones' :
                                        'bi-lightning-fill'
                                    }`} />
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
    )
}

export default Unit