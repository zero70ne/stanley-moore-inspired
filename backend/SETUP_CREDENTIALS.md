# Stanley Moore - Credentials Setup Guide

## 🔧 Gmail Setup (for Email Notifications)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click "Security" → "2-Step Verification"
3. Follow the setup process

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Other" as device, name it "Stanley Moore Store"
4. Copy the 16-character password (no spaces)

### Step 3: Update .env
Replace in your `.env` file:
```
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

## 💳 Stripe Setup (for Payments)

### Step 1: Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Create account or login

### Step 2: Get Test Keys
1. In Stripe Dashboard, ensure you're in "Test mode" (toggle in left sidebar)
2. Go to "Developers" → "API Keys"
3. Copy both keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 3: Update .env
Replace in your `.env` file:
```
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

## ✅ Test Your Setup
After updating credentials:
```bash
cd backend
npm start
```

The server will show if email/payment services are properly configured.

## 🔒 Security Notes
- Never commit real credentials to Git
- Use test keys for development
- Switch to live keys only for production