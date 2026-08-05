const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// POST /api/newsletter/subscribe
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email address is required' });
    }

    let subscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase().trim() });
    if (subscriber) {
      return res.status(200).json({ message: 'You are already subscribed to our newsletter!' });
    }

    subscriber = new NewsletterSubscriber({ email: email.toLowerCase().trim() });
    await subscriber.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to Khattak Eyewear updates!'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribe
};
