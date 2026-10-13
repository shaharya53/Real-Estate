const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "available" },
  category: {
    type: String,
    enum: ["Apartment", "Villa", "Plot", "House"], // fixed options
    default: "Apartment"
  }
});

module.exports = mongoose.model("Property", propertySchema);
