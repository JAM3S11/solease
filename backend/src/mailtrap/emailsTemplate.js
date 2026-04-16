// ─────────────────────────────────────────────────────────────────────────────
//  SolEase · Enterprise Email Templates
//  Design: Dark Tech / Enterprise SaaS Minimalism
//  Accent: #2563eb (blue) on #060b18 backgrounds
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  // backgrounds
  bg:            '#060b18',
  bgDeep:        '#040810',
  bgCard:        '#080e1e',
  bgTopbar:      '#0a0f1c',

  // borders
  border:        'rgba(255,255,255,0.06)',
  borderMid:     'rgba(255,255,255,0.12)',
  borderAccent:  'rgba(37,99,235,0.3)',

  // text
  textPrimary:   '#ffffff',
  textSecondary: 'rgba(255,255,255,0.9)',
  textMuted:     'rgba(255,255,255,0.65)',
  textSubtle:    'rgba(255,255,255,0.45)',
  textDim:       'rgba(255,255,255,0.25)',
  textDimmer:    'rgba(255,255,255,0.15)',

  // accent
  accent:        '#2563eb',
  accentBg:      'rgba(37,99,235,0.15)',
  accentLight:   '#3b82f6',

  // semantic
  warnBg:        'rgba(234,179,8,0.08)',
  warnBorder:    'rgba(234,179,8,0.25)',
  warnText:      '#facc15',
  dangerText:    '#f87171',
  dangerBg:      'rgba(239,68,68,0.08)',
  dangerBorder:  'rgba(239,68,68,0.25)',
  infoBg:        'rgba(37,99,235,0.08)',
  infoBorder:    'rgba(37,99,235,0.25)',
  infoText:      '#60a5fa',

  // button
  btnText:       '#ffffff',

  // footer
  footerBg:      '#040810',
  footerText:    'rgba(255,255,255,0.3)',
  footerTld:     '#2563eb',
};

const FONT_STACK = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// ─── Shared partials ──────────────────────────────────────────────────────────

const LOGO_SVG = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 2L12 6L8 10L4 6L8 2Z" fill="white" opacity="0.5"/>
  <path d="M8 6L11 9L8 12L5 9L8 6Z" fill="white"/>
</svg>`;

const CHECK_SVG = `<svg width="28" height="28" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="13" cy="13" r="11" stroke="${COLORS.accent}" stroke-width="1.5"/>
  <path d="M8 13L11.5 16.5L18 9.5" stroke="${COLORS.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const WARN_SVG = `<svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7 1.5L12.5 11.5H1.5Z" stroke="${COLORS.warnText}" stroke-width="1.5" stroke-linejoin="round"/>
  <rect x="6.3" y="5.5" width="1.4" height="3.2" fill="${COLORS.warnText}" rx="0.4"/>
  <circle cx="7" cy="10" r="0.7" fill="${COLORS.warnText}"/>
</svg>`;

const INFO_SVG = `<svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="7" cy="7" r="6" stroke="${COLORS.textSubtle}" stroke-width="1.5"/>
  <rect x="6.3" y="6.5" width="1.4" height="3" fill="${COLORS.textSubtle}" rx="0.5"/>
  <circle cx="7" cy="4.5" r="0.8" fill="${COLORS.textSubtle}"/>
</svg>`;

// Shared email header
const emailHeader = () => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
  style="background-color:${COLORS.bg};border-bottom:1px solid ${COLORS.border};">
  <tr>
    <td style="padding:24px 40px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="vertical-align:middle;">
                  <div style="width:32px;height:32px;border-radius:6px;background:linear-gradient(135deg,${COLORS.accent},${COLORS.accentLight});display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;">
                    ${LOGO_SVG}
                  </div>
                </td>
                <td style="vertical-align:middle;padding-left:12px;">
                  <span style="font-family:${FONT_STACK};font-size:18px;font-weight:700;color:${COLORS.textPrimary};letter-spacing:-0.4px;">Sol<span style="color:${COLORS.accent}">Ease</span></span>
                </td>
              </tr>
            </table>
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <a href="https://solease.io" style="font-size:12px;font-weight:500;color:${COLORS.textSubtle};text-decoration:none;font-family:${FONT_STACK};">Log in to Portal</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

// Shared hero banner
const emailHero = ({ eyebrow, title, subtitle, center = false }) => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
  style="background-color:${COLORS.bg};border-bottom:1px solid ${COLORS.border};">
  <tr>
    <td style="padding:48px 40px 40px;${center ? 'text-align:center;' : ''}">
      <!-- eyebrow -->
      <div style="margin-bottom:20px;">
        <span style="font-size:11px;font-weight:700;color:${COLORS.accent};letter-spacing:1px;text-transform:uppercase;font-family:${FONT_STACK};">${eyebrow}</span>
      </div>
      <!-- title -->
      <h1 style="font-family:${FONT_STACK};font-size:32px;font-weight:800;line-height:1.15;color:${COLORS.textPrimary};letter-spacing:-0.8px;margin:0 0 16px 0;">
        ${title}
      </h1>
      <!-- subtitle -->
      <p style="font-family:${FONT_STACK};font-size:16px;line-height:1.6;color:${COLORS.textMuted};margin:0;${center ? 'margin-left:auto;margin-right:auto;' : ''}max-width:480px;">
        ${subtitle}
      </p>
    </td>
  </tr>
</table>`;

// Shared footer
const emailFooter = (links = ['Help Center', 'Privacy Policy', 'Terms of Service']) => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
  style="background-color:${COLORS.footerBg};border-top:1px solid ${COLORS.border};">
  <tr>
    <td style="padding:40px 40px 32px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding-bottom:24px;border-bottom:1px solid ${COLORS.border};">
            <span style="font-family:${FONT_STACK};font-size:14px;font-weight:700;color:${COLORS.footerText};">Sol<span style="color:${COLORS.footerTld};">Ease</span></span>
            <div style="margin-top:8px;font-family:${FONT_STACK};font-size:12px;color:${COLORS.footerText};line-height:1.5;">
              Precision IT Concierge for Modern Enterprises<br>
              123 Tech Plaza, Suite 500, San Francisco, CA 94105
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding-top:24px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td>
                  <p style="font-family:${FONT_STACK};font-size:12px;color:${COLORS.footerText};margin:0;">
                    &copy; ${new Date().getFullYear()} SolEase Inc. All rights reserved.
                  </p>
                </td>
                <td style="text-align:right;">
                  ${links.map(l => `<a href="#" style="font-size:12px;color:${COLORS.footerText};text-decoration:none;margin-left:20px;font-family:${FONT_STACK};font-weight:500;">${l}</a>`).join('')}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-top:20px;text-align:center;">
             <p style="font-family:${FONT_STACK};font-size:11px;color:${COLORS.textDim};margin:0;">
              You received this email because you're a registered user of SolEase. 
              <a href="#" style="color:${COLORS.accent};text-decoration:none;">Manage Preferences</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

// Shared CTA button
const emailButton = (text, url, ghost = false) => ghost
  ? `<a href="${url}" style="display:inline-block;background:transparent;color:${COLORS.textPrimary};font-size:14px;font-weight:600;padding:12px 28px;border-radius:6px;text-decoration:none;border:1px solid ${COLORS.borderMid};font-family:${FONT_STACK};">${text}</a>`
  : `<a href="${url}" style="display:inline-block;background-color:${COLORS.accent};color:${COLORS.btnText};font-size:14px;font-weight:600;padding:14px 36px;border-radius:6px;text-decoration:none;font-family:${FONT_STACK};box-shadow:0 4px 12px rgba(37,99,235,0.2);">${text}</a>`;

// Verification code display
const verificationCodeBox = (code) => {
  const digits = code.split('');
  return digits.map(d => `<span style="display:inline-block;width:48px;height:64px;background-color:${COLORS.bgCard};border:1px solid ${COLORS.borderMid};border-radius:8px;font-family:'Monaco', 'Consolas', monospace;font-size:32px;font-weight:700;color:${COLORS.accent};line-height:64px;text-align:center;margin:0 6px;">${d}</span>`).join('');
};

// ─── 1. WELCOME EMAIL ─────────────────────────────────────────────────────────

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Welcome to SolEase</title>
  <style>
    body { margin: 0; padding: 0; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .mobile-hide { display: none !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgDeep};font-family:${FONT_STACK};">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bgDeep};padding:40px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:640px;margin:0 auto;background-color:${COLORS.bg};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.borderMid};box-shadow: 0 20px 50px rgba(0,0,0,0.3);" class="email-container">
          <tr><td>${emailHeader()}</td></tr>

          <tr><td>${emailHero({
            eyebrow: 'Onboarding',
            title: `Welcome to the<br><span style="color:${COLORS.accent}">Future of IT</span>`,
            subtitle: 'Hi {{userName}}, we\'re thrilled to have you. Experience a new standard of technical excellence and concierge support.'
          })}</td></tr>

          <!-- Main Content -->
          <tr>
            <td style="background-color:${COLORS.bg};padding:40px;">
              <h2 style="font-size:14px;font-weight:700;color:${COLORS.textSubtle};text-transform:uppercase;letter-spacing:1px;margin:0 0 24px 0;">Your Quick Start Guide</h2>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                ${[
                  { icon: '🎫', title: 'Smart Ticketing', desc: 'Submit requests via portal, email, or chat. Our AI routes it to the perfect specialist.', link: 'Open Ticket' },
                  { icon: '🔍', title: 'Knowledge Base', desc: 'Access enterprise-grade documentation and automated self-solve workflows.', link: 'Explore Docs' },
                  { icon: '📈', title: 'Live Dashboard', desc: 'Real-time visibility into your infrastructure, tickets, and team performance.', link: 'View Metrics' },
                ].map(f => `
                <tr>
                  <td style="padding-bottom:24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                      style="background-color:${COLORS.bgCard};border:1px solid ${COLORS.border};border-radius:12px;">
                      <tr>
                        <td style="padding:20px;vertical-align:top;width:40px;">
                          <div style="width:40px;height:40px;border-radius:10px;background-color:${COLORS.accentBg};border:1px solid ${COLORS.borderAccent};display:inline-flex;align-items:center;justify-content:center;font-size:18px;">${f.icon}</div>
                        </td>
                        <td style="padding:20px 20px 20px 0;">
                          <div style="font-size:16px;font-weight:700;color:${COLORS.textPrimary};margin-bottom:6px;">${f.title}</div>
                          <div style="font-size:14px;color:${COLORS.textMuted};line-height:1.5;margin-bottom:12px;">${f.desc}</div>
                          <a href="#" style="font-size:13px;font-weight:600;color:${COLORS.accent};text-decoration:none;">${f.link} &rarr;</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join('')}
              </table>

              <div style="text-align:center;margin-top:16px;">
                ${emailButton('Access Your Dashboard', '#')}
              </div>
            </td>
          </tr>

          <tr><td>${emailFooter()}</td></tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

// ─── 2. VERIFICATION EMAIL ────────────────────────────────────────────────────

export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Security Verification — SolEase</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgDeep};font-family:${FONT_STACK};">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bgDeep};padding:40px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background-color:${COLORS.bg};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.borderMid};">
          <tr><td>${emailHeader()}</td></tr>

          <tr><td>${emailHero({
            eyebrow: 'Identity Verification',
            title: `Confirm your<br><span style="color:${COLORS.accent}">Account Access</span>`,
            subtitle: 'To ensure your account remains secure, please enter the following verification code in your browser.'
          })}</td></tr>

          <tr>
            <td style="background-color:${COLORS.bg};padding:40px;">

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color:${COLORS.bgCard};border:1px solid ${COLORS.borderMid};border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:40px;text-align:center;">
                    <p style="font-size:13px;font-weight:600;color:${COLORS.textSubtle};text-transform:uppercase;letter-spacing:1px;margin:0 0 20px 0;">Your Secure Code</p>
                    <div style="display:inline-block;">
                      ${verificationCodeBox('{verificationCode}')}
                    </div>
                    <div style="margin-top:24px;">
                      <span style="font-size:12px;color:${COLORS.textSubtle};background-color:${COLORS.bg};padding:6px 12px;border-radius:20px;border:1px solid ${COLORS.border};">
                        Expires in 15 minutes
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color:${COLORS.infoBg};border:1px solid ${COLORS.infoBorder};border-radius:8px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:12px;">${INFO_SVG}</td>
                        <td style="font-size:13px;color:${COLORS.infoText};line-height:1.5;">
                          Security Note: If you did not attempt to sign up or log in to SolEase, please ignore this email. Your account security is our priority.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr><td>${emailFooter()}</td></tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

// ─── 3. PASSWORD RESET REQUEST (OTP) ─────────────────────────────────────────

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Reset Your Password — SolEase</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgDeep};font-family:${FONT_STACK};">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bgDeep};padding:40px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background-color:${COLORS.bg};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.borderMid};">
          <tr><td>${emailHeader()}</td></tr>

          <tr><td>${emailHero({
            eyebrow: 'Account Recovery',
            title: `Reset your<br><span style="color:${COLORS.accent}">Password</span>`,
            subtitle: 'We received a request to reset your password. Use the secure code below to proceed with the update.'
          })}</td></tr>

          <tr>
            <td style="background-color:${COLORS.bg};padding:40px;">

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color:${COLORS.bgCard};border:1px solid ${COLORS.borderMid};border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:40px;text-align:center;">
                    <p style="font-size:13px;font-weight:600;color:${COLORS.textSubtle};text-transform:uppercase;letter-spacing:1px;margin:0 0 20px 0;">Secure Reset Code</p>
                    <div style="font-family:'Monaco', 'Consolas', monospace;font-size:42px;font-weight:700;letter-spacing:12px;color:${COLORS.accent};">
                      {verificationCode}
                    </div>
                    <div style="margin-top:20px;">
                      <span style="font-size:12px;color:${COLORS.dangerText};background-color:${COLORS.dangerBg};padding:6px 12px;border-radius:20px;border:1px solid ${COLORS.dangerBorder};">
                        Expires in 5 minutes
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <div style="text-align:center;margin-bottom:32px;">
                ${emailButton('Reset My Password', '{resetPasswordURL}')}
              </div>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color:${COLORS.warnBg};border:1px solid ${COLORS.warnBorder};border-radius:8px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:12px;">${WARN_SVG}</td>
                        <td style="font-size:13px;color:${COLORS.warnText};line-height:1.5;">
                          If you did not request a password reset, no further action is required. Your current password will remain active.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr><td>${emailFooter()}</td></tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

// ─── 4. PASSWORD RESET SUCCESS ────────────────────────────────────────────────

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Security Alert — SolEase</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgDeep};font-family:${FONT_STACK};">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bgDeep};padding:40px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background-color:${COLORS.bg};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.borderMid};">
          <tr><td>${emailHeader()}</td></tr>

          <tr>
            <td style="background-color:${COLORS.bg};padding:56px 40px 40px;text-align:center;border-bottom:1px solid ${COLORS.border};">
              <div style="width:72px;height:72px;border-radius:50%;background-color:${COLORS.accentBg};border:1px solid ${COLORS.borderAccent};display:inline-flex;align-items:center;justify-content:center;margin-bottom:28px;">
                ${CHECK_SVG}
              </div>
              <div style="margin-bottom:16px;">
                <span style="font-size:11px;font-weight:700;color:${COLORS.accent};letter-spacing:1px;text-transform:uppercase;">Security Update</span>
              </div>
              <h1 style="font-size:32px;font-weight:800;line-height:1.15;color:${COLORS.textPrimary};letter-spacing:-0.8px;margin:0 0 16px 0;">
                Password Reset<br><span style="color:${COLORS.accent};">Successful</span>
              </h1>
              <p style="font-size:16px;line-height:1.6;color:${COLORS.textMuted};margin:0 auto;max-width:420px;">
                Your SolEase account password has been updated. You can now use your new credentials to access the portal.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:${COLORS.bg};padding:40px;">
              <h2 style="font-size:13px;font-weight:700;color:${COLORS.textSubtle};text-transform:uppercase;letter-spacing:1px;margin:0 0 20px 0;">Recommended Next Steps</h2>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                ${[
                  'Ensure your recovery email and phone number are up to date.',
                  'Enable Two-Factor Authentication (2FA) for enhanced security.',
                  'Review your recent sign-in activity in the Security Dashboard.',
                ].map((tip, i) => `
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid ${COLORS.border};">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:16px;">
                          <div style="width:24px;height:24px;border-radius:50%;border:1px solid ${COLORS.borderMid};display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${COLORS.accent};">${i + 1}</div>
                        </td>
                        <td style="font-size:14px;color:${COLORS.textSecondary};line-height:1.5;">${tip}</td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join('')}
              </table>

              <div style="text-align:center;margin-top:32px;">
                ${emailButton('Sign in to Account', '#')}
              </div>
              
              <div style="margin-top:32px;padding:20px;border-radius:10px;background-color:${COLORS.dangerBg};border:1px solid ${COLORS.dangerBorder};text-align:center;">
                <p style="font-size:13px;color:${COLORS.dangerText};margin:0;">
                  <strong>Did not perform this action?</strong><br>
                  Contact our security response team immediately at <a href="mailto:security@solease.io" style="color:${COLORS.dangerText};font-weight:700;">security@solease.io</a>
                </p>
              </div>
            </td>
          </tr>

          <tr><td>${emailFooter()}</td></tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

// ─── 5. TICKET STATUS UPDATE ──────────────────────────────────────────────────

export const TICKET_STATUS_UPDATE_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Ticket Status Update — SolEase</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgDeep};font-family:${FONT_STACK};">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bgDeep};padding:40px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:640px;margin:0 auto;background-color:${COLORS.bg};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.borderMid};">
          <tr><td>${emailHeader()}</td></tr>

          <tr><td>${emailHero({
            eyebrow: 'Service Desk Update',
            title: `Ticket Status<br><span style="color:${COLORS.accent}">Modified</span>`,
            subtitle: 'Hi {{userName}}, there has been a progress update on your technical support request.'
          })}</td></tr>

          <tr>
            <td style="background-color:${COLORS.bg};padding:40px;">

              <!-- Ticket Detail Table -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="border:1px solid ${COLORS.border};border-radius:12px;overflow:hidden;margin-bottom:24px;background-color:${COLORS.bgCard};">
                ${[
                  ['Ticket Reference',  '#{{ticketId}}'],
                  ['Subject Line',    '{{subject}}'],
                  ['Priority Level',   `<span style="display:inline-block;padding:4px 12px;border-radius:6px;font-size:11px;font-weight:700;background-color:${COLORS.dangerBg};color:${COLORS.dangerText};border:1px solid ${COLORS.dangerBorder};text-transform:uppercase;">{{priority}}</span>`],
                  ['Current Status',
                    `<span style="color:${COLORS.textSubtle};text-decoration:line-through;font-size:12px;margin-right:8px;">{{previousStatus}}</span>
                     <span style="display:inline-block;padding:4px 12px;border-radius:6px;font-size:11px;font-weight:700;background-color:{{statusBgColor}};color:{{statusTextColor}};border:1px solid {{statusBorderColor}};text-transform:uppercase;">{{newStatus}}</span>`
                  ],
                  ['Last Synchronized',    '{{updatedAt}}'],
                ].map(([label, value]) => `
                <tr>
                  <td style="padding:16px 20px;font-size:13px;color:${COLORS.textSubtle};width:140px;border-bottom:1px solid ${COLORS.border};">${label}</td>
                  <td style="padding:16px 20px;font-size:14px;color:${COLORS.textPrimary};font-weight:600;border-bottom:1px solid ${COLORS.border};">${value}</td>
                </tr>`).join('')}
              </table>

              <!-- Specialist Message -->
              <div style="margin-bottom:32px;">
                <h3 style="font-size:12px;font-weight:700;color:${COLORS.textSubtle};text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">Specialist Feedback</h3>
                <div style="padding:24px;background-color:${COLORS.bgCard};border-left:4px solid ${COLORS.accent};border-radius:0 8px 8px 0;">
                  <p style="font-size:15px;color:${COLORS.textSecondary};line-height:1.6;margin:0;font-style:italic;">"{{statusMessage}}"</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align:center;">
                    ${emailButton('Access Ticket Portal', '#')}
                    <div style="margin-top:20px;">
                      <a href="#" style="font-size:13px;font-weight:600;color:${COLORS.textMuted};text-decoration:none;">Add Comment to Ticket</a>
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr><td>${emailFooter(['Technical Support', 'Privacy Policy', 'Incident Logs'])}</td></tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

// ─── 6. NEWSLETTER SUBSCRIPTION CONFIRMATION ─────────────────────────────────

export const SUBSCRIPTION_CONFIRMATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Subscription Confirmed — SolEase</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgDeep};font-family:${FONT_STACK};">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bgDeep};padding:40px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:640px;margin:0 auto;background-color:${COLORS.bg};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.borderMid};">
          <tr><td>${emailHeader()}</td></tr>

          <tr>
            <td style="background-color:${COLORS.bg};padding:56px 40px 40px;text-align:center;border-bottom:1px solid ${COLORS.border};">
              <div style="width:72px;height:72px;border-radius:50%;background-color:${COLORS.accentBg};border:1px solid ${COLORS.borderAccent};display:inline-flex;align-items:center;justify-content:center;margin-bottom:28px;">
                ${CHECK_SVG}
              </div>
              <div style="margin-bottom:16px;">
                <span style="font-size:11px;font-weight:700;color:${COLORS.accent};letter-spacing:1px;text-transform:uppercase;">Communication Preferences</span>
              </div>
              <h1 style="font-size:32px;font-weight:800;line-height:1.15;color:${COLORS.textPrimary};letter-spacing:-0.8px;margin:0 0 16px 0;">
                Subscription<br><span style="color:${COLORS.accent}">Confirmed</span>
              </h1>
              <p style="font-size:16px;line-height:1.6;color:${COLORS.textMuted};margin:0 auto;max-width:440px;">
                Welcome to the SolEase Briefing. You're now set to receive enterprise IT insights, system updates, and exclusive feature previews.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:${COLORS.bg};padding:40px;">
              <h2 style="font-size:13px;font-weight:700;color:${COLORS.textSubtle};text-transform:uppercase;letter-spacing:1px;margin:0 0 24px 0;">What to expect in your inbox</h2>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                ${[
                  { icon: '🚀', title: 'Product Innovations', desc: 'Direct updates on new features and architectural improvements.' },
                  { icon: '🛡️', title: 'Security Advisories', desc: 'Critical alerts and best practices for infrastructure hardening.' },
                  { icon: '📊', title: 'Operational Excellence', desc: 'Case studies and data-driven insights to optimize your IT workflows.' },
                ].map(f => `
                <tr>
                  <td style="padding-bottom:24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="vertical-align:top;width:48px;">
                          <div style="font-size:24px;line-height:1;">${f.icon}</div>
                        </td>
                        <td style="padding-left:16px;">
                          <div style="font-size:16px;font-weight:700;color:${COLORS.textPrimary};margin-bottom:4px;">${f.title}</div>
                          <div style="font-size:14px;color:${COLORS.textMuted};line-height:1.5;">${f.desc}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join('')}
              </table>

              <div style="text-align:center;margin-top:16px;">
                ${emailButton('Explore Solution Library', '#')}
              </div>
            </td>
          </tr>

          <tr><td>${emailFooter(['Manage Subscriptions', 'Privacy Center', 'Archive'])}</td></tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`