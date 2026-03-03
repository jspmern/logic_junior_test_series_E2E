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

/* ─────────────────────────────────────────────────────────────
   SHARED: base wrapper (header + footer + card shell)
───────────────────────────────────────────────────────────── */
const baseTemplate = (title, bodyContent) => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${title}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
    style="background-color:#0f0f1a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
          style="max-width:600px;width:100%;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#6C63FF 0%,#a78bfa 100%);
                        border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:26px;font-weight:800;
                          letter-spacing:1px;line-height:1.2;">
                <a href="https://www.logicjunior.com/" target="_blank"
                   style="color:#ffffff;text-decoration:none;">⚡ LogicJunior</a>
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;
                         letter-spacing:2px;text-transform:uppercase;">
                Test Series Platform
              </p>
            </td>
          </tr>

          <!-- ── CARD BODY ── -->
          <tr>
            <td style="background:#1a1a2e;padding:40px 40px 32px;border-left:1px solid #2e2e4a;
                        border-right:1px solid #2e2e4a;">
              ${bodyContent}
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#111126;padding:24px 40px;text-align:center;
                        border-radius:0 0 12px 12px;border:1px solid #2e2e4a;border-top:none;">
              <p style="margin:0 0 8px;color:#6b7280;font-size:12px;line-height:1.6;">
                You received this email because an account action was requested on
                <a href="https://www.logicjunior.com/" target="_blank"
                   style="color:#a78bfa;text-decoration:none;font-weight:600;">LogicJunior</a>.
                If you didn't request this, you can safely ignore this email.
              </p>
              <p style="margin:0;color:#4b5563;font-size:11px;">
                © ${new Date().getFullYear()} LogicJunior. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/* ─────────────────────────────────────────────────────────────
   TEMPLATE 1: OTP Verification Email
───────────────────────────────────────────────────────────── */
const getOtpEmailTemplate = (email, otp) => {
    const body = `
      <h2 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:700;">
        Email Verification
      </h2>
      <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.6;">
        Hi there! Use the one-time password below to verify your email address
        for your LogicJunior account.
      </p>

      <!-- OTP BOX -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center" style="padding:8px 0 24px;">
            <div style="display:inline-block;background:#0f0f1a;border:2px solid #6C63FF;
                         border-radius:12px;padding:20px 40px;">
              <span style="font-family:'Courier New',Courier,monospace;font-size:48px;
                            font-weight:800;letter-spacing:12px;color:#a78bfa;
                            line-height:1;">
                ${otp}
              </span>
            </div>
          </td>
        </tr>
      </table>

      <!-- INFO PILLS -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
        style="margin-bottom:24px;">
        <tr>
          <td align="center">
            <span style="display:inline-block;background:#1e1e38;border:1px solid #3b3b5c;
                           border-radius:20px;padding:6px 16px;color:#f59e0b;
                           font-size:12px;font-weight:600;margin:4px;">
              ⏱ Valid for 10 minutes
            </span>
            <span style="display:inline-block;background:#1e1e38;border:1px solid #3b3b5c;
                           border-radius:20px;padding:6px 16px;color:#ef4444;
                           font-size:12px;font-weight:600;margin:4px;">
              🔒 Do not share this code
            </span>
          </td>
        </tr>
      </table>

      <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;
                 border-top:1px solid #2e2e4a;padding-top:20px;">
        This OTP was requested for <strong style="color:#a78bfa;">${email}</strong>.
        Enter it on the LogicJunior sign-up page to continue.
      </p>
    `;
    return baseTemplate("Verify Your Email — LogicJunior", body);
};

/* ─────────────────────────────────────────────────────────────
   TEMPLATE 2: Password Reset Email
───────────────────────────────────────────────────────────── */
const getResetPasswordEmailTemplate = (email, resetLink) => {
    const body = `
      <h2 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:700;">
        Reset Your Password
      </h2>
      <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.6;">
        We received a request to reset the password for your LogicJunior account
        associated with <strong style="color:#a78bfa;">${email}</strong>.
        Click the button below to set a new password.
      </p>

      <!-- CTA BUTTON -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
        style="margin-bottom:24px;">
        <tr>
          <td align="center">
            <a href="${resetLink}"
              style="display:inline-block;background:linear-gradient(135deg,#6C63FF,#a78bfa);
                      color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;
                      padding:14px 36px;border-radius:8px;letter-spacing:0.5px;
                      mso-padding-alt:14px 36px;">
              Reset My Password &rarr;
            </a>
          </td>
        </tr>
      </table>

      <!-- FALLBACK LINK -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
        style="background:#0f0f1a;border:1px solid #2e2e4a;border-radius:8px;
                padding:16px;margin-bottom:24px;">
        <tr>
          <td>
            <p style="margin:0 0 6px;color:#6b7280;font-size:11px;
                       text-transform:uppercase;letter-spacing:1px;font-weight:600;">
              Or copy this link into your browser:
            </p>
            <p style="margin:0;word-break:break-all;color:#7c3aed;font-size:12px;">
              ${resetLink}
            </p>
          </td>
        </tr>
      </table>

      <!-- EXPIRY WARNING -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
        style="margin-bottom:20px;">
        <tr>
          <td>
            <span style="display:inline-block;background:#1e1e38;border:1px solid #3b3b5c;
                           border-radius:20px;padding:6px 16px;color:#f59e0b;
                           font-size:12px;font-weight:600;">
              ⏱ This link expires in 15 minutes
            </span>
          </td>
        </tr>
      </table>

      <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;
                 border-top:1px solid #2e2e4a;padding-top:20px;">
        For security, this link can only be used once. If you did not request a
        password reset, your account is safe — no changes have been made.
      </p>
    `;
    return baseTemplate("Password Reset Request — LogicJunior", body);
};

/* ─────────────────────────────────────────────────────────────
   SEND FUNCTIONS
───────────────────────────────────────────────────────────── */

/**
 * Send OTP verification email.
 * @param {string} to  - Recipient email address
 * @param {string} otp - 4-digit OTP string
 * @returns {Promise<object>} nodemailer send info (includes accepted/rejected arrays)
 */
const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: `"LogicJunior" <${process.env.SMTP_USER || "jspmern@gmail.com"}>`,
        to,
        subject: "Your LogicJunior Verification Code",
        html: getOtpEmailTemplate(to, otp),
    };
    const result = await transporter.sendMail(mailOptions);
    return result;
};

/**
 * Send password reset email.
 * @param {string} to        - Recipient email address
 * @param {string} resetLink - Full reset URL with token
 * @returns {Promise<object>} nodemailer send info (includes accepted/rejected arrays)
 */
const sendPasswordResetEmail = async (to, resetLink) => {
    const mailOptions = {
        from: `"LogicJunior" <${process.env.SMTP_USER || "jspmern@gmail.com"}>`,
        to,
        subject: "Password Reset Request — LogicJunior",
        html: getResetPasswordEmailTemplate(to, resetLink),
    };
    const result = await transporter.sendMail(mailOptions);
    return result;
};

module.exports = { sendOtpEmail, sendPasswordResetEmail };
