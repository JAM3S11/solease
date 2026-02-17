import { transporter, sender } from "../mailtrap/mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, WELCOME_EMAIL_TEMPLATE, TICKET_STATUS_UPDATE_TEMPLATE } from "../mailtrap/emailsTemplate.js";

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


export const sendTicketStatusUpdateEmail = async (email, name, ticketId, subject, previousStatus, newStatus) => {
    try {
      const statusColor = getStatusColor(newStatus);
      const statusMessage = getStatusMessage(newStatus);
      
      let html = TICKET_STATUS_UPDATE_TEMPLATE
        .replace(/{{ticketId}}/g, ticketId)
        .replace(/{{subject}}/g, subject)
        .replace(/{{previousStatus}}/g, previousStatus)
        .replace(/{{newStatus}}/g, newStatus)
        .replace(/{{userName}}/g, name)
        .replace(/{{statusColor}}/g, statusColor)
        .replace(/{{statusMessage}}/g, statusMessage);

      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: `Ticket #${ticketId.slice(-6)} - Status Updated to ${newStatus}`,
        html: html,
      });
  
      console.log("✅ Ticket status update email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending ticket status update email:", error);
      throw new Error(`Error sending ticket status update email: ${error.message}`);
    }
};

function getStatusColor(status) {
  switch(status) {
    case 'Open': return '#3B82F6';
    case 'In Progress': return '#F59E0B';
    case 'Resolved': return '#10B981';
    case 'Closed': return '#6B7280';
    default: return '#6366F1';
  }
}

function getStatusMessage(status) {
  switch(status) {
    case 'In Progress': return 'A support team member has started working on your ticket. We will keep you updated on the progress.';
    case 'Resolved': return 'Great news! Your ticket has been resolved. Please review the solution and provide feedback if needed.';
    case 'Closed': return 'This ticket has been closed. If you have any further issues, please submit a new ticket.';
    default: return 'Your ticket status has been updated.';
  }
}

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