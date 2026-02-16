import { formatNumber } from "../../helpers/formatNumber";

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
              <a className="btn btn-outline-light" style={{fontWeight: "bold"}} aria-current="page" href="#">Home</a>
            </li>
            {token ? (
              <>
                <li className="nav-item">
                    <button className="btn btn-outline-light"> <i className="fa-solid fa-unlock"></i> Profile</button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger"> <i className="fa-solid fa-unlock"></i> Logout</button>
                </li>
              </>
            ) : (
              <> <li className="nav-item">
                <button className="btn btn-outline-secondary" href="#"><i className="fa-solid fa-lock"></i>Login</button>
              </li>
                <li>
                  <button className="btn btn-outline-secondary" href="#"><i className="fa-solid fa-lock"></i>Register</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div>
        <div className="cart">
          <button className="btn btn-outline-success">
            {"🛒 Total: $" + formatNumber(total)}
          </button>
        </div>

      </div>
    </nav>
  )
}
