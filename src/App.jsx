import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './Components/Context/UserContext'  // ← agrega
import { Navegacion } from './Components/Navegacion/Navegacion'
import { Home } from './Components/Home/Home'
import { LoginPage } from './Components/Navegacion/Forms/LoginPage'
import { RegisterPage } from './Components/Navegacion/Forms/RegisterPage'
import Cart from './Components/Navegacion/Forms/Cart'
import { Pizza } from './Components/Pizza/Pizza'
import Profile from './Components/Navegacion/Forms/Profile'
import NotFound from './Pages/NotFound/NotFound'
import { Footer } from './Components/Footer/Footer'
import './App.css'

function App() {
  const { token } = useUser()

  return (
    <>
      <Navegacion />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/pizza/:id" element={<Pizza />} />
        <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
      <Footer />
    </>
  )
}

export default App