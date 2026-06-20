import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware
// NOTA: Si experimentas problemas de CORS en el navegador, cambia cors() por:
// app.use(cors({ origin: 'http://localhost:5173' })); // Pon aquí la URL de tu frontend
app.use(cors());
app.use(express.json());

// Base de datos temporal en memoria (un array de objetos)
const users = [];
const orders = [];

// ─── CONFIGURACIÓN DE PAYPAL ──────────────────────────────────────────────────
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Entorno Sandbox (Pruebas)

// Función auxiliar para obtener el token de acceso de PayPal de forma segura
async function generateAccessToken() {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("Faltan las credenciales PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET en el .env");
    }
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID.trim()}:${PAYPAL_CLIENT_SECRET.trim()}`).toString("base64");
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    
    const data = await response.json();
    return data.access_token;
}

// ─── 1. AUTENTICACIÓN MANUAL: REGISTRO ──────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
    const { email, password, name, apellido, edad } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: "Faltan campos obligatorios." });
    }

    // Validar si el usuario ya existe
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ success: false, message: "El correo ya está registrado." });
    }

    // Crear y guardar el nuevo usuario
    const newUser = { id: Date.now(), email, password, name, apellido, edad, provider: 'manual' };
    users.push(newUser);

    res.status(201).json({ success: true, message: "Usuario registrado con éxito." });
});

// ─── 2. AUTENTICACIÓN MANUAL: LOGIN ─────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ success: false, message: "Credenciales incorrectas o usuario no registrado." });
    }

    // Generar Token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
});

// ─── 3. FLUJO DE GOOGLE (LOGIN Y REGISTER) ──────────────────────────────────
app.post('/api/auth/google', async (req, res) => {
    const { email, tokenGoogle, mode } = req.body;

    try {
        // Verificar de forma segura que el token enviado desde el frontend es real y legítimo de Google
        const ticket = await client.verifyIdToken({
            audience: process.env.GOOGLE_CLIENT_ID,
            idToken: tokenGoogle,
        });
        const payload = ticket.getPayload();
        
        if (payload.email !== email) {
            return res.status(400).json({ success: false, message: "El correo no coincide con el token de Google." });
        }

        const userExists = users.find(u => u.email === email);

        // CASO A: El usuario intenta REGISTRARSE
        if (mode === 'register') {
            if (userExists) {
                return res.status(409).json({ 
                    success: false, 
                    message: "ya existe esta cuenta. Por favor, inicia sesión.",
                    isNewUser: false 
                });
            }

            // Si no existe, lo creamos
            const newUser = {
                id: Date.now(),
                email,
                name: payload.given_name || "Usuario",
                apellido: payload.family_name || "Google",
                edad: "No especificada",
                provider: 'google'
            };
            users.push(newUser);
            
            const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
            return res.status(201).json({ success: true, token, user: { id: newUser.id, email: newUser.email }, isNewUser: true });
        }

        // CASO B: El usuario intenta INICIAR SESIÓN (Login)
        if (mode === 'login') {
            if (!userExists) {
                return res.status(404).json({ success: false, message: "Tu cuenta de Google no está registrada en nuestra plataforma. Regístrate primero." });
            }

            const token = jwt.sign({ id: userExists.id, email: userExists.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
            return res.json({ success: true, token, user: { id: userExists.id, name: userExists.name, email: userExists.email } });
        }

    } catch (error) {
        console.error("Error validando token de Google:", error);
        res.status(500).json({ success: false, message: "Error interno al verificar con Google." });
    }
});

// ─── 4. ENDPOINTS DE PAYPAL (CREAR Y CAPTURAR ORDENES CORREGIDOS) ──────────────────────────

// Endpoint para decirle a PayPal cuánto cobrar y obtener el Order ID
app.post('/api/paypal/create-order', async (req, res) => {
    try {
        const { totalUSD, totalCLP, cartItems } = req.body; 

        if (!totalUSD) {
            return res.status(400).json({ success: false, message: "Falta el monto total en USD." });
        }

        // SOLUCIÓN A ERRORES DE DECIMALES: Forzamos a que siempre tenga exactamente 2 decimales string (ej: "13.67")
        // JavaScript flotante puede enviar números largos (ej: 13.6666666) que PayPal rechaza inmediatamente.
        const formattedTotal = Number(totalUSD).toFixed(2);

        const accessToken = await generateAccessToken();
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{
                    amount: {
                        currency_code: "USD",
                        value: formattedTotal
                    },
                    description: "Inscripción Plan - English Mindset"
                }]
            })
        });

        const orderData = await response.json();

        if (!response.ok) {
            console.error("Detalle del error de PayPal:", orderData);
            return res.status(response.status).json({ success: false, message: "Error en la API de PayPal", details: orderData });
        }

        // El frontend necesita recibir estrictamente el ID en la raíz del JSON
        res.status(201).json({ id: orderData.id });
    } catch (error) {
        console.error("Error al crear orden de PayPal:", error);
        res.status(500).json({ success: false, message: "Error al generar la orden en PayPal." });
    }
});

// Endpoint para confirmar que el usuario pagó y guardar la orden en tu backend
app.post('/api/paypal/capture-order', async (req, res) => {
    try {
        const { orderID, cartItems, totalCLP } = req.body; 

        if (!orderID) {
            return res.status(400).json({ success: false, message: "Falta el parámetro orderID en el cuerpo de la petición." });
        }

        const accessToken = await generateAccessToken();
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });

        const captureData = await response.json();

        // MEJORA: PayPal puede devolver errores con estado 200 en la respuesta HTTP pero con detalles de fallo
        if (!response.ok || captureData.error || captureData.details) {
            console.error("Fallo en la captura de PayPal:", captureData);
            return res.status(400).json({ 
                success: false, 
                message: "No se pudo completar la captura del pago.", 
                details: captureData // Le pasamos los detalles (como INSTRUMENT_DECLINED) al frontend
            });
        }

        if (captureData.status === "COMPLETED") {
            // Guardamos la compra de forma exitosa en tu array de órdenes local
            const newOrder = {
                id: `ORD-${Date.now()}`,
                method: "paypal",
                reference: orderID, 
                cartItems: cartItems || [],
                total: totalCLP || 9990, // Guardamos el valor real en pesos chilenos que pagó
                status: 'approved'
            };

            orders.push(newOrder);
            console.log("✅ Pago de PayPal aprobado y guardado en memoria:", newOrder);

            return res.status(200).json({ 
                success: true, 
                message: "¡Pago procesado y verificado con éxito!",
                details: captureData 
            });
        } else {
            return res.status(400).json({ success: false, message: `El pago quedó en estado: ${captureData.status}` });
        }
    } catch (error) {
        console.error("Error al capturar orden de PayPal:", error);
        res.status(500).json({ success: false, message: "Error interno al capturar el pago." });
    }
});

// ─── 5. ENDPOINTS DEL CARRITO (OTROS MÉTODOS MANUALES) ───────────────────────
app.post('/api/orders/checkout', (req, res) => {
    const { method, reference, cartItems, total } = req.body;

    const newOrder = {
        id: `ORD-${Date.now()}`,
        method,         // "transferencia" o "crypto"
        reference,      // Aquí llegará el TxID o datos de referencia
        cartItems,
        total,
        status: 'pending'
    };

    orders.push(newOrder);
    console.log("Nueva orden recibida en el backend:", newOrder);

    res.json({ success: true, message: "Comprobante recibido de forma exitosa en el servidor." });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});