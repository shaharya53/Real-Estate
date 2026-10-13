// routes/properties.js
const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

// GET /properties/:id
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email");
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
