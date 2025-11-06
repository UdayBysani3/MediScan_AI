const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ======================
// Rate Limiting
// ======================
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        success: false,
        message: 'Too many OTP requests. Please try again later.'
    }
});

// ======================
// Middleware
// ======================
app.use(cors({
    origin: ['http://127.0.0.1:5000', 'http://127.0.0.1:5173', 'http://localhost:5000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept']
}));
app.use(express.json());

// ======================
// Twilio Setup
// ======================
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

let client = null;

if (accountSid && authToken && twilioPhone) {
    client = twilio(accountSid, authToken);
    console.log("✅ Twilio client initialized.");
} else {
    console.warn("⚠️ Twilio credentials not found. Running in development mode (OTP shown in console).");
}

// In-memory OTP store
const otpStore = {};

// ======================
// Routes
// ======================

app.post('/send-otp', otpLimiter, async (req, res) => {
    try {
        const { mobile } = req.body;

        // Validate Indian mobile number
        if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 10-digit mobile number starting with 6-9'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 5 * 60 * 1000; // 5 min
        const fullMobile = `+91${mobile}`;

        otpStore[mobile] = { otp, expiry };

        if (client) {
            // Send SMS using Twilio
            await client.messages.create({
                body: `Your MediScan OTP is: ${otp}`,
                from: twilioPhone,
                to: fullMobile
            });

            console.log(`📤 OTP ${otp} sent to ${fullMobile}`);
            return res.status(200).json({ success: true, message: 'OTP sent successfully.' });
        } else {
            // Development mode fallback
            console.log(`\n============ Development OTP ============`);
            console.log(`OTP for ${fullMobile}: ${otp}`);
            console.log(`=========================================\n`);
            return res.status(200).json({
                success: true,
                message: 'OTP sent successfully (Development Mode)'
            });
        }
    } catch (error) {
        console.error("❌ Error sending OTP:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP.',
            error: error.message
        });
    }
});

app.post('/verify-otp', (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ success: false, message: 'Mobile and OTP are required.' });
    }

    const record = otpStore[mobile];

    if (!record) {
        return res.status(400).json({ success: false, message: 'OTP not found. Please request a new one.' });
    }

    if (Date.now() > record.expiry) {
        delete otpStore[mobile];
        return res.status(400).json({ success: false, message: 'OTP has expired.' });
    }

    if (record.otp === otp) {
        delete otpStore[mobile];
        return res.status(200).json({ success: true, message: 'OTP verified successfully.' });
    } else {
        return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
});

// ======================
// Start Server
// ======================
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`🚀 OTP server running at http://localhost:${PORT}`);
});
