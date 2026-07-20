import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import multer from 'multer';

dotenv.config();

console.log('DEBUG: backend server starting');
console.log('DEBUG: process.cwd()', process.cwd());
console.log('DEBUG: module URL', import.meta.url);
console.log('DEBUG: PAYPAL_CLIENT_ID present', !!process.env.PAYPAL_CLIENT_ID);
console.log('DEBUG: JWT_SECRET present', !!process.env.JWT_SECRET);

// Ensure `fetch` is available in Node.js environments that don't provide it
(async () => {
    if (typeof fetch === 'undefined') {
        try {
            const fetchModule = await import('node-fetch');
            globalThis.fetch = fetchModule.default;
            console.log('DEBUG: polyfilled global.fetch with node-fetch');
        } catch (err) {
            console.error('ERROR: Failed to polyfill fetch. Install node-fetch or use Node 18+.', err);
        }
    } else {
        console.log('DEBUG: global.fetch is available');
    }
})();

const app = express();
const PORT = process.env.PORT || 5000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'osmey009@gmail.com';

let mailTransporter;
if (SMTP_USER && SMTP_PASS) {
    mailTransporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });
} else {
    console.warn('WARNING: SMTP_USER o SMTP_PASS no están definidos en el .env. No se podrá enviar correo.');
}

// ─── CONFIGURACIÓN DE CORS CORREGIDA ─────────────────────────────────────────
// Se incluyó el dominio de GitHub Pages para permitir peticiones en producción
app.use(cors({
    origin: [
        'https://osmeycgm.github.io', // Tu Frontend en producción
        'http://localhost:5173',      // Entorno de desarrollo local
        'http://127.0.0.1:5173',    // Entorno de desarrollo local alternativo
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log('DEBUG REQUEST:', req.method, req.path);
    next();
});

// Middleware para verificar JWT en rutas privadas
function verificarToken(req, res, next) {
    const authHeader = req.headers?.authorization;
    console.log('DEBUG verifyToken authHeader:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Token de autorización faltante o inválido.' });
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET no está definido en el .env');
        return res.status(500).json({ success: false, message: 'Configuración del servidor incompleta.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('DEBUG verifyToken decoded:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verificando token JWT:', error);
        return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
    }
}

// Base de datos temporal en memoria (un array de objetos)
const users = [];
const orders = [];

// ─── CONFIGURACIÓN DE PAYPAL ──────────────────────────────────────────────────
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Entorno Sandbox (Pruebas)

// Show a masked client id for debugging (won't print the secret)
if (PAYPAL_CLIENT_ID) {
    const id = PAYPAL_CLIENT_ID.trim();
    const masked = `${id.slice(0,6)}...${id.slice(-4)}`;
    console.log('DEBUG: PAYPAL_CLIENT_ID (masked):', masked);
}

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

    if (!response.ok) {
        console.error("Error autenticando contra PayPal:", response.status, data);
        throw new Error("No se pudo obtener el token de acceso de PayPal. Revisa tus credenciales de sandbox.");
    }

    if (!data.access_token) {
        console.error("PayPal no devolvió access_token:", data);
        throw new Error("PayPal no devolvió un access_token válido.");
    }

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

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(201).json({ success: true, message: "Usuario registrado con éxito.", token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
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

// ─── 4. ENDPOINTS DE PAYPAL ──────────────────────────────────────────────────
app.post('/api/paypal/create-order', async (req, res) => {
    console.log('PayPal create-order request auth header:', req.headers.authorization);
    try {
        const { totalUSD, totalCLP, cartItems } = req.body; 

        if (!totalUSD) {
            return res.status(400).json({ success: false, message: "Falta el monto total en USD." });
        }

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

        res.status(201).json({ id: orderData.id });
    } catch (error) {
        console.error("Error al crear orden de PayPal:", error);
        res.status(500).json({ success: false, message: "Error al generar la orden en PayPal." });
    }
});

app.post('/api/paypal/capture-order', verificarToken, async (req, res) => {
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

        if (!response.ok || captureData.error || captureData.details) {
            console.error("Fallo en la captura de PayPal:", captureData);
            return res.status(400).json({ 
                success: false, 
                message: "No se pudo completar la captura del pago.", 
                details: captureData 
            });
        }

        if (captureData.status === "COMPLETED") {
            const newOrder = {
                id: `ORD-${Date.now()}`,
                method: "paypal",
                reference: orderID, 
                cartItems: cartItems || [],
                total: totalCLP || 9990,
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

// ─── 5. ENDPOINTS DEL CARRITO Y TRANSFERENCIAS ───────────────────────────────
app.post('/api/orders/checkout', (req, res) => {
    const { method, reference, cartItems, total } = req.body;

    const newOrder = {
        id: `ORD-${Date.now()}`,
        method,         
        reference,      
        cartItems,
        total,
        status: 'pending'
    };

    orders.push(newOrder);
    console.log("Nueva orden recibida en el backend:", newOrder);

    res.json({ success: true, message: "Comprobante recibido de forma exitosa en el servidor." });
});

app.post('/api/orders/transferencia', verificarToken, upload.single('comprobante'), async (req, res) => {
    if (!mailTransporter) {
        return res.status(500).json({ success: false, message: 'El servidor de correo no está configurado.' });
    }

    const file = req.file;
    const { serviceName, servicePrice, total, cartItems, userEmail, userId } = req.body;

    if (!file) {
        return res.status(400).json({ success: false, message: 'Se requiere un comprobante de pago adjunto.' });
    }

    const clientEmail = userEmail || req.user?.email || 'No disponible';
    const clientId = userId || req.user?.id || 'No disponible';
    let parsedCartItems = [];

    try {
        parsedCartItems = cartItems ? JSON.parse(cartItems) : [];
    } catch (error) {
        parsedCartItems = [];
    }

    const subject = `Nueva transferencia recibida: ${serviceName || 'Servicio sin nombre'}`;
    const html = `
        <h2>Nuevo comprobante de transferencia</h2>
        <p><strong>Cliente:</strong> ${clientEmail}</p>
        <p><strong>ID de cliente:</strong> ${clientId}</p>
        <p><strong>Servicio comprado:</strong> ${serviceName || 'No especificado'}</p>
        <p><strong>Monto total:</strong> ${total || 'No especificado'}</p>
        <p><strong>Precio del servicio:</strong> ${servicePrice || 'No especificado'}</p>
        <p><strong>Carrito:</strong></p>
        <pre>${JSON.stringify(parsedCartItems, null, 2)}</pre>
        <p>Adjunto se incluye la captura de pago enviada por el cliente.</p>
    `;

    const mailOptions = {
        from: SMTP_USER,
        to: NOTIFICATION_EMAIL,
        subject,
        html,
        attachments: [
            {
                filename: file.originalname,
                content: file.buffer
            }
        ]
    };

    try {
        await mailTransporter.sendMail(mailOptions);

        const newOrder = {
            id: `ORD-${Date.now()}`,
            method: 'transferencia',
            reference: file.originalname,
            cartItems: parsedCartItems,
            total,
            status: 'pending',
            userEmail: clientEmail,
            userId: clientId,
            serviceName: serviceName || 'No especificado'
        };

        orders.push(newOrder);
        console.log('✅ Transferencia recibida y correo enviado:', newOrder);

        res.json({ success: true, message: 'Comprobante enviado por correo correctamente.' });
    } catch (error) {
        console.error('Error enviando correo de transferencia:', error);
        res.status(500).json({ success: false, message: 'No se pudo enviar el correo con el comprobante.' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});