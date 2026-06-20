import { Link } from "react-router-dom";

export const CardServicio = ({ img, name, features = [], price, onAgregar, id, category }) => {
  const isPlan = category?.toLowerCase().includes("plan") || category?.toLowerCase().includes("curso");
  const buttonLabel = isPlan ? "Inscribirme" : "Obtener Material";

  return (
    <div 
      className="h-100" 
      style={{ 
        position: "relative",
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.75) 100%), url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "28px", 
        minHeight: "440px", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
        overflow: "hidden",
        boxShadow: "none",
        border: "none",
        transition: "box-shadow 0.3s ease" // Eliminamos transform de la transición
      }}
      // Eliminamos el translate aquí para quitar el salto de la card
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 15px 30px rgba(15, 23, 42, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >

      {/* Contenedor flotante estilo Cristal */}
      <div
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          backgroundColor: "rgba(15, 23, 42, 0.75)", 
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "20px",
          padding: "1.15rem 1.3rem",
          margin: "0.6rem",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Categoría */}
        <span
          className="fw-bold text-uppercase mb-1 d-inline-block"
          style={{ color: "#38bdf8", letterSpacing: "1px", fontSize: "0.7rem" }}
        >
          {category}
        </span>

        {/* Título */}
        <h3 className="fw-bold mb-2 text-white" style={{ fontSize: "1.3rem", lineHeight: "1.3" }}>
          {name}
        </h3>

        {/* Bullets Horizontales */}
        <ul 
          className="list-unstyled mb-3 text-white-50" 
          style={{ 
            fontSize: "0.85rem", 
            lineHeight: "1.5", 
            width: "100%",
            display: "flex",
            flexWrap: "wrap",     
            columnGap: "16px",    
            rowGap: "6px",        
            padding: 0
          }}
        >
          {features.map((f, i) => (
            <li 
              key={i} 
              style={{ 
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap" 
              }}
            >
              <i className="bi bi-check2 text-info" style={{ fontSize: "0.95rem" }} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Línea horizontal eliminada (quitamos el borderTop) */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-2.5">
          <div>
            <span className="fw-bold fs-4 text-white">${price.toLocaleString()}</span>
            {isPlan && <span className="text-white-50" style={{ fontSize: "0.75rem" }}> / mes</span>}
          </div>

          <button
            onClick={onAgregar}
            className="btn btn-light px-4 py-2 fw-bold hover-jump-btn" // Agregamos la clase del salto
            style={{ 
              borderRadius: "50px", 
              fontSize: "1rem", // Botón más grande
              color: "#0f172a", 
              boxShadow: "0 4px 12px rgba(255,255,255,0.12)"
            }}
          >
            {buttonLabel} <i className="bi bi-arrow-right ms-1" />
          </button>
        </div>

      </div>
    </div>
  );
};