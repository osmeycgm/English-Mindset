import { createContext, useState, useContext } from "react"

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [email, setEmail] = useState(null)
    const [id, setId] = useState(null)

    // SIMULACIÓN DE LOGIN LOCAL
    const login = async (userEmail, password) => {
        // Simulamos una pequeña carga de red de 500ms
        return new Promise((resolve) => {
            setTimeout(() => {
                // Aquí podrías validar contra un usuario "quemado" o simplemente aceptar cualquiera
                // que pase las validaciones de tu LoginPage
                setToken("token-falso-claudfit-12345")
                setEmail(userEmail)
                setId("user-id-001")
                
                resolve({ success: true })
            }, 500)
        })
    }

    // SIMULACIÓN DE REGISTRO LOCAL
    const register = async (userEmail, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                setToken("token-falso-claudfit-12345")
                setEmail(userEmail)
                setId("user-id-001")
                
                resolve({ success: true })
            }, 500)
        })
    }

    const logout = () => {
        setToken(null)
        setEmail(null)
        setId(null) 
    }

    // SIMULACIÓN DE PERFIL LOCAL (ya tienes los datos en el estado)
    const getProfile = () => {
        if (token) {
            return { success: true, data: { email, id } }
        }
        return { success: false, message: "No hay sesión activa" }
    }

    return (
        <UserContext.Provider value={{ token, email, id, login, register, logout, getProfile }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)