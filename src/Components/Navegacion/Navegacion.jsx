import { Link, useLocation } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useUser } from "../Context/UserContext";

export const Navegacion = () => {
  const { total } = useCart();
  const { token, logout, email } = useUser();
  const location = useLocation();

  const enlaces = [
    { label: "Home", path: "/" },
    { label: "Training Hub", path: "/traininghub" },
    { label: "Metodología", path: "/metodologia" },
    { label: "Planes", path: "/planes" },
    { label: "Contacto", path: "/contacto" },
  ];

  const esActivo = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path;
  };

  const estiloLink = (path) => ({
    textDecoration: "none",
    color: esActivo(path) ? "#1e3a8a" : "#475569",
    fontWeight: esActivo(path) ? "700" : "600",
    fontSize: "0.9rem",
    padding: "6px 12px",
    borderRadius: "8px",
    backgroundColor: esActivo(path) ? "rgba(30, 58, 138, 0.08)" : "transparent",
    borderBottom: esActivo(path) ? "2px solid #1e3a8a" : "2px solid transparent",
    transition: "all 0.25s ease",
    display: "inline-block",
    whiteSpace: "nowrap"
  });

  // Training Hub tiene estilo especial solo cuando NO está activo
  const estiloTrainingHub = () => ({
    textDecoration: "none",
    color: esActivo("/traininghub") ? "#ffffff" : "#1e3a8a",
    fontWeight: "800",
    fontSize: "0.9rem",
    padding: "7px 14px",
    borderRadius: "8px",
    background: esActivo("/traininghub")
      ? "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)"
      : "rgba(30, 58, 138, 0.06)",
    border: esActivo("/traininghub") ? "none" : "1px solid rgba(2, 132, 199, 0.25)",
    boxShadow: esActivo("/traininghub") ? "0 4px 14px rgba(30, 58, 138, 0.35)" : "none",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    whiteSpace: "nowrap"
  });

  return (
    <>
      <style>{`
        .nav-link-hover:hover {
          color: #1e3a8a !important;
          background-color: rgba(30, 58, 138, 0.05) !important;
        }
        .nav-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        /* MOBILE: < 600px */
        @media (max-width: 600px) {
          .nav-wrapper {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .nav-links {
            width: 100%;
            gap: 0.25rem;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 4px;
            scrollbar-width: none;
          }
          .nav-links::-webkit-scrollbar { display: none; }
          .nav-right {
            width: 100%;
            justify-content: flex-end;
          }
          .nav-email { display: none !important; }
        }
      `}</style>

      <nav style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        padding: "0.75rem 1.25rem",
        position: "sticky",
        top: 0,
        zIndex: 1030,
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)"
      }}>
        <div className="nav-wrapper">

          {/* LOGO */}
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(2,132,199,0.2)"
              }}>
                <span style={{ color: "#fff", fontWeight: "800", fontSize: "13px" }}>EM</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
                <span style={{ fontSize: "10px", fontWeight: "800", color: "#ef4444", letterSpacing: "3px", marginBottom: "1px" }}>
                  ENGLISH
                </span>
                <span style={{
                  fontSize: "1.4rem", fontWeight: "900",
                  background: "linear-gradient(135deg, #1e3a8a 30%, #0369a1 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px"
                }}>
                  MINDSET
                </span>
              </div>
            </div>
          </Link>

          {/* LINKS */}
          <div className="nav-links">
            {/* Home */}
            <Link to="/" className="nav-link-hover" style={estiloLink("/")}>
              Home
            </Link>

            {/* Training Hub — estilo especial */}
            <Link to="/traininghub" style={estiloTrainingHub()}>
              ⚡ Training Hub
            </Link>

            {/* Resto de enlaces */}
            {[
              { label: "Metodología", path: "/metodologia" },
              { label: "Planes", path: "/planes" },
              { label: "Contacto", path: "/contacto" },
            ].map(({ label, path }) => (
              <Link key={path} to={path} className="nav-link-hover" style={estiloLink(path)}>
                {label}
              </Link>
            ))}

            {/* Ingresar — solo sin token */}
            {!token && (
              <Link to="/login" className="nav-link-hover" style={estiloLink("/login")}>
                Ingresar
              </Link>
            )}
          </div>

          {/* DERECHA */}
          <div className="nav-right">
            {token && (
              <>
                <span className="nav-email small fw-semibold" style={{ color: "#475569", letterSpacing: "0.2px" }}>
                  Hi, <span style={{ color: "#1e3a8a" }}>{email?.split('@')[0]}</span>
                </span>

                <Link to="/profile" style={{ textDecoration: "none" }}>
                  <button style={{
                    border: "none",
                    color: "#ffffff",
                    borderRadius: "10px",
                    padding: "7px 16px",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    background: esActivo("/profile")
                      ? "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)"
                      : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                    boxShadow: "0 4px 10px rgba(2,132,199,0.2)",
                    transition: "all 0.25s ease",
                    display: "flex", alignItems: "center", gap: "5px"
                  }}>
                    👤 Mi Perfil
                  </button>
                </Link>

                <button
                  onClick={logout}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #cbd5e1",
                    color: "#64748b",
                    borderRadius: "10px",
                    padding: "7px 14px",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    whiteSpace: "nowrap"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#ef4444"
                    e.currentTarget.style.color = "#ef4444"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#cbd5e1"
                    e.currentTarget.style.color = "#64748b"
                  }}
                >
                  Salir
                </button>
              </>
            )}
          </div>

        </div>
      </nav>
    </>
  );
};