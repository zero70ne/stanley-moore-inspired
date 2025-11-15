import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

export const createPaymentIntent = async (amount) => {
  const response = await fetch('http://localhost:8000/api/payment/create-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ amount })
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  return response.json();
};

export const confirmPayment = async (clientSecret, paymentMethod) => {
  const stripe = await stripePromise;
  
  return stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethod
  });
};

export { stripePromise };