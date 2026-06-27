import Joi from 'joi';

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({ success: false, error: errorMessages });
    }
    next();
  };
};

// Schemas
export const signupSchema = validateRequest(Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).required()
}));

export const loginSchema = validateRequest(Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
}));

export const productSchema = validateRequest(Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  fabric: Joi.string().allow('', null),
  colors: Joi.array().items(Joi.string()).allow(null),
  embroidery: Joi.string().allow('', null),
  image_url: Joi.string().required(),
  zoom_image_url: Joi.string().allow('', null),
  is_featured: Joi.boolean().default(false),
  artisan_notes: Joi.string().allow('', null)
}));

export const orderSchema = validateRequest(Joi.object({
  customer_name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  shipping_address: Joi.string().required(),
  city: Joi.string().required(),
  postal_code: Joi.string().required(),
  phone: Joi.string().allow('', null),
  total_amount: Joi.number().min(0).required(),
  payment_method: Joi.string().required(),
  items: Joi.array().items(Joi.object({
    product_id: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().min(0).required(),
    customization_notes: Joi.any().allow('', null)
  })).min(1).required()
}));

export const inquirySchema = validateRequest(Joi.object({
  customer_name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  category: Joi.string().required(),
  inquiry_type: Joi.string().required(),
  details: Joi.string().allow('', null),
  proposed_date: Joi.string().allow('', null)
}));

export const profileSchema = validateRequest(Joi.object({
  full_name: Joi.string().min(2).allow('', null),
  phone: Joi.string().allow('', null),
  avatar_url: Joi.string().allow('', null)
}));

export const categorySchema = validateRequest(Joi.object({
  name: Joi.string().min(2).required(),
  slug: Joi.string().min(2).required(),
  active: Joi.boolean().default(true)
}));

export const bannerSchema = validateRequest(Joi.object({
  title: Joi.string().allow('', null),
  subtitle: Joi.string().allow('', null),
  image_url: Joi.string().required(),
  link_url: Joi.string().allow('', null),
  active: Joi.boolean().default(true)
}));

export const reviewSchema = validateRequest(Joi.object({
  product_id: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow('', null)
}));

export const couponSchema = validateRequest(Joi.object({
  code: Joi.string().min(2).required(),
  discount_type: Joi.string().valid('percentage', 'flat').required(),
  discount_value: Joi.number().min(0).required(),
  active: Joi.boolean().default(true),
  expiry_date: Joi.string().allow('', null)
}));

