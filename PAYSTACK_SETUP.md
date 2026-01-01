# Paystack Setup for Nigerian Payments

## 🇳🇬 Paystack Integration Complete

Your Stanley Moore store now supports Nigerian customers with Paystack!

## 🔧 Setup Steps

### 1. Create Paystack Account
- Go to [Paystack Dashboard](https://dashboard.paystack.com/signup)
- Complete business verification

### 2. Get API Keys
- Login to [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer)
- Copy your **Test Keys**:
  - **Secret Key** (starts with `sk_test_`)
  - **Public Key** (starts with `pk_test_`)

### 3. Update .env File
Replace in your `.env`:
```
PAYSTACK_SECRET_KEY=sk_test_your_actual_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_actual_paystack_public_key
```

## 🚀 New API Endpoints

### Nigerian Customers (Paystack):
- `POST /api/payment/paystack/initialize` - Start payment
- `POST /api/payment/paystack/verify` - Verify payment

### International Customers (Stripe):
- `POST /api/payment/stripe/create-intent` - Create payment intent

## 💰 Supported Currencies
- **NGN** (Nigerian Naira) - Paystack
- **USD, EUR, GBP** - Stripe

## 🧪 Test Cards

### Paystack Test Cards:
- **Success**: 4084084084084081
- **Insufficient Funds**: 4084084084084081 (amount > 300000)

### Stripe Test Cards:
- **Success**: 4242424242424242
- **Declined**: 4000000000000002

## ✅ Ready to Test
```bash
cd backend
npm start
```

Your store now accepts payments from both Nigerian and international customers!