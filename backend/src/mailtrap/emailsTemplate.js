const COLORS = {
  primary: '#5648d5',
  primaryLight: '#776af8',
  primaryMuted: '#e7eeff',
  surfaceContainerLow: '#f0f3ff',
  surfaceContainer: '#e7eeff',
  surfaceContainerHigh: '#dde9ff',
  surfaceBright: '#f9f9ff',
  secondaryContainer: '#e4dff9',
  onSurface: '#243349',
  onSurfaceVariant: '#516078',
  onPrimary: '#fcf7ff',
  background: '#f9f9ff',
  white: '#FFFFFF',
  success: '#10B981',
  border: '#a3b3ce',
  textMuted: '#6c7b95',
};

const styles = {
  wrapper: `background-color: ${COLORS.surfaceBright}; padding: 32px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`,
  container: `max-width: 640px; margin: 0 auto;`,
  
  header: `padding: 24px 32px; display: flex; justify-content: space-between; align-items: center;`,
  logo: `font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 24px; color: ${COLORS.primary}; letter-spacing: -0.5px;`,
  headerIcons: `display: flex; gap: 16px;`,
  headerIcon: `width: 24px; height: 24px; color: ${COLORS.textMuted};`,
  
  heroCard: `background: linear-gradient(135deg, ${COLORS.surfaceContainerLow} 0%, ${COLORS.surfaceContainer} 100%); border-radius: 12px; padding: 40px; margin: 0 24px 24px 24px; text-align: left;`,
  heroTitle: `font-family: 'Manrope', sans-serif; font-size: 32px; font-weight: 800; color: ${COLORS.onSurface}; margin: 0 0 16px 0; line-height: 1.2;`,
  heroTitleAccent: `color: ${COLORS.primary};`,
  heroSubtitle: `font-size: 16px; color: ${COLORS.onSurfaceVariant}; line-height: 1.6; margin: 0 0 24px 0; max-width: 480px;`,
  button: `display: inline-block; background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%); color: ${COLORS.onPrimary}; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 10px;`,
  buttonIcon: `vertical-align: middle; margin-left: 8px;`,
  
  sectionTitle: `font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 700; color: ${COLORS.onSurface}; margin: 0 0 20px 0; padding: 0 24px;`,
  cardGrid: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 0 24px 24px 24px;`,
  card: `background-color: ${COLORS.surfaceContainerLow}; border-radius: 12px; padding: 24px;`,
  cardIcon: `width: 44px; height: 44px; border-radius: 50%; background-color: ${COLORS.secondaryContainer}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;`,
  cardIconSvg: `width: 24px; height: 24px; color: ${COLORS.primary};`,
  cardTitle: `font-family: 'Manrope', sans-serif; font-size: 16px; font-weight: 700; color: ${COLORS.onSurface}; margin: 0 0 8px 0;`,
  cardDesc: `font-size: 13px; color: ${COLORS.onSurfaceVariant}; line-height: 1.5; margin: 0 0 12px 0;`,
  cardLink: `font-size: 13px; font-weight: 600; color: ${COLORS.primary}; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;`,
  
  codeSection: `background-color: ${COLORS.surfaceContainerLow}; border-radius: 12px; padding: 32px; margin: 0 24px 24px 24px; text-align: center;`,
  codeLabel: `font-size: 14px; color: ${COLORS.onSurfaceVariant}; margin: 0 0 16px 0;`,
  codeBox: `background-color: ${COLORS.primaryMuted}; border: 2px dashed ${COLORS.primary}40; border-radius: 8px; padding: 20px; display: inline-block;`,
  code: `font-size: 32px; font-weight: 700; color: ${COLORS.primary}; letter-spacing: 8px; font-family: 'SF Mono', Monaco, monospace;`,
  codeNote: `font-size: 13px; color: ${COLORS.textMuted}; margin: 16px 0 0 0;`,
  
  successIcon: `width: 56px; height: 56px; border-radius: 50%; background-color: ${COLORS.secondaryContainer}; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;`,
  successCheck: `width: 28px; height: 28px; color: ${COLORS.primary};`,
  
  infoBox: `background-color: ${COLORS.surfaceContainerLow}; border-radius: 8px; padding: 20px; margin: 20px 24px;`,
  infoTitle: `font-size: 14px; font-weight: 600; color: ${COLORS.onSurface}; margin: 0 0 12px 0;`,
  infoItem: `font-size: 13px; color: ${COLORS.onSurfaceVariant}; margin: 8px 0; padding-left: 16px; position: relative;`,
  infoBullet: `position: absolute; left: 0; color: ${COLORS.textMuted};`,
  
  ticketCard: `background-color: ${COLORS.surfaceContainerLow}; border-radius: 8px; padding: 20px; margin: 0 24px 24px 24px;`,
  ticketRow: `display: flex; justify-content: space-between; margin: 10px 0;`,
  ticketLabel: `font-size: 13px; color: ${COLORS.textMuted};`,
  ticketValue: `font-size: 13px; color: ${COLORS.onSurface}; font-weight: 500;`,
  statusBadge: `display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;`,
  statusArrow: `color: ${COLORS.textMuted}; margin: 0 8px;`,
  
  note: `font-size: 13px; color: ${COLORS.textMuted}; margin: 0 24px 24px 24px; font-style: italic; text-align: center;`,
  
  footer: `background-color: ${COLORS.surfaceContainerLow}; padding: 24px 32px; margin-top: 24px;`,
  footerContent: `max-width: 640px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;`,
  footerText: `font-size: 12px; color: ${COLORS.textMuted}; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;`,
  footerLinks: `display: flex; gap: 24px;`,
  footerLink: `font-size: 12px; color: ${COLORS.textMuted}; font-weight: 500; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;`,
};

export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.surfaceBright}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.wrapper}">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.header}">
          <tr>
            <td style="${styles.logo}">SolEase</td>
            <td style="${styles.headerIcons}">
              <span style="${styles.headerIcon}">&#128100;</span>
              <span style="${styles.headerIcon}">&#10067;</span>
            </td>
          </tr>
        </table>
        
        <div style="${styles.heroCard}">
          <h1 style="${styles.heroTitle}">Verify your email</h1>
          <p style="${styles.heroSubtitle}">Enter the code below to verify your email address and complete your registration.</p>
          
          <div style="${styles.codeSection}">
            <p style="${styles.codeLabel}">Your verification code</p>
            <div style="${styles.codeBox}">
              <span style="${styles.code}">{verificationCode}</span>
            </div>
            <p style="${styles.codeNote}">This code expires in 15 minutes</p>
          </div>
        </div>
        
        <p style="${styles.note}">If you didn't create an account, you can safely ignore this email.</p>
        
        <div style="${styles.footer}">
          <div style="${styles.footerContent}">
            <span style="${styles.footerText}">&copy; ${new Date().getFullYear()} SolEase. All rights reserved.</span>
            <div style="${styles.footerLinks}">
              <a href="#" style="${styles.footerLink}">Help Center</a>
              <a href="#" style="${styles.footerLink}">Privacy</a>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.surfaceBright}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.wrapper}">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.header}">
          <tr>
            <td style="${styles.logo}">SolEase</td>
            <td style="${styles.headerIcons}">
              <span style="${styles.headerIcon}">&#128100;</span>
              <span style="${styles.headerIcon}">&#10067;</span>
            </td>
          </tr>
        </table>
        
        <div style="${styles.heroCard}">
          <div style="${styles.successIcon}">
            <span style="${styles.successCheck}">&#10003;</span>
          </div>
          <h1 style="${styles.heroTitle}; text-align: center;">Password changed</h1>
          <p style="${styles.heroSubtitle}; text-align: center; margin: 0 auto 24px auto;">Your password has been updated successfully. You can now sign in with your new password.</p>
          
          <div style="${styles.infoBox}">
            <p style="${styles.infoTitle}">Security tips</p>
            <p style="${styles.infoItem}"><span style="${styles.infoBullet}">&#8226;</span> Use a unique password you don't reuse elsewhere</p>
            <p style="${styles.infoItem}"><span style="${styles.infoBullet}">&#8226;</span> Consider enabling two-factor authentication</p>
            <p style="${styles.infoItem}"><span style="${styles.infoBullet}">&#8226;</span> Never share your password with anyone</p>
          </div>
        </div>
        
        <p style="${styles.note}">Didn't make this change? Contact support immediately.</p>
        
        <div style="${styles.footer}">
          <div style="${styles.footerContent}">
            <span style="${styles.footerText}">&copy; ${new Date().getFullYear()} SolEase. All rights reserved.</span>
            <div style="${styles.footerLinks}">
              <a href="#" style="${styles.footerLink}">Help Center</a>
              <a href="#" style="${styles.footerLink}">Privacy</a>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.surfaceBright}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.wrapper}">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.header}">
          <tr>
            <td style="${styles.logo}">SolEase</td>
            <td style="${styles.headerIcons}">
              <span style="${styles.headerIcon}">&#128100;</span>
              <span style="${styles.headerIcon}">&#10067;</span>
            </td>
          </tr>
        </table>
        
        <div style="${styles.heroCard}">
          <h1 style="${styles.heroTitle}">Reset your password</h1>
          <p style="${styles.heroSubtitle}">Click the button below to set a new password for your account.</p>
          
          <div style="text-align: center; margin: 24px 0;">
            <a href="{resetURL}" style="${styles.button}">
              Set new password
              <span style="${styles.buttonIcon}">&#10140;</span>
            </a>
          </div>
        </div>
        
        <p style="${styles.note}">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        
        <div style="${styles.footer}">
          <div style="${styles.footerContent}">
            <span style="${styles.footerText}">&copy; ${new Date().getFullYear()} SolEase. All rights reserved.</span>
            <div style="${styles.footerLinks}">
              <a href="#" style="${styles.footerLink}">Help Center</a>
              <a href="#" style="${styles.footerLink}">Privacy</a>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const TICKET_STATUS_UPDATE_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket Update</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.surfaceBright}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.wrapper}">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.header}">
          <tr>
            <td style="${styles.logo}">SolEase</td>
            <td style="${styles.headerIcons}">
              <span style="${styles.headerIcon}">&#128100;</span>
              <span style="${styles.headerIcon}">&#10067;</span>
            </td>
          </tr>
        </table>
        
        <div style="${styles.heroCard}">
          <h1 style="${styles.heroTitle}">Ticket update</h1>
          <p style="${styles.heroSubtitle}">Hi {{userName}}, your ticket has been updated.</p>
          
          <div style="${styles.ticketCard}">
            <div style="${styles.ticketRow}">
              <span style="${styles.ticketLabel}">Ticket ID</span>
              <span style="${styles.ticketValue}">#{{ticketId}}</span>
            </div>
            <div style="${styles.ticketRow}">
              <span style="${styles.ticketLabel}">Subject</span>
              <span style="${styles.ticketValue}">{{subject}}</span>
            </div>
            <div style="${styles.ticketRow}">
              <span style="${styles.ticketLabel}">Status</span>
              <span>
                <span style="background-color: #E5E7EB; color: #6B7280; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;">{{previousStatus}}</span>
                <span style="${styles.statusArrow}">&#10140;</span>
                <span style="background-color: {{statusColor}}; color: #FFFFFF; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;">{{newStatus}}</span>
              </span>
            </div>
          </div>
          
          <p style="font-size: 15px; color: ${COLORS.onSurfaceVariant}; margin: 20px 0;">{{statusMessage}}</p>
          
          <div style="text-align: center; margin-top: 24px;">
            <a href="#" style="${styles.button}">
              View ticket
              <span style="${styles.buttonIcon}">&#10140;</span>
            </a>
          </div>
        </div>
        
        <div style="${styles.footer}">
          <div style="${styles.footerContent}">
            <span style="${styles.footerText}">&copy; ${new Date().getFullYear()} SolEase. All rights reserved.</span>
            <div style="${styles.footerLinks}">
              <a href="#" style="${styles.footerLink}">Help Center</a>
              <a href="#" style="${styles.footerLink}">Privacy</a>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SolEase</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.surfaceBright}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.wrapper}">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${styles.header}">
          <tr>
            <td style="${styles.logo}">SolEase</td>
            <td style="${styles.headerIcons}">
              <span style="${styles.headerIcon}">&#128100;</span>
              <span style="${styles.headerIcon}">&#10067;</span>
            </td>
          </tr>
        </table>
        
        <div style="${styles.heroCard}">
          <h1 style="${styles.heroTitle}">Welcome to SolEase.<br/><span style="${styles.heroTitleAccent}">Your IT, simplified.</span></h1>
          <p style="${styles.heroSubtitle}">Experience technical serenity with our precision concierge IT support. We're here to manage the complexity so you can focus on what matters.</p>
          
          <a href="#" style="${styles.button}">
            Get started
            <span style="${styles.buttonIcon}">&#10140;</span>
          </a>
        </div>
        
        <h2 style="${styles.sectionTitle}">What's next</h2>
        
        <div style="${styles.cardGrid}">
          <div style="${styles.card}">
            <div style="${styles.cardIcon}">
              <span style="${styles.cardIconSvg}">&#127917;</span>
            </div>
            <h3 style="${styles.cardTitle}">Submit your first ticket</h3>
            <p style="${styles.cardDesc}">Need assistance? Briefly describe your issue and our concierge will handle the rest.</p>
            <a href="#" style="${styles.cardLink}">Open Portal <span>&#8599;</span></a>
          </div>
          
          <div style="${styles.card}">
            <div style="${styles.cardIcon}">
              <span style="${styles.cardIconSvg}">&#128218;</span>
            </div>
            <h3 style="${styles.cardTitle}">Explore knowledge</h3>
            <p style="${styles.cardDesc}">Access our curated library of guides and technical documentation for quick self-help.</p>
            <a href="#" style="${styles.cardLink}">Browse Library <span>&#10140;</span></a>
          </div>
          
          <div style="${styles.card}">
            <div style="${styles.cardIcon}">
              <span style="${styles.cardIconSvg}">&#128200;</span>
            </div>
            <h3 style="${styles.cardTitle}">Track progress</h3>
            <p style="${styles.cardDesc}">Stay informed with real-time updates on your active requests and resolution steps.</p>
            <a href="#" style="${styles.cardLink}">View Dashboard <span>&#128197;</span></a>
          </div>
        </div>
        
        <p style="${styles.note}">Questions? Reply to this email or contact our support team.</p>
        
        <div style="${styles.footer}">
          <div style="${styles.footerContent}">
            <span style="${styles.footerText}">&copy; ${new Date().getFullYear()} SolEase. All rights reserved.</span>
            <div style="${styles.footerLinks}">
              <a href="#" style="${styles.footerLink}">Help Center</a>
              <a href="#" style="${styles.footerLink}">Privacy</a>
              <a href="#" style="${styles.footerLink}">Security</a>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;
