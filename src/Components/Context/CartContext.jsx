import { createContext, useState, useContext } from "react"
import { pizzaCart } from "../../pizzas"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [delivery, setDelivery] = useState(false)
    const delivery_fee = 750

    const sumarCantidad = (id) => {
        setCart(cart.map(pizza =>
            pizza.id === id ? { ...pizza, count: pizza.count + 1 } : pizza))
    }

    const restarCantidad = (id) => {
        setCart(cart.map(pizza =>
            pizza.id === id && pizza.count > 0 ? { ...pizza, count: pizza.count - 1 } : pizza))
    }

    const total = () => {
        return cart.reduce((acc, pizza) => acc + (pizza.price * pizza.count), 0)
    }

const agregarAlCarrito = (pizza) => {
    setCart((prevCart) => {
        const existe = prevCart.find((p) => p.id === pizza.id);
        if (existe) {
            return prevCart.map((p) =>
                p.id === pizza.id ? { ...p, count: p.count + 1 } : p
            );
        } else {

            return [...prevCart, { ...pizza, count: 1 }];
        }
    });
};



    return (
        <CartContext.Provider value={{
            cart,
            delivery,
            setDelivery,
            delivery_fee,
            sumarCantidad,
            restarCantidad,
            total,
            agregarAlCarrito 
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)