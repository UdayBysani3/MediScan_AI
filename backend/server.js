const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const axios = require('axios');
const Razorpay = require('razorpay');
const FormData = require('form-data');
require('dotenv').config();

const app = express();

// Use specific CORS configuration for security
app.use(cors({
  origin: "http://localhost:5173", // Allow requests only from your frontend
  methods: "GET,POST,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// ===============================================
// 1. UTILITY & CONFIGURATION
// ===============================================

// Password Hashing Utility
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
};

const verifyPassword = (password, hash, salt) => {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

// Rate Limiting for OTPs
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { error: 'Too many OTP requests. Please try again later.' }
});

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
let twilioClient = null;
if (accountSid && authToken && twilioPhone) {
    twilioClient = twilio(accountSid, authToken);
    console.log("✅ Twilio client initialized.");
} else {
    console.warn("⚠️ Twilio credentials not found. OTPs will be shown in the console.");
}

// In-memory store for password reset OTPs
const otpStore = {};

// NEW: Razorpay Setup
const razorpay = new Razorpay({
    key_id: process.env.TEST_KEY_ID,
    key_secret: process.env.TEST_KEY_SECRET,
});

// NEW: Multer setup for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// ===============================================
// 2. MONGODB CONNECTION
// ===============================================

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'mediscan';
let users, activities, analyses;

MongoClient.connect(mongoUri)
  .then((client) => {
    console.log('✅ Connected to MongoDB');
    const db = client.db(dbName);
    users = db.collection('users');
    analyses = db.collection('analyses'); // Collection to store analysis results

    users.createIndex({ mobile: 1 }, { unique: true });

    // ===============================================
    // 3. AUTHENTICATION MIDDLEWARE
    // ===============================================
    const authenticateToken = async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Authentication required.' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
            if (!user) return res.status(404).json({ error: 'User not found.' });
            req.user = user;
            next();
        } catch (error) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
    };

    // ===============================================
    // 4. API ROUTES
    // ===============================================

    // --- User Registration ---
    app.post('/register', async (req, res) => {
      try {
        const { name, mobile, password } = req.body;
        if (!name || !mobile || !password || password.length < 6) {
          return res.status(400).json({ error: 'All fields are required and password must be at least 6 characters.' });
        }
        if (await users.findOne({ mobile })) {
          return res.status(400).json({ error: 'User with this mobile number already exists.' });
        }
        const { salt, hash } = hashPassword(password);
        const newUser = {
          name, mobile, passwordHash: hash, passwordSalt: salt,
          accountType: 'free', analysisCount: 0, maxScans: 5, createdAt: new Date()
        };
        const result = await users.insertOne(newUser);
        const token = jwt.sign({ userId: result.insertedId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
          token,
          user: { id: result.insertedId, name, mobile, accountType: 'free', analysisCount: 0, maxScans: 5 }
        });
      } catch (error) {
        res.status(500).json({ error: 'Registration failed.' });
      }
    });
    // In server.js
// In server.js, add these two routes

// 1. ENDPOINT TO SEND OTP FOR PASSWORD CHANGE
app.post('/send-password-reset-otp', otpLimiter, async (req, res) => {
    const { mobile } = req.body;
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
        return res.status(400).json({ error: 'A valid 10-digit mobile number is required.' });
    }
    try {
        const user = await users.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 5 * 60 * 1000; // 5 minute expiry
        otpStore[mobile] = { otp, expiry };

        if (twilioClient) {
            await twilioClient.messages.create({
                body: `Your MediScan password reset code is: ${otp}`,
                from: twilioPhone,
                to: `+91${mobile}`
            });
        } else {
            console.log(`🔑 PASSWORD RESET OTP for ${mobile}: ${otp}`);
        }
        
        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
});

// 2. ENDPOINT TO VERIFY OTP AND CHANGE PASSWORD
app.post('/reset-password', async (req, res) => {
    const { mobile, otp, newPassword } = req.body;
    if (!mobile || !otp || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'All fields are required and password must be at least 6 characters.' });
    }

    const record = otpStore[mobile];
    if (!record || record.otp !== otp || Date.now() > record.expiry) {
        return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    try {
        const { salt, hash } = hashPassword(newPassword);
        await users.updateOne({ mobile }, { $set: { passwordHash: hash, passwordSalt: salt } });

        delete otpStore[mobile]; // Clean up used OTP

        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset password.' });
    }
});
// NEW ENDPOINT 1: Send OTP for Registration
app.post('/send-registration-otp', otpLimiter, async (req, res) => {
    const { mobile } = req.body;

    // 1. Validate the mobile number format
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
        return res.status(400).json({ error: 'A valid 10-digit mobile number is required.' });
    }

    try {
        // 2. Check if the user ALREADY exists in the database
        const existingUser = await users.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ error: 'A user with this mobile number already exists.' });
        }

        // 3. Generate a 6-digit OTP and set an expiry time (5 minutes)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 5 * 60 * 1000;
        otpStore[mobile] = { otp, expiry };

        // 4. Send the OTP via Twilio (or log to console in dev mode)
        if (twilioClient) {
            await twilioClient.messages.create({
                body: `Your MediScan verification code is: ${otp}`,
                from: twilioPhone,
                to: `+91${mobile}`
            });
            console.log(`📤 Registration OTP sent to +91${mobile}`);
        } else {
            console.log(`🔑 REGISTRATION OTP for ${mobile}: ${otp}`);
        }
        
        // 5. Send a success response to the frontend
        res.status(200).json({ message: 'OTP sent successfully.' });

    } catch (error) {
        console.error('Error sending registration OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }
});


// NEW ENDPOINT 2: Verify OTP and Create the User
app.post('/verify-and-register', async (req, res) => {
    const { name, mobile, password, otp } = req.body;

    // 1. Validate all incoming data
    if (!name || !mobile || !password || !otp) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // 2. Check if the OTP is valid and not expired
    const record = otpStore[mobile];
    if (!record || record.otp !== otp || Date.now() > record.expiry) {
        return res.status(400).json({ error: 'Invalid or expired OTP. Please try again.' });
    }

    try {
        // 3. Hash the password
        const { salt, hash } = hashPassword(password);

        // 4. Create the new user object
        const newUser = {
          name,
          mobile,
          passwordHash: hash,
          passwordSalt: salt,
          accountType: 'free',
          analysisCount: 0,
          maxScans: 5,
          createdAt: new Date()
        };

        // 5. Insert the new user into the database
        const result = await users.insertOne(newUser);

        // 6. Clean up the used OTP
        delete otpStore[mobile];

        // 7. Generate a JWT token to log the user in immediately
        const token = jwt.sign({ userId: result.insertedId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        // 8. Send back the token and user data to the frontend
        res.status(201).json({
          message: 'Registration successful!',
          token,
          user: { 
              id: result.insertedId, name, mobile, 
              accountType: 'free', analysisCount: 0, maxScans: 5
          }
        });

    } catch (error) {
        console.error('Error during final registration:', error);
        // This handles the rare case where the user exists even after the first check
        if (error.code === 11000) {
            return res.status(400).json({ error: 'User with this mobile number already exists.' });
        }
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});
    // --- User Login ---
    app.post('/login', async (req, res) => {
      try {
        const { mobile, password } = req.body;
        const user = await users.findOne({ mobile });
        if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
          return res.status(401).json({ error: 'Invalid mobile number or password.' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
          token,
          user: {
            id: user._id, name: user.name, mobile: user.mobile,
            accountType: user.accountType, analysisCount: user.analysisCount, maxScans: user.maxScans
          }
        });
      } catch (error) {
        res.status(500).json({ error: 'Login failed.' });
      }
    });

    // --- Password Reset OTP Flow ---
    app.post('/send-password-reset-otp', otpLimiter, async (req, res) => {
        const { mobile } = req.body;
        if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) return res.status(400).json({ error: 'Valid mobile number is required.' });
        if (!await users.findOne({ mobile })) return res.status(404).json({ error: 'User not found.' });
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[mobile] = { otp, expiry: Date.now() + 5 * 60 * 1000 };
        
        if (twilioClient) {
            await twilioClient.messages.create({ body: `Your MediScan password reset OTP is: ${otp}`, from: twilioPhone, to: `+91${mobile}` });
            console.log(`📤 Password reset OTP sent to +91${mobile}`);
            res.status(200).json({ message: 'OTP sent successfully.' });
        } else {
            console.log(`🔑 Password Reset OTP for ${mobile}: ${otp}`);
            res.status(200).json({ message: 'OTP sent successfully (Dev Mode).' });
        }
    });
    app.get('/me', authenticateToken, async (req, res) => {
    try {
        // The authenticateToken middleware has already fetched the user from the DB
        // and attached it to req.user. We just need to send it back.
        const user = req.user;
        
        // Send a clean user object, matching the structure your frontend expects
        res.json({
            id: user._id,
            name: user.name,
            mobile: user.mobile,
            accountType: user.accountType,
            analysisCount: user.analysisCount,
            maxScans: user.maxScans
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile.' });
    }
});
    app.post('/verify-password-reset-otp', async (req, res) => {
        const { mobile, otp, newPassword } = req.body;
        if (!mobile || !otp || !newPassword || newPassword.length < 6) return res.status(400).json({ error: 'All fields are required and password must be at least 6 characters.' });

        const record = otpStore[mobile];
        if (!record || record.otp !== otp || Date.now() > record.expiry) return res.status(400).json({ error: 'Invalid or expired OTP.' });

        const { salt, hash } = hashPassword(newPassword);
        await users.updateOne({ mobile }, { $set: { passwordHash: hash, passwordSalt: salt } });
        delete otpStore[mobile];
        res.status(200).json({ message: 'Password has been reset successfully.' });
    });

    // --- Get User's Recent Activity ---
    app.get('/recent-activity', authenticateToken, async (req, res) => {
      try {
        const userAnalyses = await analyses.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(5).toArray();
        res.json(userAnalyses);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent activity.' });
      }
    });

    // --- NEW: Razorpay Order Creation ---
    app.post('/create-order', authenticateToken, async (req, res) => {
        try {
            const { amount } = req.body;
            const order = await razorpay.orders.create({ amount: amount * 100, currency: "INR", receipt: `receipt_${Date.now()}` });
            res.json(order);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create payment order.' });
        }
    });

    // --- NEW: Razorpay Payment Verification ---
    app.post('/verify-payment', authenticateToken, async (req, res) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            const text = `${razorpay_order_id}|${razorpay_payment_id}`;
            const expectedSignature = crypto.createHmac('sha256', process.env.TEST_KEY_SECRET).update(text).digest('hex');

            if (expectedSignature === razorpay_signature) {
                // IMPORTANT: Update user's account status in your database here
                await users.updateOne({ _id: req.user._id }, { $set: { accountType: 'premium', maxScans: 9999 } }); // Example: Give unlimited scans
                res.json({ status: 'success', message: 'Payment verified successfully.' });
            } else {
                res.status(400).json({ status: 'error', message: 'Invalid payment signature.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Payment verification failed.' });
        }
    });

    // --- NEW: BRIDGE TO PYTHON AI SERVICE ---
    app.post('/analyze', authenticateToken, upload.single('imageFile'), async (req, res) => {
        if (!req.file) return res.status(400).json({ error: 'No image file provided.' });

        try {
            const formData = new FormData();
            formData.append('imageFile', req.file.buffer, { filename: req.file.originalname });
            formData.append('modelId', req.body.modelId);
            
            // This URL should point to your running Python Flask server
            const pythonApiUrl = 'http://localhost:8000/analyze-image';
            const response = await axios.post(pythonApiUrl, formData, { headers: { ...formData.getHeaders() } });
            
            // Log the analysis in the database
            await analyses.insertOne({
                userId: req.user._id, modelId: req.body.modelId, result: response.data.prediction,
                confidence: response.data.confidence, timestamp: new Date()
            });
            // Increment the user's scan count
            await users.updateOne({ _id: req.user._id }, { $inc: { analysisCount: 1 } });
            
            res.json(response.data);
        } catch (error) {
            console.error('Error calling Python AI service:', error.message);
            res.status(500).json({ error: 'Failed to analyze image.' });
        }
    });

    // ===============================================
    // 5. START SERVER
    // ===============================================
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Unified server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });