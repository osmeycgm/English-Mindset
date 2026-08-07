import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import multer from 'multer';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // 🟢 Importación de Bcrypt

dotenv.config();

console.log('DEBUG: backend server starting');
console.log('DEBUG: process.cwd()', process.cwd());
console.log('DEBUG: module URL', import.meta.url);
console.log('DEBUG: PAYPAL_CLIENT_ID present', !!process.env.PAYPAL_CLIENT_ID);
console.log('DEBUG: JWT_SECRET present', !!process.env.JWT_SECRET);
console.log('DEBUG: MONGO_URI present', !!process.env.MONGO_URI);

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

// ─── 🟢 CONEXIÓN A MONGODB ATLAS ───────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 Conectado exitosamente a MongoDB Atlas'))
  .catch((err) => console.error('🔴 Error al conectar con MongoDB:', err));

// ─── 🟢 ESQUEMA Y MODELO DE USUARIO ───────────────────────────────────────────
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String }, // Guardará el Hash de bcrypt (manual) o estará vacío (Google)
    name: { type: String, required: true },
    apellido: { type: String },
    edad: { type: String },
    provider: { type: String, default: 'manual' },
    hasActivePlan: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
// ──────────────────────────────────────────────────────────────────────────────

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

// ─── 1. REGISTRO (CON BCRYPT) ──────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, apellido, edad } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "Faltan campos obligatorios." });
        }
        
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ success: false, message: "El correo ya está registrado." });
        }

        // 🟢 Encriptar la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            email: email.toLowerCase(), 
            password: hashedPassword, 
            name, 
            apellido, 
            edad, 
            provider: 'manual', 
            hasActivePlan: false 
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ 
            success: true, 
            message: "Usuario registrado con éxito.", 
            token, 
            user: { 
                id: newUser._id, 
                name: newUser.name, 
                apellido: newUser.apellido,
                email: newUser.email, 
                hasActivePlan: newUser.hasActivePlan 
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al registrar en la base de datos." });
    }
});

// ─── 2. LOGIN (CON BCRYPT) ────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Buscar únicamente por email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user || !user.password) {
            return res.status(401).json({ success: false, message: "Credenciales incorrectas o usuario no registrado." });
        }
        
        // 🟢 Comparar la contraseña ingresada con el hash de la base de datos
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Credenciales incorrectas." });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            success: true, 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                apellido: user.apellido,
                email: user.email, 
                hasActivePlan: user.hasActivePlan 
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al iniciar sesión." });
    }
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
        
        if (payload.email.toLowerCase() !== email.toLowerCase()) {
            return res.status(400).json({ success: false, message: "El correo no coincide con el token de Google." });
        }
        
        const userExists = await User.findOne({ email: email.toLowerCase() });

        if (mode === 'register') {
            if (userExists) {
                return res.status(409).json({ success: false, message: "Ya existe esta cuenta. Por favor, inicia sesión.", isNewUser: false });
            }
            
            const newUser = new User({
                email: email.toLowerCase(),
                name: payload.given_name || "Usuario",
                apellido: payload.family_name || "Google",
                edad: "No especificada",
                provider: 'google',
                hasActivePlan: false
            });
            await newUser.save();
            
            const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.status(201).json({ 
                success: true, token, 
                user: { id: newUser._id, email: newUser.email, name: newUser.name, apellido: newUser.apellido, hasActivePlan: newUser.hasActivePlan }, 
                isNewUser: true 
            });
        }

        if (mode === 'login') {
            if (!userExists) {
                return res.status(404).json({ success: false, message: "Tu cuenta de Google no está registrada. Regístrate primero." });
            }
            const token = jwt.sign({ id: userExists._id, email: userExists.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.json({ 
                success: true, token, 
                user: { id: userExists._id, name: userExists.name, apellido: userExists.apellido, email: userExists.email, hasActivePlan: userExists.hasActivePlan } 
            });
        }
    } catch (error) {
        console.error("Error validando token de Google:", error);
        res.status(500).json({ success: false, message: "Error interno al verificar con Google." });
    }
});

// ─── 4. PERFIL AUTENTICADO ────────────────────────────────────────────────────
app.get('/api/auth/me', verificarToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.json({ 
                success: true, 
                user: { 
                    id: req.user.id, 
                    email: req.user.email,
                    hasActivePlan: false,
                    fromToken: true
                } 
            });
        }
        
        res.json({ 
            success: true, 
            user: { 
                id: user._id, 
                email: user.email, 
                name: user.name, 
                apellido: user.apellido,
                hasActivePlan: user.hasActivePlan 
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error de servidor al obtener el perfil." });
    }
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
            const user = await User.findById(req.user.id);
            if (user) {
                user.hasActivePlan = true;
                await user.save();
                console.log(`✅ Plan activado automáticamente por PayPal en BD para: ${user.email}`);
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

    const { serviceName, total, cartItems, userEmail, userId } = req.body;
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
        return res.status(400).send('<h1 style="color:red; text-align:center;">Error: Token no proporcionado.</h1>');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId, email, action } = decoded;

        let user = null;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            try { user = await User.findById(userId); } catch(e) {}
        }
        if (!user && email) {
            user = await User.findOne({ email: email.toLowerCase() });
        }

        if (!user) {
            return res.status(404).send('<h1 style="color:red; text-align:center;">Usuario no encontrado en BD.</h1>');
        }

        const isActivating = action === 'activate';
        user.hasActivePlan = isActivating;
        await user.save();

        if (isActivating && mailTransporter) {
            try {
                await mailTransporter.sendMail({
                    from: `"English Mindset" <${SMTP_USER}>`,
                    to: user.email,
                    subject: "🎉 ¡Tu plan ha sido activado con éxito!",
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #16a34a;">¡Bienvenido a English Mindset!</h2>
                            <p>Hola <strong>${user.name || ''}</strong>,</p>
                            <p>Tu plan ya se encuentra <strong>ACTIVO</strong>.</p>
                            <a href="https://osmeycgm.github.io/English-Mindset/#/traininghub" style="background: #2563eb; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
                                Ir al Training Hub
                            </a>
                        </div>
                    `
                });
            } catch (error) {
                console.error("Error al enviar correo de activación:", error);
            }
        }

        return res.send(`
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                <h1 style="color: ${isActivating ? '#22c55e' : '#ef4444'};">
                    ${isActivating ? '¡Plan Activado con Éxito!' : '¡Plan Desactivado!'}
                </h1>
                <p>El estado del plan para <strong>${user.email}</strong> es ahora: <strong>${isActivating ? 'ACTIVO' : 'INACTIVO'}</strong>.</p>
            </div>
        `);
    } catch (error) {
        res.status(401).send('<h1 style="color:red; text-align:center;">Enlace inválido o expirado.</h1>');
    }
});

// ─── 9. RECUPERACIÓN Y RESET DE CONTRASEÑA (CON BCRYPT) ───────────────────────
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "El correo electrónico es obligatorio." });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "No existe ninguna cuenta registrada con este correo." });

        if (user.provider === 'google') {
            return res.status(400).json({ success: false, message: "Esta cuenta fue creada con Google. Inicia sesión directamente con Google." });
        }

        const resetToken = jwt.sign(
            { userId: user._id, email: user.email, action: 'reset_password' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const frontendUrl = process.env.FRONTEND_URL || 'https://osmeycgm.github.io/English-Mindset';
        const resetLink = `${frontendUrl}/#/reset-password?token=${resetToken}`;

        if (!mailTransporter) return res.status(500).json({ success: false, message: "Servicio de correos no disponible." });

        await mailTransporter.sendMail({
            from: `"English Mindset" <${SMTP_USER}>`,
            to: user.email,
            subject: "🔑 Restablecer tu contraseña - English Mindset",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 25px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; margin: 0 auto;">
                    <h2 style="color: #1e3a8a;">Restablecimiento de Contraseña</h2>
                    <p>Hola <strong>${user.name || 'Estudiante'}</strong>,</p>
                    <p>Haz clic en el siguiente enlace para crear tu nueva contraseña (expira en 1 hora):</p>
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${resetLink}" style="background-color: #1e3a8a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                            Crear Nueva Contraseña
                        </a>
                    </div>
                </div>
            `
        });

        res.json({ success: true, message: "Hemos enviado las instrucciones a tu correo electrónico." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Ocurrió un error al intentar enviar el correo." });
    }
});

app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
        if (newPassword.length < 6) return res.status(400).json({ success: false, message: "La contraseña debe tener al menos 6 caracteres." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.action !== 'reset_password') {
            return res.status(400).json({ success: false, message: "Acción no válida para este token." });
        }

        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado." });

        // 🟢 Encriptar la nueva contraseña con bcrypt antes de guardar
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ success: true, message: "Contraseña actualizada con éxito. Ya puedes iniciar sesión." });
    } catch (error) {
        res.status(400).json({ success: false, message: "El enlace es inválido o ha expirado." });
    }
});

// ─── INICIO DEL SERVIDOR ──────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});