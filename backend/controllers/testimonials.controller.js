const Testimonial = require('../models/Testimonial');
const { resolveImageUrl } = require('../utils/cloudinary');

// Initial seed default testimonials if DB is empty
const defaultTestimonials = [
  {
    customerName: 'Dr. Tariq Mahmood',
    customerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    rating: 5,
    text: 'The titanium frames are extraordinarily lightweight yet durable. As someone who wears prescription lenses all day, Khattak Eyewear offers unrivaled comfort.',
    order: 1,
    isActive: true
  },
  {
    customerName: 'Zara Shah',
    customerImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop',
    rating: 5,
    text: 'Impeccable craftsmanship and incredible packaging. The Virtual Try-On matched the physical fit perfectly. Best luxury eyewear brand in Pakistan!',
    order: 2,
    isActive: true
  },
  {
    customerName: 'Bilal Chaudhry',
    customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    rating: 5,
    text: 'High precision prescription lenses and fast courier delivery to Karachi. The concierge customer service was top tier.',
    order: 3,
    isActive: true
  }
];

// GET /api/testimonials
const getPublicTestimonials = async (req, res, next) => {
  try {
    let items = await Testimonial.find({ isActive: true }).sort({ order: 1 });
    if (!items || items.length === 0) {
      await Testimonial.insertMany(defaultTestimonials);
      items = await Testimonial.find({ isActive: true }).sort({ order: 1 });
    }
    const formatted = items.map(t => {
      const doc = t.toObject();
      if (doc.customerImage) doc.customerImage = resolveImageUrl(doc.customerImage) || doc.customerImage;
      return doc;
    });
    res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/testimonials
const getAllTestimonialsAdmin = async (req, res, next) => {
  try {
    let items = await Testimonial.find().sort({ order: 1 });
    if (!items || items.length === 0) {
      await Testimonial.insertMany(defaultTestimonials);
      items = await Testimonial.find().sort({ order: 1 });
    }
    const formatted = items.map(t => {
      const doc = t.toObject();
      if (doc.customerImage) doc.customerImage = resolveImageUrl(doc.customerImage) || doc.customerImage;
      return doc;
    });
    res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/testimonials
const createTestimonial = async (req, res, next) => {
  try {
    const { customerName, customerImage, rating, text, isActive, order } = req.body;
    const item = new Testimonial({
      customerName,
      customerImage: customerImage || '',
      rating: Number(rating) || 5,
      text,
      isActive: isActive !== undefined ? isActive : true,
      order: Number(order) || 0
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/testimonials/:id
const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Testimonial.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Testimonial not found' });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/testimonials/:id
const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Testimonial.findByIdAndDelete(id);
    res.status(200).json({ message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
