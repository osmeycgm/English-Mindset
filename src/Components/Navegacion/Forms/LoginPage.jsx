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
    setConfirmar("");
  };

  return (
    <>
      <section className="formulario-section">
        <div className="formulario-overlay">
          <h2>Ingresa</h2>
          <form className="LoginPage" onSubmit={validarInput}>

            {mensaje && (
              <p
                style={{
                  color: tipo === "error" ? "red" : "green",
                  padding: "8px",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {mensaje}
              </p>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                name="email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="contraseña"
                className="form-control"
                onChange={(e) => setContraseña(e.target.value)}
                value={contraseña}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{margin: "10px"}}>
              Enviar
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
