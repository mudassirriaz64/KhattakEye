const CMSPage = require('../models/CMSPage');
const Banner = require('../models/Banner');
const SiteSettings = require('../models/SiteSettings');
const FAQ = require('../models/FAQ');
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
    cod: {
      active: true,
      label: 'Cash on Delivery',
      instructions: 'Pay cash upon delivery at your doorstep.'
    },
    bankTransfer: {
      active: true,
      bankName: 'Meezan Bank',
      accountTitle: 'Khattak Eyewear (Pvt) Ltd',
      accountNumber: '01020304050607',
      iban: 'PK36MEZN0001020304050607'
    },
    jazzcash: {
      active: true,
      number: '03001234567',
      accountTitle: 'Khattak Eyewear'
    },
    easypaisa: {
      active: true,
      number: '03001234567',
      accountTitle: 'Khattak Eyewear'
    },
    customMethods: []
  },
  shipping: {
    freeDeliveryThreshold: 15000,
    freeThreshold: 15000,
    flatRate: 350,
    standardRate: 350,
    expressRate: 750,
    estimatedDaysMin: 3,
    estimatedDaysMax: 5,
    estimatedDays: '3-5 business days'
  },
  policies: {
    returnWindowDays: 14,
    warrantyYears: 2
  },
  homepage: {
    featuredProductCount: 3
  },
  homepageSections: [
    { id: "sec-1", section: "hero-slider", title: "Hero Carousel", subtitle: "Main promo slider with CTA buttons", visible: true, order: 1 },
    { id: "sec-2", section: "featured-categories", title: "Featured Categories", subtitle: "Eyeglasses, Sunglasses, Contact Lenses", visible: true, order: 2 },
    { id: "sec-3", section: "tabbed-catalog", title: "Tabbed Product Catalog", subtitle: "Featured, Best Sellers, and New Arrivals", visible: true, order: 3 },
    { id: "sec-4", section: "face-shape-guide", title: "Face Shape Guide", subtitle: "Interactive fit and geometry guide", visible: true, order: 4 },
    { id: "sec-5", section: "gender-collections", title: "Gender Collections", subtitle: "Men's and Women's collections", visible: true, order: 5 },
    { id: "sec-6", section: "tryon-promo", title: "Virtual Try-On Promo", subtitle: "Interactive AR try-on spotlight", visible: true, order: 6 },
    { id: "sec-7", section: "why-choose-us", title: "Why Choose Us", subtitle: "The Khattak difference", visible: true, order: 7 },
    { id: "sec-8", section: "premium-brands", title: "Brand Logotypes", subtitle: "Luxury brand partner showcase", visible: true, order: 8 },
    { id: "sec-9", section: "testimonials", title: "Customer Reviews Wall", subtitle: "Star ratings and verified testimonials", visible: true, order: 9 },
    { id: "sec-10", section: "newsletter", title: "Newsletter Signup Box", subtitle: "Email subscription section", visible: true, order: 10 }
  ],
  logo: '/khattak.png'
};

// Ensure stored settings always include every known homepage section, so new
// sections added to the registry show up for existing installs without a reseed.
const mergeHomepageSections = (sections) => {
  if (!Array.isArray(sections) || sections.length === 0) return defaultSettings.homepageSections;
  const bySection = new Map(sections.map((s) => [s.section, s]));
  const knownKeys = new Set(defaultSettings.homepageSections.map((d) => d.section));
  const merged = defaultSettings.homepageSections.map((d) => {
    const existing = bySection.get(d.section);
    return existing ? { ...existing } : { ...d };
  });
  const extras = sections.filter((s) => !knownKeys.has(s.section));
  return [...merged, ...extras]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((s, i) => ({ ...s, id: s.id || `sec-${i + 1}`, order: i + 1 }));
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
    const { type, placement } = req.query;
    const filter = { isActive: true };
    if (type) {
      if (type === 'promotional' || type === 'offer') {
        filter.type = { $in: ['promotional', 'offer'] };
      } else if (type === 'homepage-slider' || type === 'slider') {
        filter.type = { $in: ['homepage-slider', 'slider'] };
      } else {
        filter.type = type;
      }
    }
    if (placement) {
      filter.placement = placement;
    }

    const banners = await Banner.find(filter).sort({ order: 1 }).populate('featuredProduct', 'name slug price oldPrice rating reviewCount images hoverImage');
    const formatted = banners.map(b => {
      const item = b.toObject();
      if (item.image) item.image = resolveImageUrl(item.image) || item.image;
      if (item.featuredProduct) {
        if (Array.isArray(item.featuredProduct.images)) {
          item.featuredProduct.images = item.featuredProduct.images.map(img => resolveImageUrl(img) || img);
        }
        if (item.featuredProduct.hoverImage) item.featuredProduct.hoverImage = resolveImageUrl(item.featuredProduct.hoverImage) || item.featuredProduct.hoverImage;
      }
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
    const banners = await Banner.find().sort({ order: 1 }).populate('featuredProduct', 'name slug price oldPrice rating reviewCount images hoverImage');
    const formatted = banners.map(b => {
      const item = b.toObject();
      if (item.image) item.image = resolveImageUrl(item.image) || item.image;
      if (item.featuredProduct) {
        if (Array.isArray(item.featuredProduct.images)) {
          item.featuredProduct.images = item.featuredProduct.images.map(img => resolveImageUrl(img) || img);
        }
        if (item.featuredProduct.hoverImage) item.featuredProduct.hoverImage = resolveImageUrl(item.featuredProduct.hoverImage) || item.featuredProduct.hoverImage;
      }
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
    const { type, image, link, title, subtitle, order, isActive, placement, featuredProduct } = req.body;
    const banner = new Banner({
      type: type || 'homepage-slider',
      image: image || '',
      link: link || '/shop',
      title: title || '',
      subtitle: subtitle || '',
      placement: Array.isArray(placement) ? placement : [],
      featuredProduct: featuredProduct || undefined,
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
    } else {
      settings = settings.toObject();
      settings.homepageSections = mergeHomepageSections(settings.homepageSections);
    }
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/settings
const updateSettings = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.social && !payload.socialLinks) {
      payload.socialLinks = payload.social;
    } else if (payload.socialLinks && !payload.social) {
      payload.social = payload.socialLinks;
    }
    const settings = await SiteSettings.findByIdAndUpdate(
      'site-settings',
      { $set: payload },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

const getSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findById('site-settings');
    if (!settings) {
      settings = await SiteSettings.create(defaultSettings);
    } else {
      settings = settings.toObject();
      settings.homepageSections = mergeHomepageSections(settings.homepageSections);
    }
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

const defaultFaqsSeed = [
  // Products & Sizing
  { question: "How do I find my frame size?", answer: "Check the inside of your current frames for measurements (e.g., 52-18-145). The first number is lens width, the second is bridge width, and the third is temple length.", category: "Products & Sizing", targetPages: ["general", "products-sizing"], order: 1 },
  { question: "Do you offer prescription lenses?", answer: "Yes. Most of our frames can be fitted with prescription lenses. Simply choose SELECT LENSES on the product page and follow the instructions.", category: "Products & Sizing", targetPages: ["general", "products-sizing"], order: 2 },
  { question: "What materials are your frames made from?", answer: "We use Italian acetates, Japanese titanium, and stainless steel, finished with German-engineered lens coatings.", category: "Products & Sizing", targetPages: ["general", "products-sizing"], order: 3 },
  { question: "How do I take care of my lenses?", answer: "Clean with a microfiber cloth and lens-safe spray only. Avoid paper towels and household cleaners.", category: "Products & Sizing", targetPages: ["general", "products-sizing"], order: 4 },

  // Orders & Payments
  { question: "What payment methods do you accept?", answer: "We accept Bank Transfer, JazzCash, EasyPaisa, and Cash on Delivery. For online payments, submit your transaction ID at checkout.", category: "Orders & Payments", targetPages: ["general", "orders-payments"], order: 1 },
  { question: "How do I use a coupon code?", answer: "Enter your coupon code in the 'Coupon' field at checkout. The discount will be applied to your order total automatically.", category: "Orders & Payments", targetPages: ["general", "orders-payments"], order: 2 },
  { question: "How can I track my order?", answer: "Use the Track Order page with your order number. We also email you a tracking link once your order ships.", category: "Orders & Payments", targetPages: ["general", "orders-payments"], order: 3 },
  { question: "Can I change or cancel my order?", answer: "If your order hasn't shipped yet, contact us within 24 hours and we'll update or cancel it free of charge.", category: "Orders & Payments", targetPages: ["general", "orders-payments"], order: 4 },

  // Shipping & Returns
  { question: "How long does shipping take?", answer: "Standard shipping takes 3–5 business days within Pakistan. Express shipping (1–2 days) is available at checkout.", category: "Shipping & Returns", targetPages: ["general", "shipping-returns"], order: 1 },
  { question: "Can I return or exchange my frames?", answer: "Yes, you can return or exchange within 14 days of delivery. Items must be unused and in original packaging.", category: "Shipping & Returns", targetPages: ["general", "shipping-returns"], order: 2 },
  { question: "What if I receive a damaged or incorrect item?", answer: "Contact us within 48 hours with your order number and a photo of the item, and we'll arrange a replacement or full refund right away.", category: "Shipping & Returns", targetPages: ["general", "shipping-returns"], order: 3 },
  { question: "Do you deliver internationally?", answer: "Not yet. We currently deliver across Pakistan. International shipping is on our roadmap.", category: "Shipping & Returns", targetPages: ["general", "shipping-returns"], order: 4 },

  // Warranty & Support
  { question: "What does the warranty cover?", answer: "Every pair includes a 2-year warranty covering manufacturing defects in frames and lenses under normal use.", category: "Warranty & Support", targetPages: ["general", "warranty-support"], order: 1 },
  { question: "How do I file a warranty claim?", answer: "Email or message our support team with your order number, a photo of the issue, and a short description.", category: "Warranty & Support", targetPages: ["general", "warranty-support"], order: 2 },
  { question: "Can you adjust or repair my frames?", answer: "Yes. Bring any pair to the atelier and our technicians will adjust the fit. Minor repairs on Khattak frames are free within warranty.", category: "Warranty & Support", targetPages: ["general", "warranty-support"], order: 3 },

  // Blue Light Lenses
  { question: "Is it harmful to wear blue light lenses all day long?", answer: "No, blue light blocking lenses are completely safe and beneficial for all-day wear. They function like regular clear lenses while filtering high-energy visible (HEV) screen radiation.", category: "Blue Light", targetPages: ["blue-light"], order: 1 },
  { question: "Should I wear blue light glasses to watch TV or play video games?", answer: "Yes! Modern televisions, gaming monitors, and smartphone screens emit significant amounts of artificial blue light. Wearing blue light glasses reduces eye strain and fatigue.", category: "Blue Light", targetPages: ["blue-light"], order: 2 },
  { question: "Can I get blue light protection with prescription lenses?", answer: "Absolutely. All our blue light blocking technologies can be customized with your exact single vision, bifocal, or progressive prescription.", category: "Blue Light", targetPages: ["blue-light"], order: 3 },

  // Computer Glasses
  { question: "Do Computer Glasses Really Work?", answer: "Yes! Computer glasses are specialized eyewear designed with anti-reflective and blue-light filtering technology to protect your eyes from artificial screen radiation.", category: "Computer Glasses", targetPages: ["computer"], order: 1 },
  { question: "What is the difference between Computer Glasses and Regular Glasses?", answer: "Regular prescription glasses correct distance or reading vision, but computer glasses are specifically optimized for intermediate screen distances (approx. 20-26 inches).", category: "Computer Glasses", targetPages: ["computer"], order: 2 },

  // Anti-Glare Lenses
  { question: "Why is Anti-Glare Coating so Important?", answer: "Anti-glare (AR) coating eliminates internal and external reflections from your spectacle lenses, allowing 99.5% of light to reach your eyes for sharper contrast.", category: "Anti-Glare", targetPages: ["anti-glare"], order: 1 },
  { question: "Do Anti-Glare Glasses Help Night Driving?", answer: "Yes! Night driving glare from oncoming LED headlights and street lamps creates distracting starbursts. Anti-reflective lenses eliminate these reflections.", category: "Anti-Glare", targetPages: ["anti-glare"], order: 2 },

  // Photochromic Lenses
  { question: "How do Photochromic / Transition Lenses work?", answer: "Photochromic lenses contain micro-photochromic molecules that react to outdoor UV sunlight, darkening rapidly outdoors and returning 100% clear indoors.", category: "Photochromic", targetPages: ["photochromic"], order: 1 },
  { question: "How fast do Transition Lenses darken and clear?", answer: "Khattak High-Definition Photochromic lenses darken in under 30 seconds outdoors and clear back to transparent indoors within 2-3 minutes.", category: "Photochromic", targetPages: ["photochromic"], order: 2 }
];

// GET /api/faqs
const getFAQs = async (req, res, next) => {
  try {
    const { page } = req.query;
    const count = await FAQ.countDocuments();
    if (count === 0) {
      await FAQ.insertMany(defaultFaqsSeed);
    }
    const filter = { isActive: true };
    if (page) {
      filter.targetPages = page.toLowerCase();
    }
    const faqs = await FAQ.find(filter).sort({ order: 1 });
    res.status(200).json(faqs);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/faqs
const getAllFAQsAdmin = async (req, res, next) => {
  try {
    const count = await FAQ.countDocuments();
    if (count === 0) {
      await FAQ.insertMany(defaultFaqsSeed);
    }
    const faqs = await FAQ.find().sort({ order: 1 });
    res.status(200).json(faqs);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/faqs
const createFAQ = async (req, res, next) => {
  try {
    const { question, answer, targetPages, category, order, isActive } = req.body;
    const faq = new FAQ({
      question,
      answer,
      targetPages: Array.isArray(targetPages) ? targetPages : (targetPages ? [targetPages] : ["general"]),
      category: category || "General",
      order: Number(order) || 1,
      isActive: isActive !== undefined ? isActive : true
    });
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/faqs/:id
const updateFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await FAQ.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });
    if (!updated) return res.status(404).json({ message: 'FAQ not found' });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/faqs/:id
const deleteFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    await FAQ.findByIdAndDelete(id);
    res.status(200).json({ message: 'FAQ deleted' });
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
  updateSettings,
  getSiteSettings,
  getFAQs,
  getAllFAQsAdmin,
  createFAQ,
  updateFAQ,
  deleteFAQ
};
