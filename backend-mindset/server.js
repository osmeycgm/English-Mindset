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

(async () => {
    if (typeof fetch === 'undefined') {
        try {
            const fetchModule = await import('node-fetch');
            globalThis.fetch = fetchModule.default;
            console.log('DEBUG: polyfilled global.fetch with node-fetch');
        } catch (err) {
            console.error('ERROR: Failed to polyfill fetch.', err);
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
        auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
} else {
    console.warn('WARNING: SMTP_USER o SMTP_PASS no están definidos.');
}

app.use(cors({
    origin: [
        'https://osmeycgm.github.io',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none")
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none")
    next()
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log('DEBUG REQUEST:', req.method, req.path);
    next();
});

function verificarToken(req, res, next) {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Token faltante o inválido.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
    }
}

const users = [];
const orders = [];

// ─── PAYPAL ───────────────────────────────────────────────────────────────────
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

async function generateAccessToken() {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("Faltan credenciales de PayPal en el .env");
    }
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID.trim()}:${PAYPAL_CLIENT_SECRET.trim()}`).toString("base64");
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" }
    });
    const data = await response.json();
    if (!response.ok || !data.access_token) throw new Error("No se pudo obtener token de PayPal.");
    return data.access_token;
}

// ─── 1. REGISTRO ──────────────────────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
    const { email, password, name, apellido, edad } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: "Faltan campos obligatorios." });
    }
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ success: false, message: "El correo ya está registrado." });
    }

    // ← hasActivePlan agregado
    const newUser = { 
        id: Date.now(), email, password, name, apellido, edad, 
        provider: 'manual', 
        hasActivePlan: false 
    };
    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // ← apellido y hasActivePlan en la respuesta
    res.status(201).json({ 
        success: true, 
        message: "Usuario registrado con éxito.", 
        token, 
        user: { 
            id: newUser.id, 
            name: newUser.name, 
            apellido: newUser.apellido,
            email: newUser.email, 
            hasActivePlan: newUser.hasActivePlan 
        } 
    });
});

// ─── 2. LOGIN ─────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ success: false, message: "Credenciales incorrectas o usuario no registrado." });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // ← apellido y hasActivePlan en la respuesta
    res.json({ 
        success: true, 
        token, 
        user: { 
            id: user.id, 
            name: user.name, 
            apellido: user.apellido,
            email: user.email, 
            hasActivePlan: user.hasActivePlan 
        } 
    });
});

// ─── 3. GOOGLE AUTH ───────────────────────────────────────────────────────────
app.post('/api/auth/google', async (req, res) => {
    const { email, tokenGoogle, mode } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            audience: process.env.GOOGLE_CLIENT_ID,
            idToken: tokenGoogle,
        });
        const payload = ticket.getPayload();
        if (payload.email !== email) {
            return res.status(400).json({ success: false, message: "El correo no coincide con el token de Google." });
        }
        const userExists = users.find(u => u.email === email);

        if (mode === 'register') {
            if (userExists) {
                return res.status(409).json({ success: false, message: "ya existe esta cuenta. Por favor, inicia sesión.", isNewUser: false });
            }
            // ← hasActivePlan agregado
            const newUser = {
                id: Date.now(), email,
                name: payload.given_name || "Usuario",
                apellido: payload.family_name || "Google",
                edad: "No especificada",
                provider: 'google',
                hasActivePlan: false
            };
            users.push(newUser);
            const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            // ← hasActivePlan en la respuesta
            return res.status(201).json({ 
                success: true, token, 
                user: { id: newUser.id, email: newUser.email, name: newUser.name, apellido: newUser.apellido, hasActivePlan: newUser.hasActivePlan }, 
                isNewUser: true 
            });
        }

        if (mode === 'login') {
            if (!userExists) {
                return res.status(404).json({ success: false, message: "Tu cuenta de Google no está registrada. Regístrate primero." });
            }
            const token = jwt.sign({ id: userExists.id, email: userExists.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            // ← hasActivePlan en la respuesta
            return res.json({ 
                success: true, token, 
                user: { id: userExists.id, name: userExists.name, apellido: userExists.apellido, email: userExists.email, hasActivePlan: userExists.hasActivePlan } 
            });
        }
    } catch (error) {
        console.error("Error validando token de Google:", error);
        res.status(500).json({ success: false, message: "Error interno al verificar con Google." });
    }
});

// ─── 4. PERFIL AUTENTICADO ────────────────────────────────────────────────────
app.get('/api/auth/me', verificarToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado." })
    res.json({ 
        success: true, 
        user: { 
            id: user.id, email: user.email, 
            name: user.name, apellido: user.apellido,
            hasActivePlan: user.hasActivePlan 
        } 
    })
});

// ─── 5. PAYPAL ENDPOINTS ──────────────────────────────────────────────────────
app.post('/api/paypal/create-order', async (req, res) => {
    try {
        const { totalUSD } = req.body;
        if (!totalUSD) return res.status(400).json({ success: false, message: "Falta el monto en USD." });
        const formattedTotal = Number(totalUSD).toFixed(2);
        const accessToken = await generateAccessToken();
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{ amount: { currency_code: "USD", value: formattedTotal }, description: "Inscripción Plan - English Mindset" }]
            })
        });
        const orderData = await response.json();
        if (!response.ok) return res.status(response.status).json({ success: false, message: "Error en PayPal", details: orderData });
        res.status(201).json({ id: orderData.id });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al generar la orden en PayPal." });
    }
});

app.post('/api/paypal/capture-order', verificarToken, async (req, res) => {
    try {
        const { orderID, cartItems, totalCLP } = req.body;
        if (!orderID) return res.status(400).json({ success: false, message: "Falta orderID." });
        const accessToken = await generateAccessToken();
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }
        });
        const captureData = await response.json();
        if (!response.ok || captureData.error || captureData.details) {
            return res.status(400).json({ success: false, message: "No se pudo capturar el pago.", details: captureData });
        }
        if (captureData.status === "COMPLETED") {

            // ← PayPal activa el plan automáticamente
            const user = users.find(u => u.id === req.user.id)
            if (user) {
                user.hasActivePlan = true
                console.log(`✅ Plan activado automáticamente por PayPal para: ${user.email}`)
            }

            orders.push({ id: `ORD-${Date.now()}`, method: "paypal", reference: orderID, cartItems: cartItems || [], total: totalCLP || 0, status: 'approved' });
            return res.status(200).json({ success: true, message: "¡Pago procesado con éxito!", details: captureData });
        }
        return res.status(400).json({ success: false, message: `El pago quedó en estado: ${captureData.status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error interno al capturar el pago." });
    }
});

// ─── 6. TRANSFERENCIAS ────────────────────────────────────────────────────────
app.post('/api/orders/checkout', (req, res) => {
    const { method, reference, cartItems, total } = req.body;
    orders.push({ id: `ORD-${Date.now()}`, method, reference, cartItems, total, status: 'pending' });
    res.json({ success: true, message: "Comprobante recibido." });
});

app.post('/api/orders/transferencia', verificarToken, upload.single('comprobante'), async (req, res) => {
    if (!mailTransporter) return res.status(500).json({ success: false, message: 'Servidor de correo no configurado.' });
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'Se requiere comprobante adjunto.' });

    const { serviceName, servicePrice, total, cartItems, userEmail, userId } = req.body;
    const clientEmail = userEmail || req.user?.email || 'No disponible';
    const clientId = userId || req.user?.id || 'No disponible';
    let parsedCartItems = [];
    try { parsedCartItems = cartItems ? JSON.parse(cartItems) : []; } catch { parsedCartItems = []; }

    try {
        await mailTransporter.sendMail({
            from: SMTP_USER, to: NOTIFICATION_EMAIL,
            subject: `Nueva transferencia: ${serviceName || 'Servicio'}`,
            html: `<h2>Comprobante de transferencia</h2><p><strong>Cliente:</strong> ${clientEmail}</p><p><strong>Servicio:</strong> ${serviceName}</p><p><strong>Total:</strong> ${total}</p>`,
            attachments: [{ filename: file.originalname, content: file.buffer }]
        });
        orders.push({ id: `ORD-${Date.now()}`, method: 'transferencia', reference: file.originalname, cartItems: parsedCartItems, total, status: 'pending', userEmail: clientEmail });
        console.log('✅ Transferencia recibida:', clientEmail);
        res.json({ success: true, message: 'Comprobante enviado correctamente.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'No se pudo enviar el correo.' });
    }
});

// ─── 7. CRYPTO ────────────────────────────────────────────────────────────────
app.post('/api/orders/crypto', verificarToken, async (req, res) => {
    if (!mailTransporter) return res.status(500).json({ success: false, message: 'Servidor de correo no configurado.' });
    const { txId, total, cartItems } = req.body;
    if (!txId) return res.status(400).json({ success: false, message: 'El TxID es obligatorio.' });

    const clientEmail = req.user?.email || 'No disponible';
    const totalUSDT = total ? (total / 950).toFixed(2) : '0.00';

    try {
        await mailTransporter.sendMail({
            from: SMTP_USER, to: NOTIFICATION_EMAIL,
            subject: `Pago Cripto recibido - English Mindset`,
            html: `<h2>Pago con Criptomonedas</h2><p><strong>Cliente:</strong> ${clientEmail}</p><p><strong>TxID:</strong> ${txId}</p><p><strong>Monto:</strong> $${totalUSDT} USDT</p>`
        });
        orders.push({ id: `ORD-${Date.now()}`, method: 'crypto', reference: txId, cartItems: cartItems || [], total, status: 'pending', userEmail: clientEmail });
        console.log('✅ Pago Cripto recibido:', clientEmail);
        res.json({ success: true, message: 'Notificación enviada correctamente.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'No se pudo enviar la notificación.' });
    }
});

// ─── 8. ADMIN: ACTIVAR PLAN ───────────────────────────────────────────────────
app.post('/api/admin/activate-user', (req, res) => {
    const { email, adminSecret } = req.body
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ success: false, message: "Acceso denegado." })
    }
    const user = users.find(u => u.email === email)
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado." })
    user.hasActivePlan = true
    console.log(`✅ Plan activado manualmente para: ${email}`)
    res.json({ success: true, message: `Plan activado para ${email}.` })
})

// ─── 9. ADMIN: VER USUARIOS ───────────────────────────────────────────────────
app.get('/api/admin/users', (req, res) => {
    const { adminSecret } = req.query
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ success: false, message: "Acceso denegado." })
    }
    res.json({ success: true, users: users.map(u => ({ 
        id: u.id, email: u.email, name: u.name, hasActivePlan: u.hasActivePlan, provider: u.provider
    }))})
})

// ─── INICIAR SERVIDOR ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});