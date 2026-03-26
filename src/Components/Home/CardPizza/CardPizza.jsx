
export const CardPizza = ({ img, name, ingredients, price, onAgregar }) => {
    return (
        <div className="card" style={{ width: "18rem" }}>
            <img src={img} className="card-img-top" alt={name} />
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <div className="card-text">{ingredients}</div>
                <p className="card-text pizza-price">{price}</p>
                <div className="card-buttons">
                    <button className="btn btn-secondary">Ver más</button>
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