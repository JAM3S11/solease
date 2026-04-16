import { transporter, sender } from "../mailtrap/mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, WELCOME_EMAIL_TEMPLATE, TICKET_STATUS_UPDATE_TEMPLATE, SUBSCRIPTION_CONFIRMATION_TEMPLATE } from "../mailtrap/emailsTemplate.js";

const TICKET_ASSIGNED_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .ticket-info { background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .ticket-id { font-size: 14px; color: #3B82F6; font-weight: bold; }
    .ticket-subject { font-size: 18px; font-weight: bold; color: #1f2937; margin: 10px 0; }
    .assignee { background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .assignee-name { font-weight: bold; color: #059669; }
    .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎫 Ticket Assignment Update</h1>
    </div>
    <div class="content">
      <p>Hello <strong>{{userName}}</strong>,</p>
      <p>Your ticket has been assigned to a support team member. Here's the update:</p>
      
      <div class="ticket-info">
        <div class="ticket-id">Ticket #{{ticketId}}</div>
        <div class="ticket-subject">{{subject}}</div>
      </div>
      
      <div class="assignee">
        <p><strong>Assigned To:</strong> <span class="assignee-name">{{assigneeName}}</span></p>
        <p>A support team member will now work on resolving your issue.</p>
      </div>
      
      <p>You will receive further notifications as your ticket progresses through the resolution process.</p>
      
      <center>
        <a href="{{ticketUrl}}" class="button">View Ticket Details</a>
      </center>
      
      <div class="footer">
        <p>This is an automated message from SolEase Support System.</p>
        <p>Please do not reply to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const TICKET_COMMENT_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .ticket-info { background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .ticket-id { font-size: 14px; color: #8B5CF6; font-weight: bold; }
    .ticket-subject { font-size: 18px; font-weight: bold; color: #1f2937; margin: 10px 0; }
    .comment { background: white; border-left: 4px solid #8B5CF6; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0; }
    .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💬 New Comment on Your Ticket</h1>
    </div>
    <div class="content">
      <p>Hello <strong>{{userName}}</strong>,</p>
      <p>There's a new comment on your ticket:</p>
      
      <div class="ticket-info">
        <div class="ticket-id">Ticket #{{ticketId}}</div>
        <div class="ticket-subject">{{subject}}</div>
      </div>
      
      <div class="comment">
        <p><strong>{{commenterName}}</strong> commented:</p>
        <p>{{commentContent}}</p>
      </div>
      
      <center>
        <a href="{{ticketUrl}}" class="button">View Full Conversation</a>
      </center>
      
      <div class="footer">
        <p>This is an automated message from SolEase Support System.</p>
        <p>Please do not reply to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

///Verification page in the email
export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = email;
  
    console.log("📧 Attempting to send verification email...");
    console.log("  To:", recipient.substring(0, 3) + "***@" + recipient.split('@')[1]);
    console.log("  Token:", verificationToken);
  
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
  
      console.log("✅ Verification email sent successfully!");
      console.log("  Message ID:", info.messageId);
      console.log("  Accepted:", info.accepted);
      console.log("  Rejected:", info.rejected);
      return info;
    } catch (error) {
      console.error("❌ Error sending verification email:");
      console.error("  Error name:", error.name);
      console.error("  Error message:", error.message);
      console.error("  Error code:", error.code);
      console.error("  Error errno:", error.errno);
      console.error("  Error syscall:", error.syscall);
      console.error("  Error address:", error.address);
      console.error("  Error port:", error.port);
      console.error("  Full error:", error);
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
        html: WELCOME_EMAIL_TEMPLATE.replace(/{{userName}}/g, name),
      });
  
      console.log("✅ Welcome email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending welcome email:", error);
      throw new Error(`Error sending welcome email: ${error.message}`);
    }
  };

//Reset password email form in the email view
export const sendPasswordResetEmail = async (email, otpCode, resetPasswordURL) => {
    try {
      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Reset your password - Verification Code",
        html: PASSWORD_RESET_REQUEST_TEMPLATE
          .replace("{verificationCode}", otpCode)
          .replace("{resetPasswordURL}", resetPasswordURL),
      });
  
      console.log("✅ Password reset email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending password reset email", error);
      throw new Error(`Error sending password reset email: ${error.message}`);
    }
};


export const sendTicketStatusUpdateEmail = async (email, name, ticketId, subject, previousStatus, newStatus, updatedAt) => {
    try {
      const statusColor = getStatusColor(newStatus);
      const statusMessage = getStatusMessage(newStatus);
      const { bgColor, textColor, borderColor } = getStatusColors(newStatus);
      
      let html = TICKET_STATUS_UPDATE_TEMPLATE
        .replace(/{{ticketId}}/g, ticketId)
        .replace(/{{subject}}/g, subject)
        .replace(/{{previousStatus}}/g, previousStatus)
        .replace(/{{newStatus}}/g, newStatus)
        .replace(/{{userName}}/g, name)
        .replace(/{{statusBgColor}}/g, bgColor)
        .replace(/{{statusTextColor}}/g, textColor)
        .replace(/{{statusBorderColor}}/g, borderColor)
        .replace(/{{statusMessage}}/g, statusMessage)
        .replace(/{{updatedAt}}/g, updatedAt || new Date().toLocaleString());

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

export const sendTicketAssignedEmail = async (email, name, ticketId, subject, assigneeName, updatedAt) => {
    try {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const ticketUrl = `${clientUrl}/client-dashboard/ticket/${ticketId}/feedback`;
      
      let html = TICKET_ASSIGNED_TEMPLATE
        .replace(/{{ticketId}}/g, ticketId.slice(-6).toUpperCase())
        .replace(/{{subject}}/g, subject)
        .replace(/{{userName}}/g, name)
        .replace(/{{assigneeName}}/g, assigneeName)
        .replace(/{{ticketUrl}}/g, ticketUrl)
        .replace(/{{updatedAt}}/g, updatedAt || new Date().toLocaleString());

      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: `Ticket #${ticketId.slice(-6).toUpperCase()} - Assigned to Support Team`,
        html: html,
      });
  
      console.log("✅ Ticket assigned email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending ticket assigned email:", error);
      throw new Error(`Error sending ticket assigned email: ${error.message}`);
    }
  };

export const sendTicketCommentEmail = async (email, name, ticketId, subject, commenterName, commentContent) => {
    try {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const ticketUrl = `${clientUrl}/client-dashboard/ticket/${ticketId}/feedback`;
      
      let html = TICKET_COMMENT_TEMPLATE
        .replace(/{{ticketId}}/g, ticketId.slice(-6).toUpperCase())
        .replace(/{{subject}}/g, subject)
        .replace(/{{userName}}/g, name)
        .replace(/{{commenterName}}/g, commenterName)
        .replace(/{{commentContent}}/g, commentContent.substring(0, 200) + (commentContent.length > 200 ? '...' : ''))
        .replace(/{{ticketUrl}}/g, ticketUrl);

      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: `Ticket #${ticketId.slice(-6).toUpperCase()} - New Comment`,
        html: html,
      });
  
      console.log("✅ Ticket comment email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending ticket comment email:", error);
      throw new Error(`Error sending ticket comment email: ${error.message}`);
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

function getStatusColors(status) {
  switch(status) {
    case 'OPEN': 
    case 'Open': 
      return { bgColor: '#1a3a5c', textColor: '#60a5fa', borderColor: '#1e4a7a' };
    case 'IN_PROGRESS': 
    case 'In Progress': 
      return { bgColor: '#3d2e0a', textColor: '#f59e0b', borderColor: '#5c4510' };
    case 'RESOLVED': 
    case 'Resolved': 
      return { bgColor: '#0a2f1f', textColor: '#10b981', borderColor: '#145a3a' };
    case 'CLOSED': 
    case 'Closed': 
      return { bgColor: '#1f1f1f', textColor: '#9ca3af', borderColor: '#374151' };
    default:
      return { bgColor: '#1a1f2b', textColor: '#818cf8', borderColor: '#312e81' };
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

//Send password update required email for weak passwords
export const sendPasswordUpdateRequiredEmail = async (email, name, deadline) => {
    try {
      const deadlineDate = new Date(deadline).toLocaleString();
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .deadline { font-size: 18px; font-weight: bold; color: #d32f2f; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Password Update Required</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <div class="warning">
                <strong>Important Security Notice</strong>
                <p>Your account has been flagged because your password does not meet our security requirements. For your protection, you must update your password.</p>
              </div>
              <p>Please update your password by:</p>
              <p class="deadline">${deadlineDate}</p>
              <p>After this deadline, you will be required to update your password before accessing your account.</p>
              <center>
                <a href="${process.env.CLIENT_URL}/auth/change-password" class="button">Update Password Now</a>
              </center>
              <p><strong>Password Requirements:</strong></p>
              <ul>
                <li>At least 8 characters</li>
                <li>At least one uppercase letter (A-Z)</li>
                <li>At least one lowercase letter (a-z)</li>
                <li>At least one number (0-9)</li>
                <li>At least one special character (!@#$%^&*)</li>
              </ul>
              <div class="footer">
                <p>This is an automated message from SolEase Support System.</p>
                <p>Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      
      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "⚠️ Action Required: Update Your Password - SolEase",
        html: html,
      });
  
console.log("✅ Password update required email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending password update required email:", error);
      throw new Error(`Error sending password update required email: ${error.message}`);
    }
};

export const sendSubscriptionConfirmationEmail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "You're Subscribed to SolEase! 🎉",
      html: SUBSCRIPTION_CONFIRMATION_TEMPLATE,
    });

    console.log("✅ Subscription confirmation email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending subscription confirmation email:", error);
    throw new Error(`Error sending subscription confirmation email: ${error.message}`);
  }
};