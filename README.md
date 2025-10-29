# 🚀 Dating App Backend

Simple Express.js backend for dating app, deployed on Railway.

## Setup

### Local Development

```bash
# Install dependencies
npm install

# Create .env file
echo "PORT=3000" > .env
echo "NODE_ENV=development" >> .env

# Start server
npm run dev
```

### Deploy on Railway

1. Push to GitHub
2. Go to railway.app
3. Connect GitHub repo
4. Deploy
5. Add PostgreSQL database
6. Get live URL!

## API Endpoints

### Authentication

- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and create user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### User

- `GET /api/user/me` - Get current user

### Health

- `GET /health` - Health check

## Testing

```bash
# Health check
curl http://localhost:3000/health

# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+84912345678"}'

# Verify OTP (any 6 digits work)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"+84912345678",
    "code":"123456",
    "firstName":"John",
    "lastName":"Doe"
  }'
```

## Technologies

- Node.js
- Express.js
- CORS
- dotenv

## Deployment

Deployed on [Railway](https://railway.app)

## Cost

$5/month free credit on Railway (enough for small app!)

## License

MIT
```

---

## 🎯 HOW TO USE

### **Step 1: Create Files**

Create these files in your project:
```
dating-app-backend/
├── server.js          ← Copy server.js code
├── package.json       ← Copy package.json code
├── .env               ← Copy .env code
├── .gitignore         ← Copy .gitignore code
└── README.md          ← Copy README.md code
```

### **Step 2: Initialize Git**

```bash
git init
git add .
git commit -m "Initial backend setup"
```

### **Step 3: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/dating-app-backend.git
git branch -M main
git push -u origin main
```

### **Step 4: Deploy on Railway**

1. Go to https://railway.app
2. Sign up with GitHub
3. Deploy from GitHub repo
4. Get live URL!

---

## 📝 TESTING LOCALLY

```bash
# Install dependencies
npm install

# Start server
npm start

# In another terminal, test:
curl http://localhost:3000/health

# Response:
# {"status":"ok","message":"Backend is running on Railway!","timestamp":"..."}
```

---

## 🔄 AUTO-DEPLOY

After deployment on Railway:

```bash
# Make changes locally
nano server.js

# Push to GitHub
git add .
git commit -m "New feature"
git push origin main

# Railway auto-deploys!
# Check dashboard to see new deployment
```

---

## 💡 NEXT STEPS

After basic deployment:

1. Add real database (PostgreSQL)
2. Add Prisma ORM
3. Replace mock endpoints with real queries
4. Add authentication middleware
5. Connect Android frontend