import { useCart } from "../../Context/CartContext";
import { useUser } from "../../Context/UserContext";
import { Link } from "react-router-dom"


const Cart = () => {
    const { cart, delivery, setDelivery, delivery_fee, sumarCantidad, restarCantidad, total } = useCart()
    const { token } = useUser()

    return (
        <div style={{
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
        }}>
            <div style={{
                width: "25rem",
                margin: "50px auto",
                padding: "30px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa"
            }}>
                <h3 style={{display:"flex", alignItems:"center", textAlign:"center"}}>Detalles de la compra</h3>
                {cart.length === 0 ? (
    <p className="text-center">Tu carrito esta vacio. <br /> Elige una pizza🍕</p>
   
) : (
    cart.filter(p => p.count > 0).map(pizza => (
                        <div key={pizza.id} className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                                <img src={pizza.img} alt={pizza.name} style={{ width: "50px", height: "50px" }} className="me-2" />
                                <span>{pizza.name}</span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <h6 className="mb-0">${pizza.price}</h6>
                                <div className="d-flex align-items-center gap-2">
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => restarCantidad(pizza.id)}>-</button>
                                    <span className="fw-bold">{pizza.count}</span>
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => sumarCantidad(pizza.id)}>+</button>
                                </div>
                            </div>
                        </div>
                    )))}

                <div className="mt-3">
                    <div className="form-check mb-2" style={{ backgroundColor: "#05cf31", color: "#f8f9fa", padding: "2px" }}>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="deliveryCheck"
                            checked={delivery}
                            onChange={() => setDelivery(!delivery)}
                        />
                        <label className="form-check-label" htmlFor="deliveryCheck" style={{ fontSize: "13px" }}>
                            Envío a domicilio {delivery ? `(+$$(delivery_fee))` : "(+$750)"}
                        </label>
                    </div>
                    {delivery && (
                        <h7 className="fw-bold"> Envío: ${(delivery_fee)} </h7>
                    )}
                    <h5 className="fw-bold">
                        Total a pagar: $ {(total() + (delivery ? delivery_fee : 0))}
                    </h5>
                       <button 
            className="btn btn-primary w-100" onClick={() => alert("Tu compra fue procesada con éxito")}
            disabled={!token}
            style={{ opacity: token ? 1 : 0.5, cursor: token ? "pointer" : "not-allowed" }}>
            {token ? "Finalizar Compra" : "Inicia sesión para pagar"}
        </button>
       <div style={{display: "flex", textAlign: "center", alignContent: "center", justifyContent: "center", marginTop: "10px"}}>
    {!token && (
        <Link to="/login">Iniciar sesión</Link>
    )}
</div>
                </div>
            </div>
        </div>
    )
}

export default Cart