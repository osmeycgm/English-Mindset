import { useCart } from "../../Context/CartContext"
import { useUser } from "../../Context/UserContext"
import { Link } from "react-router-dom"

const Cart = () => {
    // Solo traemos lo necesario, eliminamos delivery y sumar/restar
    const { cart, setCart, total } = useCart()
    const { token } = useUser()

    // Conectamos con el backend para procesar la compra
    const handleCheckout = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/checkouts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    // Enviamos el carrito tal cual
                    cart: cart 
                })
            })
            const data = await response.json()

            if (response.ok) {
                alert("¡Tu inscripción fue procesada con éxito! 💪 Empieza a entrenar hoy.")
                setCart([]) // Vaciamos el carrito tras comprar
            } else {
                alert("Error: " + data.message)
            }
        } catch (err) {
            alert("Error de conexión: " + err.message)
        }
    }

    // Función para quitar un plan del carrito
    const eliminarItem = (id) => {
        setCart(cart.filter(item => item.id !== id))
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // Un fondo más moderno y fitness (oscuro y limpio)
            background: `linear-gradient(135deg, #1f1f1f 0%, #343a40 100%)`,
            padding: "20px"
        }}>
            <div className="shadow-lg" style={{
                width: "100%",
                maxWidth: "28rem",
                padding: "40px 30px",
                borderRadius: "15px",
                backgroundColor: "#ffffff"
            }}>
                <h3 className="fw-bold text-center mb-4" style={{ color: "#333" }}>Resumen de tu Plan</h3>

                {cart.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted mb-4">No has seleccionado ningún plan aún. <br /> ¡Es hora de empezar tu cambio! ⚡</p>
                        <Link to="/" className="btn btn-outline-dark" style={{ borderRadius: "20px" }}>
                            Ver Entrenamientos
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            {cart.map(item => (
                                <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <img 
                                            src={item.img} 
                                            alt={item.name} 
                                            style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} 
                                            className="me-3" 
                                        />
                                        <div>
                                            <h6 className="mb-1 fw-bold">{item.name}</h6>
                                            <span className="text-muted small">Acceso Digital</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column align-items-end gap-2">
                                        <h6 className="mb-0 fw-bold" style={{ color: "#d63384" }}>${item.price.toLocaleString()}</h6>
                                        {/* Botón de eliminar en vez de cantidades */}
                                        <button 
                                            className="btn btn-link text-danger p-0 text-decoration-none small" 
                                            onClick={() => eliminarItem(item.id)}
                                            style={{ fontSize: "0.8rem" }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-2 border-top">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold mb-0 text-muted">Total a pagar</h5>
                                <h4 className="fw-bold mb-0">${total().toLocaleString()}</h4>
                            </div>

                            <button
                                className="btn w-100 fw-bold py-3 mb-3"
                                onClick={handleCheckout}
                                disabled={!token}
                                style={{ 
                                    backgroundColor: token ? "#d63384" : "#e9ecef",
                                    color: token ? "white" : "#6c757d",
                                    border: "none",
                                    borderRadius: "10px",
                                    cursor: token ? "pointer" : "not-allowed",
                                    transition: "all 0.3s"
                                }}
                            >
                                {token ? "Finalizar Inscripción" : "Inicia sesión para continuar"}
                            </button>
                            
                            {!token && (
                                <div className="text-center mt-3">
                                    <span className="text-muted small">¿Ya tienes cuenta? </span>
                                    <Link to="/login" className="small fw-bold text-dark text-decoration-none">
                                        Ingresa aquí
                                    </Link>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Cart