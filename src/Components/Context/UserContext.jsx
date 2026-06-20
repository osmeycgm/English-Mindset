// src/Context/UserContext.jsx
import { createContext, useState, useContext, useEffect } from "react"

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    // Inicializamos los estados intentando leer el token de la sesión activa
    const [token, setToken] = useState(() => localStorage.getItem("em_token") || null)
    const [email, setEmail] = useState(() => localStorage.getItem("em_email") || null)
    const [id, setId] = useState(() => localStorage.getItem("em_id") || null)

    // PERSISTENCIA DE LA SESIÓN: Si hay un token activo, se mantiene al recargar la página
    useEffect(() => {
        if (token) {
            localStorage.setItem("em_token", token)
            localStorage.setItem("em_email", email)
            localStorage.setItem("em_id", id)
        } else {
            localStorage.removeItem("em_token")
            localStorage.removeItem("em_email")
            localStorage.removeItem("em_id")
        }
    }, [token, email, id])

    // ==========================================
    // INGRESO CON GOOGLE (Conexión Real Backend)
    // ==========================================
    const loginWithGoogle = async (userEmail, googleToken, mode) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, tokenGoogle: googleToken, mode })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setToken(data.token)
                setEmail(userEmail)
                // Usamos el ID devuelto por el servidor o un fallback temporal
                setId(data.user?.id || Date.now().toString()) 
                return { success: true }
            } else {
                // Captura el mensaje exacto del servidor (ej: "ya existe esta cuenta")
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error("Error en loginWithGoogle:", error)
            return { success: false, message: "No se pudo conectar con el servidor de autenticación." }
        }
    }

    // ==========================================
    // REGISTRO MANUAL (Ahora con todos los campos)
    // ==========================================
    const register = async (userEmail, password, name, apellido, edad) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, password, name, apellido, edad })
            })

            const data = await response.json()

            if (response.ok && data.success) {
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
    // LOGIN MANUAL (Conexión Real Backend)
    // ==========================================
    const login = async (userEmail, password) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, password })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setToken(data.token)
                setEmail(data.user.email)
                setId(data.user.id || Date.now().toString())
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
    }

    const getProfile = () => {
        if (token) return { success: true, data: { email, id } }
        return { success: false, message: "Debes estar autenticado" }
    }

    return (
        <UserContext.Provider value={{ token, email, id, login, register, logout, getProfile, loginWithGoogle }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)