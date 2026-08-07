// src/Context/UserContext.jsx
import { createContext, useState, useContext, useEffect } from "react"


export const UserContext = createContext()

// Configuración dinámica de la URL del Backend:
const API_URL =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5000"
        : "https://english-mindset-production.up.railway.app"

export const UserProvider = ({ children }) => {
    // Inicializamos los estados desde localStorage
    const [token, setToken] = useState(() => localStorage.getItem("em_token") || null)
    const [email, setEmail] = useState(() => localStorage.getItem("em_email") || null)
    const [id, setId] = useState(() => localStorage.getItem("em_id") || null)
    
    // Estado del plan para desbloquear el contenido
    const [hasActivePlan, setHasActivePlan] = useState(false)

    // NUEVO: Estado para saber si estamos verificando/revalidando la sesión con el backend
    const [loadingUser, setLoadingUser] = useState(true)

    // Evaluar si el usuario actual es Administrador
    const isAdmin = email === 'osmey009@gmail.com'
    
    // Objeto user para componentes que requieran la estructura { id, email }
    const user = token ? { id, email } : null

    // ==========================================
    // REVALIDAR / SINCRONIZAR PERFIL CON BACKEND
    // ==========================================
    const fetchUserProfile = async (overrideToken = null) => {
        const activeToken = overrideToken || token
        if (!activeToken) {
            setLoadingUser(false)
            return
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${activeToken}` }
            })
            const data = await response.json()
            
            if (response.ok && data.success) {
                setHasActivePlan(Boolean(data.user?.hasActivePlan))
                if (data.user?.email) setEmail(data.user.email)
                if (data.user?.id) setId(data.user.id)
            } else if (response.status === 401) {
                // Si el token expiró o es inválido, cerramos sesión
                logout()
            }
        } catch (error) {
            console.error("Error al revalidar el estado del usuario:", error)
        } finally {
            setLoadingUser(false)
        }
    }

    // Consultar el estado cada vez que el token cambie o al cargar la app
    useEffect(() => {
        if (token) {
            fetchUserProfile(token)
        } else {
            setHasActivePlan(false)
            setLoadingUser(false)
        }
    }, [token])

    // ==========================================
    // PERSISTENCIA EN LOCALSTORAGE
    // ==========================================
    useEffect(() => {
        if (token) {
            localStorage.setItem("em_token", token)
            localStorage.setItem("em_email", email || "")
            localStorage.setItem("em_id", id || "")
        } else {
            localStorage.removeItem("em_token")
            localStorage.removeItem("em_email")
            localStorage.removeItem("em_id")
        }
    }, [token, email, id])

    // ==========================================
    // INGRESO CON GOOGLE
    // ==========================================
    const loginWithGoogle = async (userEmail, googleToken, mode) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, tokenGoogle: googleToken, mode })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setToken(data.token)
                setEmail(userEmail)
                setId(data.user?.id || Date.now().toString()) 
                setHasActivePlan(Boolean(data.user?.hasActivePlan))
                return { success: true }
            } else {
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error("Error en loginWithGoogle:", error)
            return { success: false, message: "No se pudo conectar con el servidor de autenticación." }
        }
    }

    // ==========================================
    // REGISTRO MANUAL
    // ==========================================
    const register = async (userEmail, password, name, apellido, edad) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, password, name, apellido, edad })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                if (data.token) {
                    setToken(data.token)
                    setEmail(data.user?.email || userEmail)
                    setId(data.user?.id || Date.now().toString())
                    setHasActivePlan(Boolean(data.user?.hasActivePlan))
                }
                return { success: true, message: data.message }
            } else {
                return { success: false, message: data.message || "Error al registrar usuario." }
            }
        } catch (error) {
            console.error("Error en register:", error)
            return { success: false, message: "Error de red. No se pudo procesar el registro." }
        }
    }

    // ==========================================
    // LOGIN MANUAL
    // ==========================================
    const login = async (userEmail, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, password })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setToken(data.token)
                setEmail(data.user.email)
                setId(data.user.id || Date.now().toString())
                setHasActivePlan(Boolean(data.user?.hasActivePlan))
                return { success: true }
            } else {
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error("Error en login:", error)
            return { success: false, message: "Error de red. Asegúrate de que el servidor esté encendido." }
        }
    }

    // ==========================================
    // CERRAR SESIÓN
    // ==========================================
    const logout = () => {
        setToken(null)
        setEmail(null)
        setId(null)
        setHasActivePlan(false)
        setLoadingUser(false)
    }

    const getProfile = () => {
        if (token) return { success: true, data: { email, id } }
        return { success: false, message: "Debes estar autenticado" }
    }

    return (
        <UserContext.Provider value={{ 
            token, 
            email, 
            id, 
            user, 
            isAdmin,
            hasActivePlan,      // Estado del plan activado/inactivo
            loadingUser,        // Estado de carga para proteger vistas
            fetchUserProfile,   // Función para forzar revalidación bajo demanda
            login, 
            register, 
            logout, 
            getProfile, 
            loginWithGoogle 
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)