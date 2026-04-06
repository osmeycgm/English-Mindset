import { useUser } from "../../Context/UserContext" 
import { useNavigate } from "react-router-dom"

export const Profile = () => {
  const { logout } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/") 
  }
  const usuario = {
    nombre: "Osmey Gonzalez",
    email: "osmey007@gmail.com",
    direccion: "Chiloé 1221, Santiago",
    telefono: "+56 9 2254 4751",
    fechaCreacion: "20 de Marzo, 2026",
    rol: "Cliente"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `
          radial-gradient(circle at 30% 20%, rgba(71, 68, 64, 0.6), transparent 40%),
          radial-gradient(circle at 60% 40%, rgba(180, 97, 2, 0.6), transparent 45%),
          linear-gradient(180deg, #eeb59f 0%, #ffffff 100%)
        `,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      <section style={{
        width: "25rem",
        padding: "2rem",
        margin: " 50px 20px 20px 50px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem"
      }}>

        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#1b45ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          marginBottom: "0.5rem"
        }}>
          👤
        </div>

        <h2 style={{ marginBottom: "1rem" }}>Mi Perfil</h2>

        {[
          { label: "Nombre", valor: usuario.nombre },
          { label: "Email", valor: usuario.email },
          { label: "Dirección", valor: usuario.direccion },
          { label: "Teléfono", valor: usuario.telefono },
          { label: "Miembro desde", valor: usuario.fechaCreacion },
          { label: "Rol", valor: usuario.rol },
        ].map(({ label, valor }) => (
          <div key={label} style={{
            width: "100%",
            padding: "8px 12px",
            borderBottom: "1px solid #dee2e6"
          }}>
            <small style={{ color: "#888", fontSize: "11px" }}>{label}</small>
            <p style={{ margin: 0, fontWeight: "500" }}>{valor}</p>
          </div>
        ))}
        <button
          className="btn btn-danger w-100"
          style={{ marginTop: "1.5rem" }}
          onClick={handleLogout} 
          >
          Cerrar sesión
        </button>

      </section>
    </div>
  );
};

export default Profile;