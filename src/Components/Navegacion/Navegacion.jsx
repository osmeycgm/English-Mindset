import { Link, useLocation } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useUser } from "../Context/UserContext";

export const Navegacion = () => {
  const { total } = useCart(); 
  const { token, logout, email } = useUser();
  const location = useLocation();

  // Enlaces base de la academia
  const enlaces = [
    { label: "Metodología", path: "/metodologia" },
    { label: "Planes", path: "/planes" },
    { label: "Training Hub", path: "/Training Hub" },
    { label: "Contacto", path: "/contacto" },
  ];

  // Función auxiliar para calcular el estilo de los links estándar
  const obtenerEstiloLink = (path) => {
    const esActivo = location.pathname === path;
    return {
      textDecoration: "none",
      color: esActivo ? "#1e3a8a" : "#475569",
      fontWeight: esActivo ? "700" : "600",
      fontSize: "0.95rem",
      padding: "6px 12px",
      borderRadius: "8px",
      backgroundColor: esActivo ? "rgba(30, 58, 138, 0.06)" : "transparent",
      transition: "all 0.25s ease",
    };
  };

  return (
    <nav style={{
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #f1f5f9",
      padding: "0.75rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "1rem",
      position: "sticky", 
      top: 0, 
      zIndex: 1030,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
    }}>

      {/* LOGO REDISEÑADO STYLE PRO */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          
          {/* Isotipo / Emblema */}
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(2, 132, 199, 0.2)"
          }}>
            <span style={{ color: "#fff", fontWeight: "800", fontSize: "13px", letterSpacing: "0.5px" }}>EM</span>
          </div>

          {/* Textos del Logo tipográfico */}
          <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
            <span style={{ 
              fontSize: "10px", 
              fontWeight: "800", 
              color: "#ef4444", 
              letterSpacing: "3px",
              marginBottom: "1px"
            }}>
              ENGLISH
            </span>
            <span style={{
              fontSize: "1.6rem", 
              fontWeight: "900", 
              background: "linear-gradient(135deg, #1e3a8a 30%, #0369a1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Inter', sans-serif", 
              letterSpacing: "-0.5px"
            }}>
              MINDSET
            </span>
          </div>
        </div>
      </Link>

      {/* LINKS CENTRALES */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link to="/">
          <button style={btnHomeStyle}>Home</button>
        </Link>
        
        {enlaces.map(({ label, path }) => (
          <Link 
            key={path} 
            to={path} 
            style={obtenerEstiloLink(path)}
            onMouseEnter={e => {
              if (location.pathname !== path) e.target.style.color = "#1e3a8a";
            }}
            onMouseLeave={e => {
              if (location.pathname !== path) e.target.style.color = "#475569";
            }}
          >
            {label}
          </Link>
        ))}

        {/* LOGIN */}
        {!token && (
          <Link 
            to="/login" 
            style={obtenerEstiloLink("/login")}
            onMouseEnter={e => {
              if (location.pathname !== "/login") e.target.style.color = "#1e3a8a";
            }}
            onMouseLeave={e => {
              if (location.pathname !== "/login") e.target.style.color = "#475569";
            }}
          >
            Ingresar
          </Link>
        )}
      </div>

      {/* DERECHA — Perfil / Salir */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {token && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="small text-muted d-none d-lg-inline fw-medium">
              Hi, {email.split('@')[0]}
            </span>
            
            <Link to="/profile">
              <button style={{
                ...profileBtnStyle,
                backgroundColor: location.pathname === "/profile" ? "#0284c7" : "transparent",
                color: location.pathname === "/profile" ? "#ffffff" : "#0284c7"
              }}>
                Mi Perfil
              </button>
            </Link>
            
            <button onClick={logout} style={logoutBtnStyle}>Salir</button>
          </div>
        )}
      </div>
    </nav>
  );
};

const btnHomeStyle = { 
  backgroundColor: "#fff", 
  border: "1px solid #e2e8f0", 
  color: "#334155", 
  borderRadius: "8px", 
  padding: "6px 14px", 
  fontWeight: "600",
  fontSize: "0.95rem",
  cursor: "pointer",
  transition: "all 0.2s"
};

const profileBtnStyle = { 
  border: "2px solid #0284c7", 
  borderRadius: "20px", 
  padding: "6px 16px", 
  fontWeight: "700", 
  fontSize: "0.85rem", 
  cursor: "pointer",
  transition: "all 0.25s ease"
};

const logoutBtnStyle = { 
  backgroundColor: "transparent", 
  border: "2px solid #cbd5e1", 
  color: "#64748b", 
  borderRadius: "20px", 
  padding: "6px 15px", 
  fontWeight: "700", 
  fontSize: "0.85rem", 
  cursor: "pointer",
  transition: "all 0.2s"
};