import { Link, useLocation } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useUser } from "../Context/UserContext";

export const Navegacion = () => {
  const { total } = useCart();
  const { token, logout, email } = useUser();
  const location = useLocation();

  // Enlaces base de la academia (Se removió Training Hub de aquí para reubicarlo)
  const enlaces = [
    { label: "Metodología", path: "/metodologia" },
    { label: "Planes", path: "/planes" },
    { label: "Contacto", path: "/contacto" },
  ];

  // Estilo para los links estándar
  const obtenerEstiloLink = (path) => {
    const esActivo = location.pathname === path;
    return {
      textDecoration: "none",
      color: esActivo ? "#1e3a8a" : "#475569",
      fontWeight: esActivo ? "700" : "600",
      fontSize: "0.95rem",
      padding: "6px 14px",
      borderRadius: "8px",
      backgroundColor: esActivo ? "rgba(30, 58, 138, 0.06)" : "transparent",
      transition: "all 0.25s ease",
    };
  };

  // ESTILO PREMIUM HIGHLIGHT: Training Hub (Centro neurálgico de la app)
  const obtenerEstiloTrainingHub = () => {
    const esActivo = location.pathname === "/Training Hub";
    return {
      textDecoration: "none",
      background: esActivo
        ? "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)"
        : "linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(2, 132, 199, 0.05) 100%)",
      color: esActivo ? "#ffffff" : "#1e3a8a",
      fontWeight: "800",
      fontSize: "0.95rem",
      padding: "8px 16px",
      borderRadius: "8px",
      border: esActivo ? "none" : "1px solid rgba(2, 132, 199, 0.25)",
      boxShadow: esActivo
        ? "0 4px 14px rgba(30, 58, 138, 0.35)"
        : "0 2px 6px rgba(2, 132, 199, 0.05)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
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
          {/* Isotipo */}
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

        {/* ENLACE DESTACADO COMPLEMENTARIO (AL LADO DE HOME) */}
        <Link
          to="/Training Hub"
          style={obtenerEstiloTrainingHub()}
          onMouseEnter={e => {
            if (location.pathname !== "/Training Hub") {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(30, 58, 138, 0.15)";
            }
          }}
          onMouseLeave={e => {
            if (location.pathname !== "/Training Hub") {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          <span style={{ fontSize: "1rem" }}></span>
          <span>Training Hub</span>
        </Link>

        {/* Resto de enlaces tradicionales */}
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

        {/* LOGIN EN CASO DE NO TOKEN */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span className="small text-muted d-none d-lg-inline fw-semibold" style={{ letterSpacing: "0.2px" }}>
              Hi, <span style={{ color: "#1e3a8a" }}>{email.split('@')[0]}</span>
            </span>

            {/* BOTÓN MI PERFIL REDISEÑADO */}
            <Link to="/profile" style={{ textDecoration: "none" }}>
              <button
                style={{
                  ...profileBtnStyle,
                  background: location.pathname === "/profile"
                    ? "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)"
                    : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  boxShadow: location.pathname === "/profile"
                    ? "0 4px 12px rgba(30, 58, 138, 0.3)"
                    : "0 4px 10px rgba(2, 132, 199, 0.2)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.filter = "brightness(1.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                👤 Mi Perfil
              </button>
            </Link>

            {/* BOTÓN SALIR REDISEÑADO */}
            <button
              onClick={logout}
              style={logoutBtnStyle}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "rgba(239, 68, 110, 0.08)";
                e.currentTarget.style.borderColor = "#ef4444";
                e.currentTarget.style.color = "#ef4444";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.color = "#64748b";
              }}
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

// Estilos de soporte limpios
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
  border: "none",
  color: "#ffffff",
  borderRadius: "12px",
  padding: "7px 18px",
  fontWeight: "700",
  fontSize: "0.88rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  letterSpacing: "0.3px",
  transition: "all 0.25s ease"
};

const logoutBtnStyle = {
  backgroundColor: "transparent",
  border: "1px solid #cbd5e1",
  color: "#64748b",
  borderRadius: "12px",
  padding: "7px 16px",
  fontWeight: "700",
  fontSize: "0.88rem",
  cursor: "pointer",
  transition: "all 0.25s ease"
};