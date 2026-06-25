import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please provide an image file to upload' });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // Upload buffer directly to Supabase storage bucket 'na-uploads'
    const { data, error } = await supabaseAdmin.storage
      .from('na-uploads')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.message,
        tip: 'Ensure that the storage bucket "na-uploads" is created in Supabase dashboard and set to public.'
      });
    }

    // Retrieve public link
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('na-uploads')
      .getPublicUrl(filePath);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: publicUrl
    });
  } catch (err) {
    next(err);
  }
});

export default router;
