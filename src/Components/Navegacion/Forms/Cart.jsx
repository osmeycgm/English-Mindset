import { useState } from "react"
import { pizzaCart } from "../../../pizzas"
import { formatNumber } from "../../../helpers/formatNumber"

const Cart = () => {
    const [cart, setCart] = useState(pizzaCart);
    const [delivery, setDelivery] = useState(false);
    const delivery_fee = 2000;

    const sumarCantidad = (id) => {
        setCart(cart.map(pizza =>
            pizza.id === id ? { ...pizza, count: pizza.count + 1 } : pizza));
    };
    const restarCantidad = (id) => {
        setCart(cart.map(pizza =>
            pizza.id === id && pizza.count > 0 ? { ...pizza, count: pizza.count - 1 } : pizza));
    };
    const total = () => {
        return cart.reduce((total, pizza) => total + (pizza.price * pizza.count), 0);
    };

    return (
        <>
            <div className="cardcart" 
            style={{ 
                width: "25rem", 
                margin: "50px auto auto auto", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "8px", 
                backgroundColor: "#f8f9fa" }}>
                <div className="card-body" style={{}}>
                    <h3 className="card-title1">Detalles de la compra</h3>
                    {cart.map(pizza => (
                        <div key={pizza.id} className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                                <img
                                    src={pizza.img}
                                    alt={pizza.name}
                                    className="img-fluid me-2"
                                    style={{ width: "50px", height: "50px" }} />
                                <span>{pizza.name}</span>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                <h6 className="mb-0">${formatNumber(pizza.price)}</h6>

                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => restarCantidad(pizza.id)}
                                    >
                                        -
                                    </button>
                                    <span className="fw-bold">{pizza.count}</span>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => sumarCantidad(pizza.id)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-3">
                        <div className="form-check mb-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="deliveryCheck"
                                checked={delivery}
                                onChange={() => setDelivery(!delivery)}
                            />
                            <label className="form-check-label" htmlFor="deliveryCheck">
                                Envío a domicilio {delivery ? `(+$${(delivery_fee)})` : "(por solo $2000)"}
                            </label>
                        </div>
                        {delivery && (
                            <h7 className="fw-bold"> Envío: ${(delivery_fee)} </h7>
                        )}
                        <h5 className="fw-bold">
                            Total a pagar: $ {(total() + (delivery ? delivery_fee : 0))}
                        </h5>
                        <button className="btn btn-primary w-100">Finalizar Compra</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Cart