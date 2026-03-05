import { useState } from "react";

export const RegisterPage = () => {
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const validarInput = (e) => {
    e.preventDefault();

    if (!email.trim() || !contraseña.trim() || !confirmar.trim()) {
      setTipo("error");
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    if (contraseña.length < 6) {
      setTipo("error");
      setMensaje("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (contraseña !== confirmar) {
      setTipo("error");
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    setTipo("success");
    setMensaje("Cuenta registrada con éxito");
    setEmail("");
    setContraseña("");
    setConfirmar("");
  };

  return (
    <>
      <section className="formulario-section">
        <div className="formulario-overlay">
          <h2>Registrate</h2>
          <form className="RegisterPage" onSubmit={validarInput}>

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

            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmar"
                className="form-control"
                onChange={(e) => setConfirmar(e.target.value)}
                value={confirmar}
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

export default RegisterPage;
