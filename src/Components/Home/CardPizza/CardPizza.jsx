import { Link } from "react-router-dom";

export const CardPizza = ({ img, name, ingredients = [], price, onAgregar, id }) => {
    return (
       <div className="card" style={{width: "18rem"}}>
            <img src={img} className="card-img-top" alt={name}/>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <div className="card-text">
                    <ul>
                        {ingredients?.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <p className="card-text pizza-price">${price}</p>
                <div className="card-buttons d-flex gap-2">
                    <Link to={`/pizza/${id}`} className="btn btn-secondary">
                        Ver más
                    </Link>
                    <button
                        className="btn btn-primary"
                        onClick={onAgregar}
                    >
                        Añadir al carrito
                    </button>
                </div>
            </div>
        </div>
    );
}