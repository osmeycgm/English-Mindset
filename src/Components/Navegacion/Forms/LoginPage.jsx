import { useState } from "react";

export const LoginPage = () => {
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");

  const validarInput = (e) => {
    e.preventDefault();

    if (!email.trim() || !contraseña.trim()) {
      setTipo("error");
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    if (contraseña.length < 6) {
      setTipo("error");
      setMensaje("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setTipo("success");
    setMensaje("Ingresaste correctamente!");
    setEmail("");
    setContraseña("");
 
  };

  return (
    <div 
      className="loginPage" 
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
        margin: "50px auto auto auto", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "10px", 
        border: "1px solid #ccc", 
        borderRadius: "8px", 
        backgroundColor: "#f8f9fa"
      }}>
        <div style={{ alignItems: "center", textAlign: "center"}}>
          <h2>Ingresa</h2>
          <form onSubmit={validarInput}>
            {mensaje && (
              <p style={{ color: tipo === "error" ? "red" : "green", padding: "8px", textAlign: "center" }}>
                {mensaje}
              </p>
            )}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setContraseña(e.target.value)}
                value={contraseña}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ margin: "10px" }}>
              Enviar
            </button>
          </form>
        </div>
      </section>
    </div>        
  );
};

export default LoginPage;