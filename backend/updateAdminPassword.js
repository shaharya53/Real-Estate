const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User"); // adjust path if needed

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/realestate", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("DB connected"))
  .catch(err => console.log(err));

const updatePassword = async () => {
  try {
    const newPassword = "arya1234"; // plain password
    const hash = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id: "689dfcdb3542e4254dea1034" }, // admin _id
      { $set: { password: hash } }
    );

    console.log("Admin password updated!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updatePassword();
