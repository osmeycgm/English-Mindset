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
    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
    next();
});

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

    const newUser = { 
        id: Date.now(), email, password, name, apellido, edad, 
        provider: 'manual', 
        hasActivePlan: false 
    };
    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

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
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    res.json({ 
        success: true, 
        user: { 
            id: user.id, email: user.email, 
            name: user.name, apellido: user.apellido,
            hasActivePlan: user.hasActivePlan 
        } 
    });
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
            const user = users.find(u => u.id === req.user.id);
            if (user) {
                user.hasActivePlan = true;
                console.log(`✅ Plan activado automáticamente por PayPal para: ${user.email}`);
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
app.post('/api/orders/transferencia', verificarToken, upload.single('comprobante'), async (req, res) => {
    if (!mailTransporter) return res.status(500).json({ success: false, message: 'Servidor de correo no configurado.' });
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'Se requiere comprobante adjunto.' });

    const { serviceName, servicePrice, total, cartItems, userEmail, userId } = req.body;
    const clientEmail = userEmail || req.user?.email || 'No disponible';
    const clientId = userId || req.user?.id || 'No disponible';
    let parsedCartItems = [];
    try { parsedCartItems = cartItems ? JSON.parse(cartItems) : []; } catch { parsedCartItems = []; }

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    
    const tokenActivar = jwt.sign({ userId: clientId, email: clientEmail, action: 'activate' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const tokenDesactivar = jwt.sign({ userId: clientId, email: clientEmail, action: 'deactivate' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const urlActivar = `${baseUrl}/api/admin/change-status?token=${tokenActivar}`;
    const urlDesactivar = `${baseUrl}/api/admin/change-status?token=${tokenDesactivar}`;

    try {
        await mailTransporter.sendMail({
            from: SMTP_USER, to: NOTIFICATION_EMAIL,
            subject: `Nueva transferencia: ${serviceName || 'Servicio'}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px;">
                    <h2 style="color: #0f172a;">Comprobante de transferencia recibido</h2>
                    <p><strong>Cliente:</strong> ${clientEmail}</p>
                    <p><strong>ID Cliente:</strong> ${clientId}</p>
                    <p><strong>Servicio:</strong> ${serviceName || 'No especificado'}</p>
                    <p><strong>Total:</strong> $${total}</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <h3 style="color: #334155;">Acciones de Administrador:</h3>
                    <p style="font-size: 14px; color: #64748b;">Selecciona una opción para actualizar inmediatamente el acceso del cliente:</p>
                    <div style="margin-top: 20px;">
                        <a href="${urlActivar}" style="background-color: #22c55e; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 12px;">
                            ✅ Aprobar y Activar Plan
                        </a>
                        <a href="${urlDesactivar}" style="background-color: #ef4444; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            🚫 Marcar Moroso / Desactivar
                        </a>
                    </div>
                </div>
            `,
            attachments: [{ filename: file.originalname, content: file.buffer }]
        });
        orders.push({ id: `ORD-${Date.now()}`, method: 'transferencia', reference: file.originalname, cartItems: parsedCartItems, total, status: 'pending', userEmail: clientEmail });
        console.log('✅ Transferencia recibida e email enviado con botones a:', clientEmail);
        res.json({ success: true, message: 'Comprobante enviado correctamente.' });
    } catch (error) {
        console.error("Error al enviar correo de transferencia:", error);
        res.status(500).json({ success: false, message: 'No se pudo enviar el correo.' });
    }
});

// ─── 7. CRYPTO ────────────────────────────────────────────────────────────────
app.post('/api/orders/crypto', verificarToken, async (req, res) => {
    if (!mailTransporter) return res.status(500).json({ success: false, message: 'Servidor de correo no configurado.' });
    const { txId, total, cartItems } = req.body;
    if (!txId) return res.status(400).json({ success: false, message: 'El TxID es obligatorio.' });

    const clientEmail = req.user?.email || 'No disponible';
    const clientId = req.user?.id || 'No disponible';
    const totalUSDT = total ? (total / 950).toFixed(2) : '0.00';

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const tokenActivar = jwt.sign({ userId: clientId, email: clientEmail, action: 'activate' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const tokenDesactivar = jwt.sign({ userId: clientId, email: clientEmail, action: 'deactivate' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const urlActivar = `${baseUrl}/api/admin/change-status?token=${tokenActivar}`;
    const urlDesactivar = `${baseUrl}/api/admin/change-status?token=${tokenDesactivar}`;

    try {
        await mailTransporter.sendMail({
            from: SMTP_USER, to: NOTIFICATION_EMAIL,
            subject: `Pago Cripto recibido - English Mindset`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px;">
                    <h2 style="color: #0f172a;">Pago con Criptomonedas recibido</h2>
                    <p><strong>Cliente:</strong> ${clientEmail}</p>
                    <p><strong>ID Cliente:</strong> ${clientId}</p>
                    <p><strong>TxID:</strong> ${txId}</p>
                    <p><strong>Monto:</strong> $${totalUSDT} USDT ($${total} CLP)</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <h3 style="color: #334155;">Acciones de Administrador:</h3>
                    <div style="margin-top: 20px;">
                        <a href="${urlActivar}" style="background-color: #22c55e; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 12px;">
                            ✅ Aprobar y Activar Plan
                        </a>
                        <a href="${urlDesactivar}" style="background-color: #ef4444; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            🚫 Marcar Moroso / Desactivar
                        </a>
                    </div>
                </div>
            `
        });
        orders.push({ id: `ORD-${Date.now()}`, method: 'crypto', reference: txId, cartItems: cartItems || [], total, status: 'pending', userEmail: clientEmail });
        console.log('✅ Pago Cripto recibido e email enviado a:', clientEmail);
        res.json({ success: true, message: 'Notificación enviada correctamente.' });
    } catch (error) {
        console.error("Error al enviar correo de cripto:", error);
        res.status(500).json({ success: false, message: 'No se pudo enviar la notificación.' });
    }
});

// ─── 8. ADMIN: CAMBIAR ESTADO DESDE CORREO ────────────────────────────────────
app.get('/api/admin/change-status', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send('<h1 style="color:red; font-family:sans-serif; text-align:center; margin-top:50px;">Error: Token no proporcionado.</h1>');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId, email, action } = decoded;

        // NUEVO: Buscar usuario ignorando mayúsculas y minúsculas
        const user = users.find(u => 
            u.id === userId || 
            (u.email && email && u.email.toLowerCase() === email.toLowerCase())
        );

        if (!user) {
            return res.status(404).send(`
                <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h1 style="color: #ef4444;">Usuario no encontrado</h1>
                    <p>No se encontró un usuario registrado que coincida con este enlace.</p>
                </div>
            `);
        }

        const isActivating = action === 'activate';
        user.hasActivePlan = isActivating;

        console.log(`⚙️ ADMIN ACTION: ${user.email} -> hasActivePlan = ${isActivating}`);

        if (isActivating && mailTransporter) {
            try {
                const FRONTEND_URL = process.env.FRONTEND_URL || "https://osmeycgm.github.io/English-Mindset";

                await mailTransporter.sendMail({
                    from: `"English Mindset" <${SMTP_USER}>`,
                    to: user.email,
                    subject: "🎉 ¡Tu plan ha sido activado con éxito!",
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #16a34a;">¡Bienvenido a English Mindset!</h2>
                            <p>Hola <strong>${user.name || ''}</strong>,</p>
                            <p>Nos alegra informarte que tu pago ha sido verificado y <strong>tu plan ya se encuentra ACTIVO</strong>.</p>
                            <p>Ya puedes acceder a todo el contenido exclusivo en nuestra plataforma.</p>
                            <a href="https://osmeycgm.github.io/English-Mindset/#/traininghub" style="background: #2563eb; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px;">
                                Ir al Training Hub
                            </a>
                        </div>
                    `
                });
            } catch (error) {
                console.error("Error al enviar correo de activación:", error);
                return res.status(500).send(`
                    <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px; padding: 20px;">
                        <h1 style="color: #ef4444;">Error enviando correo</h1>
                        <p>Ocurrió un problema al intentar enviar el correo de activación. Intenta de nuevo más tarde.</p>
                    </div>
                `);
            }
        }

        return res.send(`
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px; padding: 20px;">
                <h1 style="color: ${isActivating ? '#22c55e' : '#ef4444'}; font-size: 32px;">
                    ${isActivating ? '¡Plan Activado con Éxito!' : '¡Plan Desactivado / Usuario Suspendido!'}
                </h1>
                <p style="font-size: 18px; color: #334155;">
                    El estado del plan para <strong>${user.email}</strong> ahora es: 
                    <strong style="color: ${isActivating ? '#22c55e' : '#ef4444'};">
                        ${isActivating ? 'ACTIVO' : 'INACTIVO / MOROSO'}
                    </strong>.
                </p>
                <p style="color: #64748b; margin-top: 30px;">Puedes cerrar esta pestaña de forma segura.</p>
            </div>
        `);
    } catch (error) {
        console.error("Error al procesar acción de admin:", error);
        res.status(401).send(`
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px; padding: 20px;">
                <h1 style="color: #ef4444;">Enlace inválido o expirado</h1>
                <p>Este enlace ya expiró (validez de 7 días) o no coincide con la firma de seguridad.</p>
            </div>
        `);
    }
});

// ─── 9. ADMIN: ACTIVAR PLAN MANUAL ───────────────────────────────────────────
app.post('/api/admin/activate-user', (req, res) => {
    const { email, adminSecret } = req.body;
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ success: false, message: "Acceso denegado." });
    }
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    user.hasActivePlan = true;
    console.log(`✅ Plan activado manualmente para: ${email}`);
    res.json({ success: true, message: `Plan activado para ${email}.` });
});

// ─── 10. ADMIN: VER USUARIOS ──────────────────────────────────────────────────
app.get('/api/admin/users', (req, res) => {
    const { adminSecret } = req.query;
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ success: false, message: "Acceso denegado." });
    }
    res.json({ success: true, users: users.map(u => ({ 
        id: u.id, email: u.email, name: u.name, hasActivePlan: u.hasActivePlan, provider: u.provider
    }))});
});
// ─── 11. RECUPERACIÓN DE CONTRASEÑA ───────────────────────────────────────────

// Endpoint A: Solicitar enlace de recuperación por correo
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "El correo electrónico es obligatorio." });
    }

    // Buscamos ignorando mayúsculas/minúsculas
    const user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        return res.status(404).json({ success: false, message: "No existe ninguna cuenta registrada con este correo." });
    }

    if (user.provider === 'google') {
        return res.status(400).json({ 
            success: false, 
            message: "Esta cuenta se registró utilizando Google. Por favor, inicia sesión con el botón de Google." 
        });
    }

    // Generar Token JWT válido por 1 hora
    const resetToken = jwt.sign(
        { userId: user.id, email: user.email, action: 'reset_password' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // URL base del frontend
    const frontendUrl = process.env.FRONTEND_URL || 'https://osmeycgm.github.io/English-Mindset';
    const resetLink = `${frontendUrl}/#/reset-password?token=${resetToken}`;

    if (!mailTransporter) {
        return res.status(500).json({ success: false, message: "El servicio de correos no está disponible en el servidor." });
    }

    try {
        await mailTransporter.sendMail({
            from: `"English Mindset" <${SMTP_USER}>`,
            to: user.email,
            subject: "🔑 Restablecer tu contraseña - English Mindset",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 25px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; margin: 0 auto;">
                    <h2 style="color: #1e3a8a; margin-top: 0;">Restablecimiento de Contraseña</h2>
                    <p>Hola <strong>${user.name || 'Estudiante'}</strong>,</p>
                    <p>Recibimos una solicitud para cambiar la contraseña asociada a tu cuenta en <strong>English Mindset</strong>.</p>
                    <p>Haz clic en el siguiente botón para crear tu nueva contraseña. Este enlace expira en <strong>1 hora</strong>:</p>
                    
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${resetLink}" 
                           style="background-color: #1e3a8a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(30, 58, 138, 0.2);">
                            Crear Nueva Contraseña
                        </a>
                    </div>
                    
                    <p style="font-size: 0.85rem; color: #64748b; line-height: 1.5;">
                        Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura. Tu contraseña actual no cambiará.
                    </p>
                </div>
            `
        });

        console.log(`✉️ Correo de recuperación enviado a: ${user.email}`);
        res.json({ success: true, message: "Hemos enviado las instrucciones a tu correo electrónico." });
    } catch (error) {
        console.error("Error al enviar correo de recuperación:", error);
        res.status(500).json({ success: false, message: "Ocurrió un error al intentar enviar el correo." });
    }
});

// Endpoint B: Procesar la nueva contraseña con el token
app.post('/api/auth/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "La nueva contraseña debe tener al menos 6 caracteres." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.action !== 'reset_password') {
            return res.status(400).json({ success: false, message: "Token o acción no válida." });
        }

        const user = users.find(u => u.id === decoded.userId || (u.email && u.email.toLowerCase() === decoded.email.toLowerCase()));

        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado." });
        }

        // Actualizamos la contraseña
        user.password = newPassword;
        console.log(`🔑 Contraseña actualizada exitosamente para: ${user.email}`);

        res.json({ success: true, message: "Tu contraseña ha sido restablecida con éxito." });
    } catch (error) {
        console.error("Error al restablecer contraseña:", error);
        res.status(401).json({ success: false, message: "El enlace es inválido o ha expirado (validez de 1 hora)." });
    }
});
// ─── INICIAR SERVIDOR ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});