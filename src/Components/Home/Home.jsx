import { CardPizza } from "./CardPizza/CardPizza"
import { Header } from "./Header/Header"


export const Home = () => {
    return (
        <>
            <main className="main">
                <Header />
                <div className="container mt-5 pb-5">
                    <div className="row justify-content-center g-4">
                        <div className="col-12 col-md-4">
                            <CardPizza
                                name="Napolitana"
                                price={"$ 8990"}
                                ingredients={["Mozzarella, tomates, jamón, orégano"]}
                                img="https://firebasestorage.googleapis.com/v0/b/apis-varias-mias.appspot.co
m/o/pizzeria%2Fpizza-1239077_640_cl.jpg?alt=media&token=6a9a33da-5c00-49d4-9
080-784dcc87ec2c"
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <CardPizza
                                name="Española"
                                price={"$ 9990"}
                                ingredients={["Mozzarella, gorgonzola, parmesano, provolone"]}
                                img="https://firebasestorage.googleapis.com/v0/b/apis-varias-mias.appspot.co
m/o/pizzeria%2Fcheese-164872_640_com.jpg?alt=media&token=18b2b821-4d0d-43f2-
a1c6-8c57bc388fab"
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <CardPizza
                                name="Pepperoni"
                                price={"$ 9990"}
                                ingredients={["Mozzarella, pepperoni, orégano al horno"]}
                                img="https://firebasestorage.googleapis.com/v0/b/apis-varias-mias.appspot.co
m/o/pizzeria%2Fpizza-1239077_640_com.jpg?alt=media&token=e7cde87a-08d5-4040-
ac54-90f6c31eb3e3"
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center g-4 mt-3 pb-3">
                        <div className="col-12 col-md-4">
                            <CardPizza
                                name="Veggie"
                                price={"$ 9990"}
                                ingredients={["Mozzarella, vegetales varios, orégano"]}
                                img="/img/veggi.jpg"
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <CardPizza
                                name="Fiesta"
                                price={"$ 13990"}
                                ingredients={["Mixta de vegetales y carnes, orégano"]}
                                img="/img/fiesta.jpg"
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <CardPizza
                                name="Doble Pepperoni"
                                price={"$ 11990"}
                                ingredients={["Mozzarella, doble pepperoni, orégano"]}
                                img="/img/double-pepperoni.jpg"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>

    )
}
