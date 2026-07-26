import { useMemo, useState, useEffect, useRef } from "react"
import { useCart } from "../../Context/CartContext"
import { useUser } from "../../Context/UserContext"
import { Link, useNavigate } from "react-router-dom"
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const Cart = () => {
    const { cart, setCart, total } = useCart()
    const { token, email, id, register, login, loginWithGoogle } = useUser()
    const navigate = useNavigate()

    const selectedItem = cart[0]

    // ─── ESTADOS PARA EL FORMULARIO INTEGRADO ──────────────────────────────────
    const [isLoginView, setIsLoginView] = useState(false)
    const [formData, setFormData] = useState({ name: "", apellido: "", edad: "", email: "", password: "", confirmar: "" })
    const [loading, setLoading] = useState(false)
    const [transferLoading, setTransferLoading] = useState(false)
    const [mensaje, setMensaje] = useState("")
    const [tipoMensaje, setTipoMensaje] = useState("")

    // Controla la pasarela interna activa ("transferencia", "paypal", "crypto", o null)
    const [metodoSeleccionado, setMetodoSeleccionado] = useState(null)

    // Estados específicos para flujos manuales
    const [cryptoTxId, setCryptoTxId] = useState("")
    const [transferRef, setTransferRef] = useState(null)

    // Referencia para asegurar que PayPal solo se monte una vez por renderizado de vista
    const paypalRef = useRef(null)

    // ─── BENEFICIOS DINÁMICOS ──────────────────────────────────────────────────
    const benefits = useMemo(() => {
        if (!selectedItem) return [];
        const category = selectedItem.category?.toLowerCase() || "";

        if (category.includes("suscripción") || category.includes("plan")) {
            return [
                { title: "Clases en vivo e interactivas:", desc: "Sesiones guiadas con foco 100% en conversación para perder el miedo al hablar." },
                { title: "Seguimiento personalizado:", desc: "Un tutor asignado monitorea tu progreso semanal y corrige tus vicios de pronunciación." },
                { title: "Flexibilidad de horarios:", desc: "Reserva y gestiona tus semanas según tu disponibilidad académica o laboral." }
            ];
        }
        if (category.includes("grabado") || category.includes("video")) {
            return [
                { title: "Acceso de por vida inmediato:", desc: "Estudia a tu propio ritmo, repite las lecciones las veces que quieras sin presiones." },
                { title: "Material descargable complementario:", desc: "Guías prácticas en PDF, plantillas de vocabulario y quizes interactivos por módulo." },
                { title: "Resolución de dudas en plataforma:", desc: "Cuentas con un foro exclusivo debajo de cada video para dejar tus consultas al profesor." }
            ];
        }
        return [
            { title: "Acceso ilimitado:", desc: "Ingreso inmediato a las herramientas de estudio exclusivas de English Mindset." },
            { title: "Garantía de aprendizaje:", desc: "Metodología diseñada para sacarte de la traducción mental desde la primera semana." }
        ];
    }, [selectedItem]);

// ─── EFECTO PARA EL SDK DE PAYPAL ──────────────────────────────────────────
useEffect(() => {
    const API_URL = "http://localhost:5000/api"

    if (metodoSeleccionado !== "paypal") return

    // Espera activa hasta que window.paypal esté disponible
    const waitForPayPal = setInterval(() => {
        if (!window.paypal) return  // ← sigue esperando si no cargó aún
        clearInterval(waitForPayPal) // ← ya cargó, detiene el intervalo

        // Limpia el contenedor antes de montar los botones
        if (paypalRef.current) paypalRef.current.innerHTML = ""

        window.paypal.Buttons({

            createOrder: async () => {
                console.log("Token que se envía:", token)
                if (!token) {
                    throw new Error('Debes iniciar sesión antes de pagar con PayPal.');
                }

                try {
                    const totalCLP = total()
                    const totalUSD = (totalCLP / 950).toFixed(2)

                    const response = await fetch(`${API_URL}/paypal/create-order`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            cartItems: cart,
                            totalCLP,
                            totalUSD
                        })
                    })

                    const data = await response.json()
                    if (!response.ok) throw new Error(data.message || "Error al crear la orden.")

                    return data.id  // ← CRUCIAL: retorna el ID directamente

                } catch (error) {
                    console.error("Error en createOrder:", error)
                    alert(`Error al iniciar pago: ${error.message}`)
                    throw error
                }
            },

            onApprove: async (data, actions) => {
                try {
                    const response = await fetch(`${API_URL}/paypal/capture-order`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            orderID: data.orderID,
                            cartItems: cart,
                            totalCLP: total()
                        })
                    })

                    const result = await response.json()

                    // ← Manejo de tarjeta rechazada — deja reintentar sin cerrar PayPal
                    if (result.details?.details?.[0]?.issue === "INSTRUMENT_DECLINED") {
                        return actions.restart()
                    }

                    if (!response.ok) throw new Error(result.message || "Error al capturar el pago.")

                    alert("¡Pago procesado con éxito! 🎉")
                    setCart([])
                    setMetodoSeleccionado(null)
                    navigate("/profile")

                } catch (error) {
                    console.error("Error en onApprove:", error)
                    alert(`Error al confirmar el pago: ${error.message}`)
                }
            },

            onError: (err) => {
                console.error("PayPal Error:", err)
                alert("Hubo un problema con PayPal. Intenta de nuevo.")
            }

        }).render(paypalRef.current)

    }, 300) // revisa cada 300ms si window.paypal ya cargó

    // Limpieza: si el usuario cambia de método antes de que cargue, cancela el intervalo
    return () => clearInterval(waitForPayPal)

}, [metodoSeleccionado, cart, token, total])
    // ─── MANEJADORES DE ENTRADAS ───────────────────────────────────────────────
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // ─── FLUJO EXPRÉS: GOOGLE LOGIN/REGISTER ───────────────────────────────────
    const handleGoogleSuccess = async (credentialResponse) => {
        const tokenGoogle = credentialResponse.credential;
        const infoUsuario = jwtDecode(tokenGoogle);

        const mode = isLoginView ? "login" : "register";
        const result = await loginWithGoogle(infoUsuario.email, tokenGoogle, mode);

        if (result && result.success) {
            setTipoMensaje("success");
            setMensaje(`¡${isLoginView ? 'Autenticación' : 'Registro'} exitoso con Google!`);
        } else {
            // Evaluamos si intentamos registrar y el correo ya estaba registrado
            const usuarioYaExiste = result?.message?.toLowerCase().includes("ya existe") || 
                                    result?.message?.toLowerCase().includes("registrado");

            if (!isLoginView && usuarioYaExiste) {
                setTipoMensaje("error");
                setMensaje("Ya eres usuario registrado con ese correo. Por favor, inicia sesión.");
                setIsLoginView(true); // Se fuerza el cambio a la vista de "Iniciar Sesión"
            } else {
                setTipoMensaje("error");
                setMensaje(result?.message || `Ocurrió un error al intentar ${isLoginView ? 'acceder' : 'registrarse'} con Google.`);
            }
        }
    };

    // ─── FLUJO EXPRÉS: REGISTRO/LOGIN MANUAL ───────────────────────────────────
    const handleExpressAuth = async (e) => {
        e.preventDefault()
        setMensaje("")
        setLoading(true)

        if (isLoginView) {
            if (!formData.email.trim() || !formData.password.trim()) {
                setTipoMensaje("error"); setMensaje("Correo y contraseña son obligatorios"); setLoading(false); return
            }
            const result = await login(formData.email, formData.password)
            if (result.success) {
                setTipoMensaje("success"); setMensaje("¡Sesión iniciada!");
            } else {
                setTipoMensaje("error"); setMensaje(result.message);
            }
        } else {
            if (!formData.name.trim() || !formData.apellido.trim() || !formData.edad.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmar.trim()) {
                setTipoMensaje("error"); setMensaje("Por favor, completa todos los campos"); setLoading(false); return
            }
            if (isNaN(formData.edad) || Number(formData.edad) < 1) {
                setTipoMensaje("error"); setMensaje("Por favor ingresa una edad válida"); setLoading(false); return
            }
            if (formData.password.length < 6) {
                setTipoMensaje("error"); setMensaje("Mínimo 6 caracteres para tu seguridad"); setLoading(false); return
            }
            if (formData.password !== formData.confirmar) {
                setTipoMensaje("error"); setMensaje("Las contraseñas no coinciden"); setLoading(false); return
            }

            const result = await register(formData.email, formData.password, formData.name, formData.apellido, formData.edad)

            if (result.success) {
                setTipoMensaje("success");
                setMensaje("¡Registro exitoso! Iniciando sesión...");
                await login(formData.email, formData.password);
            } else {
                setTipoMensaje("error"); setMensaje(result.message);
            }
        }
        setLoading(false)
    }

    // ─── MANEJADOR TRANSFERENCIA MANUAL ────────────────────────────────────────
    const handleTransferSubmit = async (e) => {
        e.preventDefault();

        const authToken = token || localStorage.getItem('em_token');

        if (!authToken) {
            alert('Debes iniciar sesión antes de enviar un comprobante. Inicia sesión o regístrate para continuar.');
            return;
        }

        if (!transferRef) {
            alert('Por favor selecciona la foto de tu comprobante.');
            return;
        }

        setTransferLoading(true);

        try {
            console.log('handleTransferSubmit token:', token, 'fallback token:', authToken);
            const formDataTransfer = new FormData();
            formDataTransfer.append('comprobante', transferRef);
            formDataTransfer.append('serviceName', selectedItem?.name || 'Servicio no especificado');
            formDataTransfer.append('servicePrice', selectedItem?.price?.toString() || '0');
            formDataTransfer.append('total', total().toString());
            formDataTransfer.append('cartItems', JSON.stringify(cart));
            formDataTransfer.append('userEmail', email || '');
            formDataTransfer.append('userId', id || '');

            const response = await fetch('http://localhost:5000/api/orders/transferencia', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
                body: formDataTransfer
            });

            const text = await response.text();
            let data = null;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.warn('Response no es JSON:', text);
            }

            if (!response.ok) {
                const errorMessage = data?.message || text || 'Error enviando comprobante de transferencia.';
                if (response.status === 401) {
                    throw new Error('Token inválido o expirado. Inicia sesión nuevamente antes de enviar el comprobante.');
                }
                throw new Error(errorMessage);
            }

            alert('Comprobante de transferencia enviado con éxito. Te notificaremos cuando se confirme el pago.');
            setCart([]);
            setTransferRef(null);
            setMetodoSeleccionado(null);
            navigate('/profile');
        } catch (error) {
            console.error('Error en handleTransferSubmit:', error);
            alert(`No se pudo enviar el comprobante: ${error.message}`);
        } finally {
            setTransferLoading(false);
        }
    }

    // ─── MANEJADOR CRYPTO MANUAL ──────────────────────────────────────────────
    const handleCryptoSubmit = async (e) => {
    e.preventDefault()
    if (!cryptoTxId.trim()) {
        alert("Por favor ingresa el Hash/TxID de la transacción.")
        return
    }

    try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
        
        const response = await fetch(`${API_URL}/api/orders/crypto`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                txId: cryptoTxId,
                total: total(),
                cartItems: cart
            })
        })

        const data = await response.json()

        if (response.ok && data.success) {
            alert("✅ Notificación enviada. Validaremos tu transacción en la blockchain y activaremos tu plan en breve.")
            setCart([])
            setCryptoTxId("")
            setMetodoSeleccionado(null)
            navigate("/profile")
        } else {
            alert(`Error: ${data.message || "No se pudo enviar la notificación."}`)
        }
    } catch (error) {
        console.error("Error en handleCryptoSubmit:", error)
        alert(`Error de conexión: ${error.message}`)
    }
}
    // Función auxiliar para copiar datos bancarios de forma limpia
    const copiarAlPortapapeles = (texto) => {
        navigator.clipboard.writeText(texto);
        alert("¡Copiado al portapapeles!");
    }

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", padding: "40px 20px" }}>
            <div className="shadow-lg" style={{ width: "100%", maxWidth: "60rem", borderRadius: "16px", backgroundColor: "#ffffff", borderTop: "6px solid #1e3a8a", overflow: "hidden" }}>
                {cart.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted mb-4">No has seleccionado ningún programa académico aún.</p>
                        <Link to="/" className="btn btn-outline-primary px-4 fw-bold" style={{ borderRadius: "20px", color: "#1e3a8a", borderColor: "#1e3a8a" }}>
                            Ver Planes Disponibles
                        </Link>
                    </div>
                ) : (
                    <div className="row g-0">

                        {/* COLUMNA IZQUIERDA: DETALLES DE VALOR */}
                        <div className="col-12 col-md-6 p-4 p-lg-5" style={{ backgroundColor: "#fafafa", borderRight: "1px solid #e2e8f0" }}>
                            <span className="badge mb-2" style={{ backgroundColor: "#0284c7" }}>{selectedItem.category || "Programa Académico"}</span>
                            <h2 className="fw-bold mb-3" style={{ color: "#1e3a8a" }}>{selectedItem.name}</h2>

                            <div className="mb-4">
                               <img src={selectedItem.img_src || selectedItem.image || selectedItem.img} alt={selectedItem.name} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "12px" }} />
                            </div>

                            <h5 className="fw-bold mb-3" style={{ color: "#0f172a", fontSize: "1rem" }}>¿Qué incluye tu inversión?</h5>
                            <ul className="list-unstyled d-flex flex-column gap-3 small text-muted mb-0">
                                {benefits.map((b, idx) => (
                                    <li className="d-flex align-items-start gap-2" key={idx}>
                                        <i className="bi bi-check-circle-fill text-success mt-0.5" />
                                        <span><strong>{b.title}</strong> {b.desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* COLUMNA DERECHA: PORTAL INTERACTIVO */}
                        <div className="col-12 col-md-6 p-4 p-lg-5 d-flex flex-column justify-content-between" style={{ backgroundColor: "#ffffff" }}>
                            <div>
                                <div className="d-flex justify-content-between align-items-baseline mb-3">
                                    <h4 className="fw-bold m-0" style={{ color: "#0f172a" }}>Resumen</h4>
                                    <button className="btn btn-link text-danger p-0 text-decoration-none small fw-bold" style={{ fontSize: "0.8rem" }} onClick={() => { eliminarItem(selectedItem.id); setMetodoSeleccionado(null); }}>
                                        Quitar plan
                                    </button>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-2 small">
                                    <span className="text-muted text-truncate me-2">{selectedItem.name}</span>
                                    <span className="fw-semibold">${selectedItem.price.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3 small">
                                    <span className="text-muted">Matrícula y Material de Estudios</span>
                                    <span className="text-success fw-bold">Incluido</span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-4" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                    <span className="fw-bold text-muted h6 mb-0">Total a pagar:</span>
                                    <span className="fw-bold h4 mb-0" style={{ color: "#1e3a8a" }}>${total().toLocaleString()}</span>
                                </div>

                                <hr className="my-4" style={{ borderColor: "#e2e8f0" }} />

                                {/* SECCIÓN DINÁMICA DE AUTENTICACIÓN / PAGO */}
                                {!token ? (
                                    <>
                                        <div className="mb-3 text-center">
                                            <h6 className="fw-bold mb-1" style={{ color: "#1e3a8a" }}>
                                                {isLoginView ? "Inicia sesión para continuar" : "Crea tu cuenta de estudiante"}
                                            </h6>
                                            <p className="text-muted small">
                                                {isLoginView ? "Ingresa para asociar el plan a tu cuenta." : "Registra tus datos para acceder al material."}
                                            </p>
                                        </div>

                                        {mensaje && (
                                            <div className={`alert ${tipoMensaje === "error" ? "alert-danger" : "alert-success"} py-2 small text-center`} style={{ borderRadius: "8px" }}>
                                                {mensaje}
                                            </div>
                                        )}

                                        <div className="d-flex justify-content-center mb-3" style={{ filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.08))" }}>
                                            <GoogleLogin
                                                onSuccess={handleGoogleSuccess}
                                                onError={() => {
                                                    setTipoMensaje("error");
                                                    setMensaje("Error al conectar con Google.");
                                                }}
                                                theme="outline" size="large" shape="pill" width="350"
                                                text={isLoginView ? "signin_with" : "signup_with"}
                                            />
                                        </div>

                                        <div className="d-flex align-items-center my-3 text-muted">
                                            <hr className="flex-grow-1 m-0" style={{ opacity: 0.15 }} />
                                            <span className="px-2 small text-uppercase fw-bold" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>O manualmente</span>
                                            <hr className="flex-grow-1 m-0" style={{ opacity: 0.15 }} />
                                        </div>

                                        <form onSubmit={handleExpressAuth} className="d-flex flex-column gap-2">
                                            {!isLoginView && (
                                                <>
                                                    <div className="row g-2 mb-2">
                                                        <div className="col-6">
                                                            <input type="text" name="name" className="form-control form-control-sm p-2" placeholder="Nombre" value={formData.name} onChange={handleInputChange} style={{ borderRadius: "8px" }} />
                                                        </div>
                                                        <div className="col-6">
                                                            <input type="text" name="apellido" className="form-control form-control-sm p-2" placeholder="Apellido" value={formData.apellido} onChange={handleInputChange} style={{ borderRadius: "8px" }} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group mb-2">
                                                        <input type="number" name="edad" className="form-control form-control-sm p-2" placeholder="Edad" value={formData.edad} onChange={handleInputChange} style={{ borderRadius: "8px" }} min="1" max="120" />
                                                    </div>
                                                </>
                                            )}

                                            <div className="form-group mb-2">
                                                <input type="email" name="email" className="form-control form-control-sm p-2" placeholder="Correo electrónico" value={formData.email} onChange={handleInputChange} style={{ borderRadius: "8px" }} />
                                            </div>

                                            <div className={!isLoginView ? "row g-2 mb-3" : "mb-3"}>
                                                <div className={!isLoginView ? "col-6" : "col-12"}>
                                                    <input type="password" name="password" className="form-control form-control-sm p-2" placeholder="Contraseña" value={formData.password} onChange={handleInputChange} style={{ borderRadius: "8px" }} />
                                                </div>
                                                {!isLoginView && (
                                                    <div className="col-6">
                                                        <input type="password" name="confirmar" className="form-control form-control-sm p-2" placeholder="Confirmar" value={formData.confirmar} onChange={handleInputChange} style={{ borderRadius: "8px" }} />
                                                    </div>
                                                )}
                                            </div>

                                            <button type="submit" className="btn w-100 fw-bold py-2 small" disabled={loading} style={{ backgroundColor: "#1e3a8a", color: "white", border: "none", borderRadius: "8px" }}>
                                                {loading ? "Procesando..." : isLoginView ? "Ingresar" : "Crear Cuenta"}
                                            </button>

                                            <div className="text-center mt-2">
                                                <button type="button" className="btn btn-link small p-0 text-decoration-none fw-bold" style={{ fontSize: "0.8rem", color: "#0284c7" }} onClick={() => { setIsLoginView(!isLoginView); setMensaje(""); }}>
                                                    {isLoginView ? "¿No tienes cuenta? Regístrate gratis" : "¿Ya eres miembro? Inicia sesión"}
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    /* SECCIÓN DE PASARELAS DE PAGO */
                                    <div className="py-2">

                                        {/* 1. INTERFAZ: TRANSFERENCIA BANCARIA DIRECTA */}
                                        {metodoSeleccionado === "transferencia" && (
                                            <div className="d-flex flex-column gap-3 animate__animated animate__fadeIn">
                                                <button className="btn btn-link p-0 text-start text-decoration-none small fw-bold mb-1" style={{ color: "#0284c7" }} onClick={() => setMetodoSeleccionado(null)}>
                                                    <i className="bi bi-arrow-left me-1" /> Volver a métodos de pago
                                                </button>

                                                <div className="p-3 rounded-3" style={{ border: "1px solid #cbd5e1", backgroundColor: "#f8fafc" }}>
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h6 className="fw-bold text-dark mb-0">
                                                            <i className="bi bi-bank text-primary me-2" />Datos de Transferencia Bancaria
                                                        </h6>
                                                        {/* Botón único para copiar todos los datos formateados */}
                                                        <button
                                                            className="btn btn-sm py-1 px-2 text-white fw-bold d-flex align-items-center gap-1"
                                                            style={{ backgroundColor: "#0284c7", fontSize: "0.75rem", borderRadius: "6px" }}
                                                            onClick={() => copiarAlPortapapeles(
                                                                "Datos de Transferencia Bancaria:\n" +
                                                                "Banco: Banco de Chile\n" +
                                                                "Tipo Cuenta: Cuenta Corriente\n" +
                                                                "N° Cuenta: 9876543210\n" +
                                                                "RUT: 76.123.456-7\n" +
                                                                "Titular: English Mindset SpA\n" +
                                                                "Correo: pagos@englishmindset.com"
                                                            )}
                                                        >
                                                            <i className="bi bi-copy" /> Copiar
                                                        </button>
                                                    </div>
                                                    <p className="text-muted small mb-3">Haz la transferencia desde tu banco.</p>

                                                    <div className="bg-white p-3 rounded-2 border mb-3 text-dark small d-flex flex-column gap-2">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span><strong>Banco:</strong> Banco de Chile</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span><strong>Tipo Cuenta:</strong> Cuenta Corriente</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span><strong>N° Cuenta:</strong> 9876543210</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span><strong>RUT:</strong> 76.123.456-7</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span><strong>Titular:</strong> English Mindset SpA</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span><strong>Correo:</strong> pagos@englishmindset.com</span>
                                                        </div>
                                                    </div>

                                                    <form onSubmit={handleTransferSubmit}>
                                                        <div className="mb-3">
                                                            <label className="form-label small fw-bold text-secondary">Adjuntar foto del comprobante:</label>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="form-control form-control-sm"
                                                                onChange={(e) => setTransferRef(e.target.files[0])} // Guarda el archivo en el estado en lugar de un string
                                                                required
                                                                style={{ borderRadius: "6px" }}
                                                            />
                                                        </div>
                                                        <button type="submit" className="btn btn-primary w-100 fw-bold py-2 small" disabled={transferLoading} style={{ backgroundColor: "#1e3a8a", border: "none", borderRadius: "8px" }}>
                                                            {transferLoading ? 'Enviando comprobante...' : 'Confirmar Envío de Comprobante'}
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. INTERFAZ: PAYPAL REAL */}
                                        {metodoSeleccionado === "paypal" && (
                                            <div className="d-flex flex-column gap-3 animate__animated animate__fadeIn">
                                                <button className="btn btn-link p-0 text-start text-decoration-none small fw-bold mb-1" style={{ color: "#0284c7" }} onClick={() => setMetodoSeleccionado(null)}>
                                                    <i className="bi bi-arrow-left me-1" /> Volver a métodos de pago
                                                </button>
                                                <div className="p-3 rounded-3 text-center" style={{ border: "1px solid #cbd5e1", backgroundColor: "#f8fafc" }}>
                                                    <h6 className="fw-bold text-dark mb-2"><i className="bi bi-paypal me-2" style={{ color: "#003087" }} />Pago Seguro vía PayPal</h6>
                                                    <p className="text-muted small mb-4">
                                                        El total se convertirá automáticamente a USD en la plataforma de PayPal:
                                                        <strong> ~${(total() / 950).toFixed(2)} USD</strong>.
                                                    </p>
                                                    <div ref={paypalRef} style={{ minHeight: "150px" }}></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. INTERFAZ: CRIPTOMONEDAS REAL */}
                                        {metodoSeleccionado === "crypto" && (
                                            <div className="d-flex flex-column gap-3 animate__animated animate__fadeIn">
                                                <button className="btn btn-link p-0 text-start text-decoration-none small fw-bold mb-1" style={{ color: "#0284c7" }} onClick={() => setMetodoSeleccionado(null)}>
                                                    <i className="bi bi-arrow-left me-1" /> Volver a métodos de pago
                                                </button>

                                                <div className="p-3 rounded-3" style={{ border: "1px solid #cbd5e1", backgroundColor: "#f8fafc" }}>
                                                    <h6 className="fw-bold text-dark mb-1">
                                                        <i className="bi bi-currency-bitcoin text-warning me-2" />Pagar con USDT / BUSD / BNB
                                                    </h6>
                                                    <p className="text-muted small mb-3">Envía el monto equivalente exacto usando la red más económica de Binance.</p>

                                                    <div className="bg-white p-3 rounded-2 border mb-3 text-dark small">
                                                        <div className="mb-2">
                                                            <strong>Monto estimado:</strong> <span className="text-success fw-bold">${(total() / 950).toFixed(2)} USDT</span>
                                                        </div>

                                                        <div className="mb-3">
                                                            <strong>Red requerida:</strong> <span className="badge bg-warning text-dark fw-bold" style={{ fontSize: "0.8rem" }}>BNB Smart Chain (BEP-20)</span>
                                                            <small className="text-danger d-block mt-1 fw-semibold">⚠️ Si seleccionas otra red al transferir, los fondos se perderán.</small>
                                                        </div>

                                                        <div className="text-center my-3 p-2 bg-light rounded" style={{ display: "inline-block", width: "100%" }}>
                                                            <img
                                                                src="https://www.image2url.com/r2/default/images/1785091347331-87767909-259a-429e-ae65-a1117114d6a2.png"
                                                                alt="QR Depósito Binance"
                                                                style={{ maxWidth: "150px", width: "100%", borderRadius: "8px" }}
                                                            />
                                                            <small className="text-muted d-block mt-1">Escanea desde tu App de Binance para pagar rápido</small>
                                                        </div>

                                                        <div className="mb-1"><strong>Dirección de Billetera (BEP-20):</strong></div>
                                                        <div className="input-group mb-2">
                                                            <input
                                                                readOnly
                                                                id="cryptoAddress"
                                                                type="text"
                                                                className="form-control form-control-sm text-center font-monospace bg-light"
                                                                value="0x16ad0f268ad8e9bc071606d40206202a08d8bbb8"
                                                                style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
                                                            />
                                                            <button
                                                                className="btn btn-outline-secondary btn-sm"
                                                                type="button"
                                                                onClick={() => copiarAlPortapapeles("0x16ad0f268ad8e9bc071606d40206202a08d8bbb8")}
                                                            >
                                                                <i className="bi bi-clipboard" /> Copiar
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <form onSubmit={handleCryptoSubmit}>
                                                        <div className="mb-3">
                                                            <label className="form-label small fw-bold text-secondary">Pega el Hash / TxID de la transacción:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                placeholder="Ej: 0x4f8b...31ae"
                                                                value={cryptoTxId}
                                                                onChange={(e) => setCryptoTxId(e.target.value)}
                                                                required
                                                                style={{ borderRadius: "6px" }}
                                                            />
                                                            <small className="text-muted d-block mt-1" style={{ fontSize: "0.7rem" }}>
                                                                Lo encuentras en tu historial de retiros de Binance como "TxID".
                                                            </small>
                                                        </div>

                                                        <button type="submit" className="btn w-100 fw-bold py-2 small text-dark fw-bold" style={{ backgroundColor: "#f3ba2f", border: "none", borderRadius: "8px" }}>
                                                            Notificar Pago Realizado
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        )}

                                        {/* VISTA GENERAL DE MÉTODOS DE PAGO (CUANDO NO HAY SELECCIONADO) */}
                                        {metodoSeleccionado === null && (
                                            <>
                                                <div className="d-flex align-items-center gap-2 mb-4 text-success small fw-bold p-2 bg-success bg-opacity-10 rounded-3">
                                                    <i className="bi bi-person-check-fill fs-5" /> Cuenta verificada. Selecciona un método de pago.
                                                </div>

                                                <div className="d-flex flex-column gap-3">
                                                    {/* OPCIÓN 1: TRANSFERENCIA DIRECTA */}
                                                    <button className="btn d-flex align-items-center justify-content-between p-3" style={{ border: "1px solid #cbd5e1", borderRadius: "10px", backgroundColor: "#fff" }} onClick={() => setMetodoSeleccionado("transferencia")}>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <i className="bi bi-bank fs-4 text-info" />
                                                            <div className="text-start">
                                                                <span className="fw-bold text-dark d-block">Transferencia Bancaria Directa</span>
                                                                <small className="text-muted" style={{ fontSize: "0.75rem" }}>Pago manual electrónico (Pesos CLP)</small>
                                                            </div>
                                                        </div>
                                                        <i className="bi bi-chevron-right text-muted" />
                                                    </button>

                                                    {/* OPCIÓN 2: PAYPAL */}
                                                    <button className="btn d-flex align-items-center justify-content-between p-3" style={{ border: "2px solid #003087", borderRadius: "10px", backgroundColor: "#f0f4fc" }} onClick={() => setMetodoSeleccionado("paypal")}>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <i className="bi bi-paypal fs-4" style={{ color: "#003087" }} />
                                                            <span className="fw-bold text-dark text-start">PayPal <small className="text-muted fw-normal">(USD)</small></span>
                                                        </div>
                                                        <i className="bi bi-chevron-right text-muted" />
                                                    </button>

                                                    {/* OPCIÓN 3: CRYPTO */}
                                                    <button className="btn d-flex align-items-center justify-content-between p-3" style={{ border: "1px solid #cbd5e1", borderRadius: "10px", backgroundColor: "#fff" }} onClick={() => setMetodoSeleccionado("crypto")}>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <i className="bi bi-currency-bitcoin fs-4 text-warning" />
                                                            <div className="text-start">
                                                                <span className="fw-bold text-dark d-block">Billetera Crypto / Binance Pay</span>
                                                                <small className="text-muted" style={{ fontSize: "0.75rem" }}>USDT / BUSD (Red BEP-20)</small>
                                                            </div>
                                                        </div>
                                                        <i className="bi bi-chevron-right text-muted" />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart;