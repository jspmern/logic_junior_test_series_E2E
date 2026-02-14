const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ||"smtp.gmail.com",
    port: process.env.SMTP_PORT ||587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER ||"jspmern@gmail.com",
        pass: process.env.SMTP_PASS ||"ixogybmguttpnzil",
    },
});

const sendResetPasswordEmail = async (to, resetLink) => {
    const mailOptions = {
        from: `"LogicJunior" <${process.env.SMTP_USER || "jspmern@gmail.com"}>`,
        to,
        subject: "Password Reset Request",
        html: `
            <h3>Password Reset Request</h3>
            <p>Click the link below to reset your password. This link is valid for 15 minutes.</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>If you didn't request this, please ignore this email.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };
