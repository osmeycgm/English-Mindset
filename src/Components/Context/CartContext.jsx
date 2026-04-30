import { createContext, useState, useContext } from "react"
// Importamos el array desde la raíz de src
import { servicios } from "../../servicios.js";

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])

    // En servicios digitales, normalmente no sumamos cantidad (no compras 2 veces el mismo plan)
    // Pero mantenemos la lógica por si vendes suplementos físicos luego
    const sumarCantidad = (id) => {
        setCart(cart.map(item =>
            item.id === id ? { ...item, count: item.count + 1 } : item))
    }

    const restarCantidad = (id) => {
        setCart(cart.map(item =>
            item.id === id && item.count > 1 ? { ...item, count: item.count - 1 } : item))
    }

    const total = () => {
        return cart.reduce((acc, item) => acc + (item.price * item.count), 0)
    }

    const agregarAlCarrito = (item) => {
        setCart((prevCart) => {
            const existe = prevCart.find((p) => p.id === item.id);
            if (existe) {
                return prevCart.map((p) =>
                    p.id === item.id ? { ...p, count: p.count + 1 } : p
                );
            } else {
                return [...prevCart, { ...item, count: 1 }];
            }
        });
    };

    return (
        <CartContext.Provider value={{
            cart,
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