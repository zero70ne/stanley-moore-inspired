export const initializePaystackPayment = async (amount) => {
  const response = await fetch('http://localhost:8000/api/payment/initialize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ amount: amount * 100 }) // Convert to kobo
  });

  if (!response.ok) {
    throw new Error('Failed to initialize payment');
  }

  return response.json();
};

export const verifyPaystackPayment = async (reference) => {
  const response = await fetch('http://localhost:8000/api/payment/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ reference })
  });

  if (!response.ok) {
    throw new Error('Failed to verify payment');
  }

  return response.json();
};

// Replace with your actual Paystack public key from your dashboard
export const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_your_actual_public_key_from_paystack';