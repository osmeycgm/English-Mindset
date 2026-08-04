// src/Context/UserContext.jsx
import { createContext, useState, useContext, useEffect } from "react"

export const UserContext = createContext()

// Configuración dinámica de la URL del Backend:
const API_URL =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5000"
        : "https://english-mindset-production.up.railway.app"

export const UserProvider = ({ children }) => {
    // Inicializamos los estados intentando leer el token de la sesión activa
    const [token, setToken] = useState(() => localStorage.getItem("em_token") || null)
    const [email, setEmail] = useState(() => localStorage.getItem("em_email") || null)
    const [id, setId] = useState(() => localStorage.getItem("em_id") || null)
    
    // NUEVO: Estado del plan para desbloquear TrainingHub
    const [hasActivePlan, setHasActivePlan] = useState(false);

    // Evaluar si el usuario actual es Administrador
    const isAdmin = email === 'osmey009@gmail.com';
    
    // Objeto user para componentes que requieran la estructura { id, email }
    const user = token ? { id, email } : null;

    // ==========================================
    // SINCRONIZAR PERFIL CON BACKEND
    // ==========================================
    const fetchUserProfile = async () => {
        if (!token) return;
        try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (response.ok && data.success) {
                setHasActivePlan(data.user.hasActivePlan);
            } else if (response.status === 401) {
                // Si el token expiró, cerramos la sesión automáticamente
                logout();
            }
        } catch (error) {
            console.error("Error al sincronizar estado del plan:", error);
        }
    };

    // Consultar el estado cada vez que el token cambie
    useEffect(() => {
        if (token) {
            fetchUserProfile();
        } else {
            setHasActivePlan(false);
        }
    }, [token]);

    // ==========================================
    // PERSISTENCIA DE LA SESIÓN
    // ==========================================
    useEffect(() => {
        if (token) {
            console.log('DEBUG UserContext: guardando token en localStorage', token)
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
                setHasActivePlan(data.user?.hasActivePlan || false) // Se establece instantáneamente
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
                    setHasActivePlan(data.user?.hasActivePlan || false)
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
                setHasActivePlan(data.user?.hasActivePlan || false)
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
            hasActivePlan,      // Exponemos el estado del plan a toda la app
            fetchUserProfile,   // Exponemos la función por si necesitas recargar manual
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