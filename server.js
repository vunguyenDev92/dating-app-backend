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

// ==================== AUTHENTICATION ====================

// 2. Send OTP (with email)
app.post('/api/auth/send-otp', (req, res) => {
    try {
        const { phone, email } = req.body;

        if (!phone || !email) {
            return res.status(400).json({ error: 'Phone and email required' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`📱 OTP for ${phone} (${email}): ${otp}`);

        res.json({
            success: true,
            message: 'OTP sent successfully',
            phone,
            email,
            expiresIn: 600,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. Verify OTP (with email)
app.post('/api/auth/verify-otp', (req, res) => {
    try {
        const { phone, email, code, firstName, lastName } = req.body;

        if (!phone || !email || !code || !firstName || !lastName) {
            return res.status(400).json({
                error: 'Missing required fields: phone, email, code, firstName, lastName'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const userId = 'user_' + Math.random().toString(36).substr(2, 9);
        const accessToken = 'access_' + Math.random().toString(36).substr(2, 20);

        console.log(`✅ User verified: ${firstName} ${lastName} (${phone}, ${email})`);

        res.json({
            success: true,
            message: 'Phone and email verified successfully',
            user: {
                id: userId,
                phone,
                email,
                firstName,
                lastName,
                verified: true,
                createdAt: new Date().toISOString(),
            },
            tokens: {
                accessToken,
                refreshToken: 'refresh_' + Math.random().toString(36).substr(2, 20),
            },
        });
    } catch (error) {
        console.error('Error:', error);
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

        res.json({
            success: true,
            accessToken: 'access_' + Math.random().toString(36).substr(2, 20),
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 5. Logout
app.post('/api/auth/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully',
    });
});

// ==================== USER PROFILE ====================

// 6. Get Current User (with email)
app.get('/api/user/me', (req, res) => {
    res.json({
        success: true,
        user: {
            id: 'user_123',
            phone: '+84912345678',
            email: 'john.doe@gmail.com',
            firstName: 'John',
            lastName: 'Doe',
            verified: true,
        },
    });
});

// 7. Get User Profile by ID (with email)
app.get('/api/profile/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        res.json({
            success: true,
            profile: {
                id: userId,
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@gmail.com',
                phone: '+84912345679',
                age: 25,
                bio: 'Love hiking and coffee ☕',
                city: 'Ho Chi Minh',
                photos: [
                    'https://via.placeholder.com/300x400?text=Photo+1',
                    'https://via.placeholder.com/300x400?text=Photo+2',
                ],
                interests: ['hiking', 'coffee', 'travel'],
                verified: true,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 8. Update Profile (with email)
app.patch('/api/profile/update', (req, res) => {
    try {
        const { email, bio, interests, city, firstName, lastName, phone } = req.body;

        // Email validation (if provided)
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
        }

        res.json({
            success: true,
            message: 'Profile updated',
            profile: {
                id: 'user_123',
                email: email || 'john.doe@gmail.com',
                phone: phone || '+84912345678',
                firstName: firstName || 'John',
                lastName: lastName || 'Doe',
                bio: bio || 'Love coding!',
                interests: interests || [],
                city: city || 'Ho Chi Minh',
                updatedAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== DISCOVERY & SWIPE ====================

// 9. Get Profiles to Swipe (with email)
app.get('/api/discover/profiles', (req, res) => {
    try {
        res.json({
            success: true,
            profiles: [
                {
                    id: 'user_456',
                    firstName: 'Alice',
                    lastName: 'Johnson',
                    email: 'alice@gmail.com',
                    phone: '+84912345680',
                    age: 24,
                    bio: 'Yoga instructor 🧘',
                    photo: 'https://via.placeholder.com/300x400?text=Alice',
                    distance: 2,
                },
                {
                    id: 'user_789',
                    firstName: 'Emma',
                    lastName: 'Wilson',
                    email: 'emma@gmail.com',
                    phone: '+84912345681',
                    age: 23,
                    bio: 'Designer & artist 🎨',
                    photo: 'https://via.placeholder.com/300x400?text=Emma',
                    distance: 5,
                },
                {
                    id: 'user_321',
                    firstName: 'Sarah',
                    lastName: 'Brown',
                    email: 'sarah@gmail.com',
                    phone: '+84912345682',
                    age: 26,
                    bio: 'Travel blogger ✈️',
                    photo: 'https://via.placeholder.com/300x400?text=Sarah',
                    distance: 3,
                },
            ],
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 10. Swipe (Like/Pass)
app.post('/api/discover/swipe', (req, res) => {
    try {
        const { targetUserId, direction } = req.body;

        if (!targetUserId || !direction) {
            return res.status(400).json({ error: 'Missing targetUserId or direction' });
        }

        if (!['like', 'pass'].includes(direction)) {
            return res.status(400).json({ error: 'Direction must be "like" or "pass"' });
        }

        // Mock match (30% chance)
        const matched = direction === 'like' && Math.random() > 0.7;

        console.log(`👍 ${direction === 'like' ? 'Liked' : 'Passed'} user ${targetUserId}`);

        res.json({
            success: true,
            message: `You ${direction}d user ${targetUserId}`,
            matched,
            matchId: matched ? 'match_' + Math.random().toString(36).substr(2, 9) : null,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 11. Get Matches (with email)
app.get('/api/discover/matches', (req, res) => {
    try {
        res.json({
            success: true,
            matches: [
                {
                    id: 'match_1',
                    userId: 'user_456',
                    firstName: 'Alice',
                    lastName: 'Johnson',
                    email: 'alice@gmail.com',
                    phone: '+84912345680',
                    photo: 'https://via.placeholder.com/300x400?text=Alice',
                    matchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: 'match_2',
                    userId: 'user_789',
                    firstName: 'Emma',
                    lastName: 'Wilson',
                    email: 'emma@gmail.com',
                    phone: '+84912345681',
                    photo: 'https://via.placeholder.com/300x400?text=Emma',
                    matchedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                },
            ],
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== MESSAGING ====================

// 12. Get Conversations (with email)
app.get('/api/messages/conversations', (req, res) => {
    try {
        res.json({
            success: true,
            conversations: [
                {
                    id: 'conv_1',
                    userId: 'user_456',
                    name: 'Alice Johnson',
                    email: 'alice@gmail.com',
                    phone: '+84912345680',
                    photo: 'https://via.placeholder.com/100?text=Alice',
                    lastMessage: 'Hey! How are you? 😊',
                    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                    unreadCount: 2,
                },
                {
                    id: 'conv_2',
                    userId: 'user_789',
                    name: 'Emma Wilson',
                    email: 'emma@gmail.com',
                    phone: '+84912345681',
                    photo: 'https://via.placeholder.com/100?text=Emma',
                    lastMessage: 'That sounds fun! 🎨',
                    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    unreadCount: 0,
                },
            ],
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 13. Get Chat History
app.get('/api/messages/:conversationId', (req, res) => {
    try {
        const { conversationId } = req.params;

        res.json({
            success: true,
            conversation: {
                id: conversationId,
                messages: [
                    {
                        id: 'msg_1',
                        senderId: 'user_123',
                        senderName: 'You',
                        senderEmail: 'john.doe@gmail.com',
                        text: 'Hi! How are you?',
                        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
                        readAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
                    },
                    {
                        id: 'msg_2',
                        senderId: 'user_456',
                        senderName: 'Alice',
                        senderEmail: 'alice@gmail.com',
                        text: 'I\'m doing great! How about you? 😊',
                        createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
                        readAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
                    },
                    {
                        id: 'msg_3',
                        senderId: 'user_123',
                        senderName: 'You',
                        senderEmail: 'john.doe@gmail.com',
                        text: 'Same! Want to grab coffee sometime?',
                        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                        readAt: null,
                    },
                ],
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 14. Send Message (with email)
app.post('/api/messages/send', (req, res) => {
    try {
        const { conversationId, text } = req.body;

        if (!conversationId || !text) {
            return res.status(400).json({ error: 'Missing conversationId or text' });
        }

        res.json({
            success: true,
            message: {
                id: 'msg_' + Math.random().toString(36).substr(2, 9),
                conversationId,
                senderId: 'user_123',
                senderEmail: 'john.doe@gmail.com',
                text,
                createdAt: new Date().toISOString(),
                readAt: null,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 15. Mark Message as Read
app.patch('/api/messages/:messageId/read', (req, res) => {
    try {
        const { messageId } = req.params;

        res.json({
            success: true,
            message: {
                id: messageId,
                readAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
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
    console.log('║  🚀 DATING APP BACKEND - With Email   ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`\n📍 Server running on port ${PORT}`);
    console.log(`\n📝 15 Endpoints - All with Email Support:\n`);
    console.log(`  Auth (5):`);
    console.log(`    POST   /api/auth/send-otp`);
    console.log(`    POST   /api/auth/verify-otp`);
    console.log(`    POST   /api/auth/refresh`);
    console.log(`    POST   /api/auth/logout`);
    console.log(`    GET    /health\n`);
    console.log(`  User (3):`);
    console.log(`    GET    /api/user/me`);
    console.log(`    GET    /api/profile/:userId`);
    console.log(`    PATCH  /api/profile/update\n`);
    console.log(`  Discovery (3):`);
    console.log(`    GET    /api/discover/profiles`);
    console.log(`    POST   /api/discover/swipe`);
    console.log(`    GET    /api/discover/matches\n`);
    console.log(`  Messaging (4):`);
    console.log(`    GET    /api/messages/conversations`);
    console.log(`    GET    /api/messages/:conversationId`);
    console.log(`    POST   /api/messages/send`);
    console.log(`    PATCH  /api/messages/:messageId/read\n`);
});