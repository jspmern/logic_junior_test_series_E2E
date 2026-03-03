const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || "jspmern@gmail.com",
        pass: process.env.SMTP_PASS || "ixogybmguttpnzil",
    },
});
const handleTempaleHandler = (arg, resetLink) => {
    if (arg) {
        return `
          <h3>Password Reset Request</h3>
          <p>Click the link below to reset your password. This link is valid for 15 minutes.</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If you didn't request this, please ignore this email.</p>
        `;
    }
    else {
        return `
          <h3>otp</h3>  
          <p>your otp is ${resetLink}</p>
          <p>If you didn't request this, please ignore this email.</p>
        `;
    }
};
const sendResetPasswordEmail = async (to, resetLink, otp) => {
    const mailOptions = {
        from: `"LogicJunior" <${process.env.SMTP_USER || "jspmern@gmail.com"}>`,
        to,
        subject: "Password Reset Request",
        html: !otp ? handleTempaleHandler(true, resetLink) : handleTempaleHandler(null, otp),
    };

    const res = await transporter.sendMail(mailOptions);
    return res;
};

module.exports = { sendResetPasswordEmail };
