const CMSPage = require('../models/CMSPage');
const Banner = require('../models/Banner');
const SiteSettings = require('../models/SiteSettings');
const { resolveImageUrl } = require('../utils/cloudinary');

// Default initial CMS page content fallbacks
const defaultPages = {
  'shipping-policy': {
    title: 'Shipping Policy',
    content: `<h3>Free Delivery Nationwide</h3><p>We offer free express delivery across Pakistan on all orders. Standard delivery arrives within 3 to 5 business days. Remote areas may take 5 to 7 days.</p>`
  },
  'return-policy': {
    title: 'Return & Exchange Policy',
    content: `<h3>14-Day Hassle-Free Returns</h3><p>If you are not completely satisfied with your eyewear, you may request an exchange or return within 14 days of delivery. Items must be unworn and in original packaging.</p>`
  },
  'privacy': {
    title: 'Privacy Policy',
    content: `<h3>Your Privacy Matters</h3><p>Khattak Eyewear respects your privacy. We collect personal information only to process orders, improve customer service, and communicate updates. We never sell your data.</p>`
  },
  'terms': {
    title: 'Terms & Conditions',
    content: `<h3>Terms of Service</h3><p>By using Khattak Eyewear, you agree to comply with our terms. All frame designs, brand marks, and digital media are intellectual property of Khattak Eyewear.</p>`
  },
  'faq': {
    title: 'Frequently Asked Questions',
    content: `<h3>Common Questions</h3><p>Find answers regarding frame sizing, prescription lenses, payment options, and shipping delivery schedules.</p>`
  },
  'eye-care-tips': {
    title: 'Eye Care & Maintenance Tips',
    content: `<h3>Preserving Your Frames & Lenses</h3><p>Clean your lenses daily with microfiber cloth and optical spray. Avoid exposing frames to extreme direct heat. Store in your hard leather case when not in use.</p>`
  }
};

// Default Site Settings singleton fallback
const defaultSettings = {
  _id: 'site-settings',
  contact: {
    phone: '+92 300 1234567',
    whatsapp: '923001234567',
    email: 'hello@khattakeyewear.com',
    address: '12-B, MM Alam Road, Gulberg III, Lahore, Pakistan',
    googleMapEmbedUrl: 'https://maps.google.com/maps?q=MM+Alam+Road+Gulberg+III+Lahore+Pakistan&t=&z=15&ie=UTF8&iwloc=&output=embed'
  },
  socialLinks: {
    facebook: 'https://facebook.com/khattakeyewear',
    instagram: 'https://instagram.com/khattakeyewear',
    tiktok: 'https://tiktok.com/@khattakeyewear'
  },
  payment: {
    bankTransfer: {
      bankName: 'Meezan Bank',
      accountTitle: 'Khattak Eyewear (Pvt) Ltd',
      iban: 'PK36MEZN0001020304050607'
    },
    jazzcash: '03001234567',
    easypaisa: '03001234567'
  },
  shipping: {
    freeDeliveryThreshold: 0,
    flatRate: 0,
    estimatedDaysMin: 3,
    estimatedDaysMax: 5
  },
  policies: {
    returnWindowDays: 14,
    warrantyYears: 2
  },
  logo: '/khattak.png'
};

// GET /api/cms/:slug
const getCMSPage = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let page = await CMSPage.findOne({ slug: slug.toLowerCase() });
    
    if (!page && defaultPages[slug.toLowerCase()]) {
      page = {
        slug: slug.toLowerCase(),
        ...defaultPages[slug.toLowerCase()]
      };
    }

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.status(200).json(page);
  } catch (error) {
    next(error);
  }
};

// GET /api/cms
const getAllCMSPages = async (req, res, next) => {
  try {
    const pages = await CMSPage.find().sort({ title: 1 });
    res.status(200).json(pages);
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/cms/:slug
const upsertCMSPage = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { title, content } = req.body;

    const page = await CMSPage.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      { title, content, slug: slug.toLowerCase() },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    res.status(200).json(page);
  } catch (error) {
    next(error);
  }
};

// GET /api/banners
const getBanners = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;

    const banners = await Banner.find(filter).sort({ order: 1 });
    const formatted = banners.map(b => {
      const item = b.toObject();
      if (item.image) item.image = resolveImageUrl(item.image) || item.image;
      return item;
    });

    res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/banners
const getAllBannersAdmin = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    const formatted = banners.map(b => {
      const item = b.toObject();
      if (item.image) item.image = resolveImageUrl(item.image) || item.image;
      return item;
    });
    res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/banners
const createBanner = async (req, res, next) => {
  try {
    const { type, image, link, title, order, isActive } = req.body;
    const banner = new Banner({
      type: type || 'homepage-slider',
      image: image || '',
      link: link || '/shop',
      title: title || '',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/banners/:id
const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Banner.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Banner not found' });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/banners/:id
const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Banner.findByIdAndDelete(id);
    res.status(200).json({ message: 'Banner deleted' });
  } catch (error) {
    next(error);
  }
};

// GET /api/settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findById('site-settings');
    if (!settings) {
      settings = await SiteSettings.create(defaultSettings);
    }
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/settings
const updateSettings = async (req, res, next) => {
  try {
    const settings = await SiteSettings.findByIdAndUpdate(
      'site-settings',
      { $set: req.body },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCMSPage,
  getAllCMSPages,
  upsertCMSPage,
  getBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
  getSettings,
  updateSettings
};
