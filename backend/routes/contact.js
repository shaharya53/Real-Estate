const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      replyTo: email, 
      to: process.env.EMAIL_USER,   
      subject: `Contact Form: ${subject}`,
      text: `
        You have a new message from your website contact form:

        Name: ${name}
        Email: ${email}
        Subject: ${subject}

        Message:
        ${message}
      `,
    };

    
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(" Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

module.exports = router;
