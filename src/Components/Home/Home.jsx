import pizzas from "../../pizzas"
import { CardPizza } from "./CardPizza/CardPizza"
import { Header } from "./Header/Header"


export const Home = () => {
    return (
        <>
            <main className="main">
                <Header />
                <div className="container mt-5 pb-5" style={{display:"flex", flexDirection:" column", }}>
                    <div>
                        <h2 className="text-center mb-4">Nuestras Pizzas</h2>
                    </div>
                    <div className="row">
                        {pizzas.map(pizza => (
                            <div className="col-12 col-md-4 mb-4" key={pizza.id}>
                                <CardPizza
                                    name={pizza.name}
                                    price={`$${pizza.price}`}
                                    ingredients={<ul>{pizza.ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)}</ul>}
                                    img={pizza.img} />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>

    )
}
export default Home;