import { transporter, sender } from "../mailtrap/mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "../mailtrap/emailsTemplate.js";

///Verification page in the email
export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = email; // keep a separate variable, but as a string
  
    try {
      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: recipient,
        subject: "Verify your email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace(
          "{verificationCode}",
          verificationToken
        ),
      });
  
      console.log("✅ Verification email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending verification", error);
      throw new Error(`Error sending verification: ${error.message}`);
    }
};

//Will be created in the templates place the mailtrap.io
export const sendWelcomeEmail = async (email, name) => {
    try {
      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Welcome to SolEase 🎉",
        html: WELCOME_EMAIL_TEMPLATE.replace("Hello,", `Hello ${name},`),
      });
  
      console.log("✅ Welcome email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending welcome email:", error);
      throw new Error(`Error sending welcome email: ${error.message}`);
    }
};

//Reset password email form in the email view
export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Reset your password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      });
  
      console.log("✅ Password reset email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending password reset email", error);
      throw new Error(`Error sending password reset email: ${error.message}`);
    }
};


//After a successfully password reset send the following to email
export const sendResetSuccessEmail = async (email) => {
    try {
      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Password Reset Successful",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      });
  
      console.log("✅ Password reset success email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending password reset success email:", error);
      throw new Error(`Error sending password reset success email: ${error.message}`);
    }
};