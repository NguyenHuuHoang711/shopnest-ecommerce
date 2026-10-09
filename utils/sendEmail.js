const { Resend } = require("resend");

const sendEmail = async (to, subject, text) => {
  if (!process.env.RESEND_API_KEY) {
    console.log(`📧 [Email Simulation] To: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      text,
    });

    if (error) {
      console.warn("⚠️ Failed to send email via Resend:", error.message);
    }
  } catch (err) {
    console.warn("⚠️ Error initializing or sending email via Resend:", err.message);
  }
};

module.exports = sendEmail;
