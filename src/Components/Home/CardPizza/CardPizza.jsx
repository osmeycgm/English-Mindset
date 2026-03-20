export const CardPizza = (Props) => {
    return (
        <>
            <div className="card" style={{width: "18rem"}}>
                <img src={Props.img} className="card-img-top" alt="..."/>
                <div className="card-body">
                    <h5 className="card-title">{Props.name}</h5>
                    <div className="card-text">{Props.ingredients}</div>  {/* ← div, no p */}
                    <p className="card-text pizza-price">{Props.price}</p>
                    <div className="card-buttons">
                        <a href="" className="btn btn-secondary">Ver más</a>
                        <a href="" className="btn btn-primary">Añadir al carrito</a>
                    </div>
                </div>
            </div>
        </>
    )
}