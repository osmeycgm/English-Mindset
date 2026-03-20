import './App.css'
import { Footer } from './Components/Footer/Footer'
import { Home } from './Components/Home/Home'
import { Navegacion } from './Components/Navegacion/Navegacion'
import { LoginPage } from './Components/Navegacion/Forms/LoginPage'
import { RegisterPage } from './Components/Navegacion/Forms/RegisterPage'
import Cart from './Components/Navegacion/Forms/Cart'
import { Pizza } from './Components/Pizza/Pizza'
import { Route, Routes } from "react-router-dom"
import NotFound from './Pages/NotFound/NotFound'
import Profile from './Components/Navegacion/Forms/Profile'

function App() {
  return (
    <>
      <Navegacion />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/pizza/p001" element={<Pizza />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App