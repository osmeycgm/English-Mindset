import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './Components/Context/UserContext'
import { Navegacion } from './Components/Navegacion/Navegacion'
import { Home } from './Components/Home/Home'
import { LoginPage } from './Components/Navegacion/Forms/LoginPage'
import { RegisterPage } from './Components/Navegacion/Forms/RegisterPage'
import Cart from './Components/Navegacion/Forms/Cart'
import { Pizza } from './Components/Pizza/Pizza' // Tu vista de detalle actual
import Profile from './Components/Navegacion/Forms/Profile'
import { ContactoPage } from './Components/Navegacion/Forms/ContactoPage'
import NotFound from './Pages/NotFound/NotFound'
import { Footer } from './Components/Footer/Footer'
import './App.css'

// ─── IMPORTACIÓN DE LA NUEVA PÁGINA INTERACTIVA ───────────────────────────
import Metodologia from './Components/Navegacion/Forms/Metodologia'
import Planes from './Components/Navegacion/Forms/Planes'
import Test from './Components/Navegacion/Forms/Test'
import Testing from './Components/Navegacion/Forms/Testing'
import TrainingHub from './Components/Navegacion/Forms/TrainingHub'
import Testing0 from './Components/Navegacion/Forms/Testing0'
import AdminRoute from './Components/AdminRoute'
import AdminDashboard from './Components/AdminDashboard'

function App() {
  const { token } = useUser()

  return (
    <>
      <Navegacion />
      <Routes>
        {/* ─── RUTAS PÚBLICAS / CLIENTE ─── */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />
        
        {/* Rutas de Contenido Académico e Informativo */}
        <Route path="/planes" element={<Planes />} />
        <Route path="/traininghub" element={<TrainingHub />} />
        <Route path="/Testing0" element={<Testing0 />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/test" element={<Test />} />
        <Route path="/testing" element={<Testing/>} />
        
        {/* 🚀 NUEVA RUTA: Metodología Interactiva */}
        <Route path="/metodologia" element={<Metodologia />} />

        {/* Ruta para ver el detalle dinámico de un curso específico */}
     

        {/* Rutas Protegidas (Solo accesibles con sesión activa) */}
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />

        {/* 🚨 Control de errores: Redirección de URLs inexistentes */}
        <Route path="*" element={<NotFound />} />

        {/* ─── RUTAS PROTEGIDAS / ADMINISTRADOR ─── */}
        <Route element={<AdminRoute/>}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      </Routes>
      <Footer />
    </>
  )
}

export default App