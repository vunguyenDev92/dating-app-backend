const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== ENDPOINTS ====================

// 1. Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend is running on Railway!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// 2. Send OTP
app.post('/api/auth/send-otp', (req, res) => {
    try {
        const { phone } = req.body;

        // Validation
        if (!phone) {
            return res.status(400).json({
                error: 'Phone number required'
            });
        }

        // Phone format check (simple)
        if (!phone.match(/^\+?[1-9]\d{1,14}$/)) {
            return res.status(400).json({
                error: 'Invalid phone format'
            });
        }

        // Generate mock OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Log OTP (for testing)
        console.log(`📱 OTP for ${phone}: ${otp}`);

        // Response
        res.json({
            success: true,
            message: 'OTP sent successfully',
            phone: phone,
            expiresIn: 600, // 10 minutes
            // Remove in production: testOtp: otp,
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
    try {
        const { phone, code, firstName, lastName } = req.body;

        // Validation
        if (!phone || !code || !firstName || !lastName) {
            return res.status(400).json({
                error: 'Missing required fields: phone, code, firstName, lastName'
            });
        }

        if (!code.match(/^\d{6}$/)) {
            return res.status(400).json({
                error: 'Invalid OTP format'
            });
        }

        // Mock verification (any 6 digits work)
        const userId = 'user_' + Math.random().toString(36).substr(2, 9);
        const accessToken = 'access_' + Math.random().toString(36).substr(2, 20);
        const refreshToken = 'refresh_' + Math.random().toString(36).substr(2, 20);

        // Log
        console.log(`✅ User verified: ${firstName} ${lastName} (${phone})`);

        // Response
        res.json({
            success: true,
            message: 'Phone verified successfully',
            user: {
                id: userId,
                phone: phone,
                firstName: firstName,
                lastName: lastName,
                email: null,
                verified: true,
                createdAt: new Date().toISOString(),
            },
            tokens: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. Refresh Token
app.post('/api/auth/refresh', (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token required' });
        }

        // Mock verification
        const newAccessToken = 'access_' + Math.random().toString(36).substr(2, 20);

        res.json({
            success: true,
            accessToken: newAccessToken,
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 5. Logout
app.post('/api/auth/logout', (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 6. Get Current User (Mock)
app.get('/api/user/me', (req, res) => {
    try {
        // Mock - in real app, get from token
        res.json({
            success: true,
            user: {
                id: 'user_123',
                phone: '+84912345678',
                firstName: 'John',
                lastName: 'Doe',
                verified: true,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.path,
        method: req.method,
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
    });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  🚀 DATING APP BACKEND - Railway      ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`\n📍 Server running on port ${PORT}`);
    console.log(`\n📝 Endpoints:\n`);
    console.log(`  ✅ GET    /health`);
    console.log(`  ✅ POST   /api/auth/send-otp`);
    console.log(`  ✅ POST   /api/auth/verify-otp`);
    console.log(`  ✅ POST   /api/auth/refresh`);
    console.log(`  ✅ POST   /api/auth/logout`);
    console.log(`  ✅ GET    /api/user/me`);
    console.log(`\n🌐 Base URL: http://localhost:${PORT}`);
    console.log(`\n💰 Free tier: $5/month credit on Railway\n`);
});