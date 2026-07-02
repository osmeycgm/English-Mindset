import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HashRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { CartProvider } from './Components/Context/CartContext.jsx'
import { UserProvider } from './Components/Context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <UserProvider>
        <CartProvider>
          <GoogleOAuthProvider clientId="513738527485-v4gl2e6atj6q2h29k35o7ufs822qd3eb.apps.googleusercontent.com">
            <App />
          </GoogleOAuthProvider>
        </CartProvider>
      </UserProvider>
    </HashRouter>
  </StrictMode>,
)