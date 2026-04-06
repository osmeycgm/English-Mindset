import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useCart } from "../Context/CartContext"

export const Pizza = () => {
  const { id } = useParams()
  const [pizza, setPizza] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { agregarAlCarrito } = useCart()

  useEffect(() => {
    fetch(`http://localhost:5000/api/pizzas/${id}`)
      .then(res => res.json())
      .then(data => setPizza(data))
      .catch(err => setError("Error al cargar pizza: " + err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>
  if (!pizza) return <div>Pizza no encontrada</div>

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
      `
    }}>
      <div style={{
        width: "30rem",
        padding: "2rem",
        borderRadius: "8px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #ccc"
      }}>
        <img src={pizza.img} alt={pizza.name} style={{ width: "100%", borderRadius: "8px" }} />
        <h2 className="mt-3">{pizza.name}</h2>
        <p className="fw-bold fs-5">${pizza.price}</p>
        <h6>Ingredientes:</h6>
        <ul>
          {pizza.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <button
          className="btn btn-primary w-100 mt-3"
          onClick={() => agregarAlCarrito(pizza)}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  )
}

export default Pizza