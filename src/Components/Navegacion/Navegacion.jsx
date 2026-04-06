import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useUser } from "../Context/UserContext";

export const Navegacion = () => {
  const { total, delivery, delivery_fee } = useCart()
  const { token, logout } = useUser()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">PIZZERIA MAMMA MIA</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">

            <li className="nav-item">
              <Link to="/">
                <button className="btn btn-outline-light" style={{ fontWeight: "bold" }}>Home</button>
              </Link>
            </li>

            {token ? (
              <>
                <li className="nav-item">
                  <Link to="/profile">
                    <button className="btn btn-outline-light"><i className="fa-solid fa-unlock"></i> 
                    Profile</button>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/">
                    <button className="btn btn-outline-danger" onClick={logout}><i className="fa-solid fa-unlock"></i> 
                    Logout</button>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login">
                    <button className="btn btn-outline-secondary"><i className="fa-solid fa-lock"></i> Login</button>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register">
                    <button className="btn btn-outline-secondary"><i className="fa-solid fa-lock"></i> Register</button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
        <div className="cart">
          <Link to="/cart">
            <button className="btn btn-outline-success">
              🛒 Total: ${total() + (delivery ? delivery_fee : 0)}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}