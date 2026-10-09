const Contact = require("../models/contact");

const sendContactMessage = async (req, res, next) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    const first = firstName?.trim();
    const last = lastName?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const msg = message?.trim();

    if (!first) {
      return res
        .status(400)
        .json({ error: "First Name field cannot be empty❌" });
    }

    if (!last) {
      return res
        .status(400)
        .json({ error: "Last Name field cannot be empty❌" });
    }

    if (!normalizedEmail) {
      return res.status(400).json({ error: "Email field cannot be empty❌" });
    }

    if (!msg) {
      return res.status(400).json({ error: "Message field cannot be empty❌" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        error: "Invalid email format ❌, please enter a valid email",
      });
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const count = await Contact.countDocuments({
      email: normalizedEmail,
      createdAt: { $gte: oneHourAgo },
    });

    if (count > 0) {
      return res.status(429).json({
        message: "You can only send 1 message per hour with the same email.",
      });
    }

    await Contact.create({
      firstName: first,
      lastName: last,
      email: normalizedEmail,
      message: msg,
    });

    res.status(201).json({
      message: "Message sent successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendContactMessage,
};
