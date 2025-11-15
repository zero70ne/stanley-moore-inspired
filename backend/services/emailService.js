const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOrderConfirmation = async (userEmail, userName, order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Order Confirmation - Stanley Moore Inspired',
    html: `
      <h2>Thank you for your order, ${userName}!</h2>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total:</strong> $${order.total}</p>
      <h3>Items:</h3>
      <ul>
        ${order.items.map(item => `<li>${item.name} - Qty: ${item.quantity} - $${item.price}</li>`).join('')}
      </ul>
      <p>We'll send you another email when your order ships.</p>
      <p>Best regards,<br>Stanley Moore Inspired Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendShippingNotification = async (userEmail, userName, order, trackingNumber) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Your Order Has Shipped - Stanley Moore Inspired',
    html: `
      <h2>Great news, ${userName}!</h2>
      <p>Your order <strong>#${order._id}</strong> has been shipped.</p>
      <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p>You can expect delivery within 3-5 business days.</p>
      <p>Best regards,<br>Stanley Moore Inspired Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordReset = async (userEmail, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Password Reset - Stanley Moore Inspired',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOrderConfirmation,
  sendShippingNotification,
  sendPasswordReset
};