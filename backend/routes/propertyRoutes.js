const express = require("express");
const multer = require("multer");
const Property = require("../models/Property");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router();

// Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Add Property 
router.post("/", authMiddleware, adminMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    const images = req.files.map(file => `/uploads/${file.filename.replace(/\\/g, "/")}`);
    const { title, description, price, location, category } = req.body;

    const property = new Property({
      title,
      description,
      price,
      location,
      category,
      images,
      owner: req.user.id
    });

    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  const properties = await Property.find().populate("owner", "name email");
  res.json(properties);
});


router.get("/saved", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedProperties");
    res.json({ savedProperties: user.savedProperties });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email");
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id", authMiddleware, adminMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    const { title, description, price, location, category, existingImages } = req.body;
    const updatedData = { title, description, price, location, category };

    if (existingImages) {
      try {
        updatedData.images = JSON.parse(existingImages);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid existingImages format' });
      }
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename.replace(/\\/g, "/")}`);
      updatedData.images = updatedData.images ? [...updatedData.images, ...newImages] : newImages;
    }

    const property = await Property.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





router.post("/save/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const propertyId = req.params.id;

    if (!user.savedProperties.includes(propertyId)) {
      user.savedProperties.push(propertyId);
      await user.save();
    }

    res.json({ message: "Property saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unsave property
router.delete("/unsave/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const propertyId = req.params.id;

    user.savedProperties = user.savedProperties.filter(
      (id) => id.toString() !== propertyId
    );
    await user.save();

    res.json({ message: "Property removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


module.exports = router;
