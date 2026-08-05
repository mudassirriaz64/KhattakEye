const ContactInquiry = require('../models/ContactInquiry');

// POST /api/contact
const submitInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const inquiry = new ContactInquiry({
      name,
      email,
      phone: phone || '',
      subject: subject || 'Website Contact Form',
      message
    });

    await inquiry.save();

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our concierge team will reach out shortly.',
      inquiry
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitInquiry
};
