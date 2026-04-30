import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useUser } from "../Context/UserContext";

export const Navegacion = () => {
  const { total, delivery, delivery_fee } = useCart()
  const { token, logout } = useUser()

  return (
    <nav style={{
      backgroundColor: "#ffffff",
      borderBottom: "2px solid #f0f0f0",
      padding: "0.5rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "1rem",
      fontSize: "1rem",
      position: "sticky", 
      top: 0, 
      zIndex: 1030
    }}>

      {/* LOGO */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            fontSize: "3rem",
            fontWeight: "900",
            color: "#85084d",
            fontFamily: "Georgia, serif",
            letterSpacing: "-2px"
          }}>CLAUD</span>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#333", letterSpacing: "2px" }}>FIT</span>
          </div>
        </div>
      </Link>


      {/* LINKS CENTRALES (Login pasó aquí como Registrar) */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1.2rem",
        flexWrap: "wrap",
        fontSize: "1.1rem",
      }}>
         {/* Botón HOME con el estilo del antiguo Login */}
        <Link to="/">
          <button style={{
            backgroundColor: "#ffffff",
            border: "1px solid #aa0a62",
            color: "#302e2e",
            borderRadius: "10px",
            padding: "10px 28px",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow: "0 4px 5px rgba(233, 30, 140, 0.3)",
            transition: "transform 0.1s"
          }}
          onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >
            Home
          </button>
        </Link>
        {[
          { label: "Clases", path: "/clases" },
          { label: "Nutrición", path: "/nutricion" },
          { label: "Membresías", path: "/membresias" },
          { label: "Contacto", path: "/contacto" },
          // Aquí está Registrar tomando la posición del antiguo Ingresar
          { label: "Ingresar", path: "/login" }, 
        ].map(({ label, path }) => (
          <Link key={path} to={path} style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "600",
            fontSize: "1rem",
            transition: "color 0.2s"
          }}
            onMouseEnter={e => e.target.style.color = "#e91e8c"}
            onMouseLeave={e => e.target.style.color = "#333"}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* DERECHA — Carrito + Botón Home + Auth */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>

        {/* Carrito */}
        <Link to="/cart">
          <button style={{
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "#333",
            position: "relative"
          }}>
            🛒
            <span style={{
              fontSize: "0.8rem",
              color: "#e91e8c",
              fontWeight: "700",
              marginLeft: "4px"
            }}>
              ${total() + (delivery ? delivery_fee : 0)}
            </span>
          </button>
        </Link>

        {/* Botones de usuario loggeado (Perfil y Salir) */}
        {token && (
          <div style={{ display: "flex", gap: "8px" }}>
            <Link to="/profile">
              <button style={{
                backgroundColor: "transparent",
                border: "2px solid #e91e8c",
                color: "#e91e8c",
                borderRadius: "25px",
                padding: "8px 20px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "0.85rem"
              }}>
                Mi Perfil
              </button>
            </Link>
            <button
              onClick={logout}
              style={{
                backgroundColor: "transparent",
                border: "2px solid #ccc",
                color: "#666",
                borderRadius: "25px",
                padding: "8px 20px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "0.85rem"
              }}
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}