const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const SecondhandProduct = require('../models/SecondhandProduct');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const DataUriParser = require('datauri/parser');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const getDataUrl = (file) => {
  const parser  = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

async function uploadToCloudinaryWithRetry(dataUri, attempts = 2) {
  let lastError = null;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await cloudinary.uploader.upload(dataUri, {
        folder: 'secondhand_products',
      });
    } catch (err) {
      lastError = err;
      console.error(`Cloudinary upload failed (attempt ${i}/${attempts})`, err);
    }
  }
  throw lastError;
}

// GET all available products (exclude own)
router.get('/products', verifyToken, async (req, res) => {
  try {
    const products = await SecondhandProduct.find({
      status: 'available',
      user: { $ne: req.user._id },
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET user's own listings
router.get('/my-products', verifyToken, async (req, res) => {
  try {
    const products = await SecondhandProduct.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add product
router.post('/add-product', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, expiryDate } = req.body;

    let imageUrl      = '';
    let imagePublicId = '';

    if (req.file) {
      const fileUrl  = getDataUrl(req.file);
      try {
        const uploaded = await uploadToCloudinaryWithRetry(fileUrl.content, 2);
        imageUrl      = uploaded.secure_url;
        imagePublicId = uploaded.public_id;
      } catch (uploadErr) {
        // Fallback: allow listing without image if Cloudinary times out.
        console.error('Image upload failed, creating listing without image.', uploadErr);
      }
    }

    const product = new SecondhandProduct({
      user: req.user._id,
      name,
      description,
      image: imageUrl,
      imagePublicId,
      expiryDate,
    });

    await product.save();
    await product.populate('user', 'name email');
    res.json(product);
  } catch (err) {
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Image size must be 5MB or less.' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST buy product
router.post('/buy/:id', verifyToken, async (req, res) => {
  try {
    const product = await SecondhandProduct.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: 'Product not found' });
    if (product.user.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot buy your own product' });
    if (product.status !== 'available')
      return res.status(400).json({ message: 'Product is not available' });

    product.status = 'sold';
    product.buyer  = req.user._id;
    product.soldAt = new Date();
    await product.save();

    await User.findByIdAndUpdate(product.user, { $inc: { ecoCreds: 10 } });

    res.json({ message: 'Product purchased successfully! Seller earned 10 EcoCred points.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE product
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const product = await SecondhandProduct.findOne({
      _id:  req.params.id,
      user: req.user._id,
    });

    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await SecondhandProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;