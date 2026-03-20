import { useState, useEffect } from "react"

export const Pizza = () => {
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkPizza()
  }, [])

  const checkPizza = async () => {
    try {
      const url = "http://localhost:5000/api/pizzas"
      const response = await fetch(url)
      const data = await response.json()

      // Si data es un array:
      setPizzas(Array.isArray(data) ? data : [data])
    } catch (err) {
      setError("Error al cargar pizzas: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      {pizzas.map((pizza, index) => (
        <div key={index}>
          <h3>{pizza.name}</h3>
          <p>Precio: ${pizza.price}</p>
          <p>Ingredientes: {pizza.ingredients}</p>
          <img src={pizza.img} alt={pizza.name} />
        </div>
      ))}
    </div>
  )
}

export default Pizza