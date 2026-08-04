// Unit.jsx — Componente genérico para cualquier unidad
const actividadesMock = [
    { id: 1, type: "video", title: "Masterclass: Estrategias del Día", duration: "12 min" },
    { id: 2, type: "pdf", title: "Cambridge Interactive Canvas (Tu Sello)", duration: "25 min" },
    { id: 3, type: "audio", title: "Audio Drill: Pronunciación Nativa Sincronizada", duration: "15 min" },
    { id: 4, type: "quiz", title: "Mindset Check: Desafío de Retención", duration: "8 min" },
]

const Unit = ({ unidad, onVolver }) => {
    return (
        <div className="animate__animated animate__fadeInUp">
            <button className="btn-back mb-4" onClick={onVolver}>
                <i className="bi bi-chevron-left" /> Volver a las Unidades
            </button>

            <div className="glass-card p-4 p-md-5">
                <div className="border-bottom border-secondary border-opacity-20 pb-4 mb-4 text-center text-md-start">
                    <span className="text-cyan small fw-bold tracking-widest text-uppercase">
                        Entrenamiento Abierto
                    </span>
                    <h2 className="fw-black text-white m-0 text-uppercase tracking-wide" style={{ fontSize: "2.5rem" }}>
                        {unidad?.title} — {unidad?.subtitle}
                    </h2>
                    <p className="text-blue-200 m-0 mt-2">
                        Aquí se montará el set completo de actividades con el sello de English Mindset.
                    </p>
                </div>

                <div className="d-flex flex-column gap-3">
                    {actividadesMock.map((act) => (
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