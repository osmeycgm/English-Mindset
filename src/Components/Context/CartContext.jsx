import { createContext, useState, useContext } from "react"
// Importamos el array desde la raíz de src
import { servicios } from "../../servicios.js";

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])

    const sumarCantidad = (id) => {
        setCart(cart.map(item =>
            item.id === id ? { ...item, count: (item.count || 1) + 1 } : item))
    }

    const restarCantidad = (id) => {
        setCart(cart.map(item =>
            item.id === id && item.count > 1 ? { ...item, count: item.count - 1 } : item))
    }

    // RESPALDO: Agregamos (item.count || 1) para que si el plan entra directo, 
    // multiplique por 1 de forma automática y no falle con NaN
    const total = () => {
        return cart.reduce((acc, item) => acc + (item.price * (item.count || 1)), 0)
    }

    const agregarAlCarrito = (item) => {
        setCart((prevCart) => {
            const existe = prevCart.find((p) => p.id === item.id);
            if (existe) {
                return prevCart.map((p) =>
                    p.id === item.id ? { ...p, count: (p.count || 1) + 1 } : p
                );
            } else {
                return [...prevCart, { ...item, count: 1 }];
            }
        });
    };

    return (
        <CartContext.Provider value={{
            cart,
            setCart, // ← ¡FALTABA ESTO! Ahora ya puede ser usado en Home.jsx y Cart.jsx
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