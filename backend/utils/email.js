/**
 * Mock email sender that outputs OTP and messages to the console for testing.
 * If real credentials are provided, SMTP nodemailer would be configured here.
 */
const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
  console.log('\n' + '='.repeat(50));
  console.log(`✉️  EMAIL SENT TO: ${email}`);
  console.log(`🔑  YOUR OTP CODE IS: ${otp}`);
  console.log(`⏳  This OTP is valid for 15 minutes.`);
  console.log('='.repeat(50) + '\n');

  // If EMAIL_USER and EMAIL_PASS are set in .env, we can send a real email
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"Khattak Eyewear" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - Khattak Eyewear',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">Khattak Eyewear</h2>
            <p>Hello,</p>
            <p>Thank you for registering with Khattak Eyewear. Please use the following One-Time Password (OTP) to verify your email address:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111; margin: 20px 0; border-radius: 4px;">
              ${otp}
            </div>
            <p>This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">© 2026 Khattak Eyewear. All rights reserved.</p>
          </div>
        `
      });
      console.log(`📬  Real email successfully dispatched to ${email}`);
    } catch (err) {
      console.error(`⚠️  Failed to dispatch real email: ${err.message}`);
    }
  }

  return true;
};

const sendResetEmail = async (email, token) => {
  // Reset URL is frontend URL + reset page path
  const resetUrl = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/reset-password?token=${token}`;
  console.log('\n' + '='.repeat(50));
  console.log(`✉️  PASSWORD RESET EMAIL SENT TO: ${email}`);
  console.log(`🔗  RESET LINK: ${resetUrl}`);
  console.log(`⏳  This link is valid for 15 minutes.`);
  console.log('='.repeat(50) + '\n');

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"Khattak Eyewear" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset Your Password - Khattak Eyewear',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">Khattak Eyewear</h2>
            <p>Hello,</p>
            <p>You requested to reset your password. Please click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #008080; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p>Alternatively, copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #008080;">${resetUrl}</p>
            <p>This link will expire in 15 minutes. If you did not request this, please ignore this email.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">© 2026 Khattak Eyewear. All rights reserved.</p>
          </div>
        `
      });
      console.log(`📬  Real reset email successfully dispatched to ${email}`);
    } catch (err) {
      console.error(`⚠️  Failed to dispatch real reset email: ${err.message}`);
    }
  }

  return true;
};

const sendOrderConfirmationEmail = async (order) => {
  console.log('\n' + '='.repeat(50));
  console.log(`✉️  ORDER CONFIRMATION EMAIL SENT TO: ${order.customerEmail}`);
  console.log(`📦  ORDER NUMBER: ${order.orderNumber}`);
  console.log(`💰  TOTAL AMOUNT: Rs. ${order.total}`);
  console.log('='.repeat(50) + '\n');

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const itemsHtml = (order.items || []).map(i => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${i.name} (${i.color || 'Standard'}) x ${i.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${(i.price * i.quantity).toLocaleString()}</td>
        </tr>
      `).join('');

      await transporter.sendMail({
        from: `"Khattak Eyewear" <${process.env.EMAIL_USER}>`,
        to: order.customerEmail,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #111; text-align: center;">Khattak Eyewear</h2>
            <p>Dear ${order.customerName},</p>
            <p>Thank you for your order! We are preparing your frames with precision craftsmanship.</p>
            <h3>Order Summary (${order.orderNumber})</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 8px; text-align: left;">Item</th>
                  <th style="padding: 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <p><strong>Total: Rs. ${order.total.toLocaleString()}</strong></p>
            <p>Payment Method: ${order.paymentMethod}</p>
            <p>Shipping Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}</p>
            <p style="margin-top: 20px; font-size: 12px; color: #777;">Track your order anytime on our website using your order number.</p>
          </div>
        `
      });
      console.log(`📬  Real order confirmation email dispatched to ${order.customerEmail}`);
    } catch (err) {
      console.error(`⚠️  Failed to dispatch order email: ${err.message}`);
    }
  }

  return true;
};

module.exports = {
  sendOTPEmail,
  sendResetEmail,
  sendOrderConfirmationEmail
};
