// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
// ✅ Load environment variables first
dotenv.config();

const app = express();
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

//  Middleware (must come before routes)
app.use(cors());
app.use(express.json()); // parse JSON body
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug middleware to check request body (optional, remove in production)
app.use((req, res, next) => {
  console.log(`📩 ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

//  Routes
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const contactRoute = require("./routes/contact");

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);


app.use("/api/contact", contactRoute);

// Test route
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

//  Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
