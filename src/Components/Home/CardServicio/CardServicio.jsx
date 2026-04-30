import { Link } from "react-router-dom";

export const CardServicio = ({ img, name, features = [], price, onAgregar, id, category }) => {
    const isSubscription = category.toLowerCase().includes("suscripción") || category.toLowerCase().includes("acompañado");
    const buttonLabel = isSubscription ? "Inscribirme" : "Obtener";

    return (
        <div className="card border-0 shadow-lg h-100" style={{ borderRadius: "20px", overflow: "hidden", backgroundColor: "#fff" }}>
            {/* Imagen un poco más pequeña (ajusté height a 200px) */}
            <div style={{ position: "relative", height: "200px" }}>
                <img src={img} className="w-100 h-100" alt={name} style={{ objectFit: "cover" }} />
                
                {/* Overlay con Gradiente Oscuro */}
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: "100%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 70%)",
                    display: "flex", flexDirection: "column", justifyContent: "flex-end", 
                    alignItems: "center", paddingBottom: "15px", textAlign: "center"
                }}>
                    <h3 className="text-white fw-bold text-uppercase m-0" style={{ fontSize: "1.2rem", letterSpacing: "1px" }}>
                        {name}
                    </h3>
                    {/* Badge sobre la imagen (Fondo blanco, texto negro) */}
                    <span className="badge mt-2 px-3 py-1" style={{ 
                        backgroundColor: "#fff", color: "#333", borderRadius: "10px", fontSize: "0.7rem", fontWeight: "700"
                    }}>
                        {category}
                    </span>
                </div>
            </div>

            {/* Cuerpo de la Card (Todo centrado) */}
            <div className="card-body d-flex flex-column align-items-center text-center p-4">
                <ul className="list-unstyled mb-3 text-muted" style={{ fontSize: "0.9rem", lineHeight: "1.8" }}>
                    {features.map((f, i) => (
                        <li key={i}>{f}</li>
                    ))}
                </ul>

                <p className="fw-bold mb-3" style={{ color: "#d63384", fontSize: "1.4rem" }}>
                    ${price.toLocaleString()}
                </p>

                <button 
                    onClick={onAgregar} 
                    className="btn w-100 fw-bold py-2 text-white" 
                    style={{ backgroundColor: "#d63384", borderRadius: "10px", border: "none", fontSize: "1rem" }}
                >
                    {buttonLabel}
                </button>
            </div>
        </div>
    );
};