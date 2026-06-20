import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom"

export const ContactoPage = () => {
    const { email, token } = useUser();
    const phoneNumber = "56922544751"; // Tu número real
    
    // Si el usuario está logueado, personalizamos el mensaje con su correo
    const userIdent = token ? `Soy el usuario ${email}` : "Soy un nuevo interesado";
    const message = encodeURIComponent(`¡Hola ClaudFit! ${userIdent}. Me gustaría recibir información sobre los planes.`);

    return (
        <div className="container py-5 mt-5 text-center mensaje-animado">
            <div className="mx-auto shadow-lg p-5 bg-white rounded-5" style={{ maxWidth: "600px", borderTop: "5px solid #d63384" }}>
                <div style={{ width: "80px", height: "80px", backgroundColor: "#eafaf1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <i className="bi bi-whatsapp" style={{ fontSize: "2.5rem", color: "#25D366" }}></i>
                </div>
                <h2 className="fw-bold">¿Hablamos?</h2>
                <p className="text-muted mb-4">
                    Haz clic abajo para resolver tus dudas por WhatsApp. 
                    {token && <span className="d-block mt-2 fw-bold text-dark">Te identificaremos automáticamente como {email}</span>}
                </p>
                
                <a 
                    href={`https://wa.me/${phoneNumber}?text=${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-lg text-white px-5 py-3 fw-bold shadow-sm"
                    style={{ backgroundColor: "#25D366", borderRadius: "50px", border: "none" }}
                >
                    Enviar Mensaje Directo
                </a>
            </div>
        </div>
    );
};