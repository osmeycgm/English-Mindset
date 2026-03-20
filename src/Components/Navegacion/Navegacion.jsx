import { formatNumber } from "../../helpers/formatNumber";
import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Navegacion = ({ token, total }) => {
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
                <a className="btn btn-outline-light" style={{ fontWeight: "bold" }} aria-current="page" href="#">Home</a>
              </Link> </li>
            {token ? (
              <>
                <li className="nav-item">
                  <Link to="/profile">
                    <button className="btn btn-outline-light"> <i className="fa-solid fa-unlock"></i> Profile</button>
                  </Link></li>
                <li className="nav-item">
                  <Link to="/logout">
                    <button className="btn btn-outline-danger"> <i className="fa-solid fa-unlock"></i> Logout</button>
                  </Link> </li>
              </>
            ) : (
              <> <li className="nav-item">
                <Link to="/login">
                  <button className="btn btn-outline-secondary" ><i className="fa-solid fa-lock"></i>Login</button>
                </Link> </li>
                <li>
                  <Link to="/register">
                    <button className="btn btn-outline-secondary" href="#"><i className="fa-solid fa-lock"></i>Register</button></Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div style={{display:"flex", flexDirection: "row", gap:"5px"}}>
        <div className="cart">
          <Link to="/cart">
            <button className="btn btn-outline-success">
              {"🛒 Total: $" + formatNumber(total)}
            </button>
          </Link>
        </div>
        <div>
          <div className="nav-item">
            <Link to="/profile">
              <button className="btn btn-outline-light"> <i class="fa-solid fa-user"></i> Profile</button>
            </Link></div>
        </div>

      </div>
    </nav>
  )
}
