const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

// Paystack Payment Service
const paystackService = {
  // Initialize payment
  async initializePayment(email, amount, currency = 'NGN') {
    try {
      const response = await paystack.transaction.initialize({
        email,
        amount: amount * 100, // Convert to kobo
        currency,
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`
      });
      return response.data;
    } catch (error) {
      throw new Error(`Paystack initialization failed: ${error.message}`);
    }
  },

  // Verify payment
  async verifyPayment(reference) {
    try {
      const response = await paystack.transaction.verify(reference);
      return response.data;
    } catch (error) {
      throw new Error(`Paystack verification failed: ${error.message}`);
    }
  }
};

module.exports = { paystackService };