import { useState } from 'react'
import './App.css'
import { Footer } from './Components/Footer/Footer'
import { Home } from './Components/Home/Home'
import { Navegacion } from './Components/Navegacion/Navegacion'
import {LoginPage} from './Components/Navegacion/Forms/LoginPage'
import { RegisterPage } from './Components/Navegacion/Forms/RegisterPage'
import { Header } from './Components/Home/Header/Header'
import Cart from './Components/Navegacion/Forms/Cart'


function App() {
  return (
    <>
    <Navegacion/>
    {/* <LoginPage/> */}
    {/* <RegisterPage/> */}
    <Home/>
    {/*<Header/>*/}
  {/*<Cart />*/}
    <Footer />
    </>
  )
}

export default App
