// ─────────────────────────────────────────────────────────────────────────────
//  SolEase · Email Templates
//  Design: dark-mode, certificates.dev–inspired aesthetic
//  Accent: #00DC82 (emerald green) on deep navy #0e1117 backgrounds
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  // backgrounds
  bg:            '#0e1117',
  bgDeep:        '#080c11',
  bgCard:        '#131820',
  bgTopbar:      '#1a1f2b',

  // borders
  border:        '#1e2533',
  borderMid:     '#2a2f3a',
  borderAccent:  '#1e3d2a',

  // text
  textPrimary:   '#f0f4ff',
  textSecondary: '#d4dbe8',
  textMuted:     '#8892a4',
  textSubtle:    '#5a6478',
  textDim:       '#3a4555',
  textDimmer:    '#2a3545',

  // accent
  accent:        '#00DC82',
  accentBg:      '#0a2016',

  // semantic
  warnBg:        '#1a1500',
  warnBorder:    '#3d2d0a',
  warnText:      '#a07020',
  dangerText:    '#f87171',
  dangerBg:      '#2d0a0a',
  dangerBorder:  '#5a1a1a',
  infoBg:        '#0f1f3d',
  infoBorder:    '#1e3566',
  infoText:      '#60a5fa',

  // button
  btnText:       '#0a0e14',

  // footer
  footerBg:      '#080c11',
  footerText:    '#2a3545',
  footerTld:     '#1a4030',
};

// ─── Shared partials ──────────────────────────────────────────────────────────

const LOGO_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 2L12 6L8 10L4 6L8 2Z" fill="white" opacity="0.5"/>
  <path d="M8 6L11 9L8 12L5 9L8 6Z" fill="white"/>
</svg>`;

const CHECK_SVG = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="13" cy="13" r="11" stroke="${COLORS.accent}" stroke-width="1.2"/>
  <path d="M8 13L11.5 16.5L18 9.5" stroke="${COLORS.accent}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const WARN_SVG = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7 1.5L12.5 11.5H1.5Z" stroke="${COLORS.warnText}" stroke-width="1.2" stroke-linejoin="round"/>
  <rect x="6.3" y="5.5" width="1.4" height="3.2" fill="${COLORS.warnText}" rx="0.4"/>
  <circle cx="7" cy="10" r="0.7" fill="${COLORS.warnText}"/>
</svg>`;

const INFO_SVG = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="7" cy="7" r="6" stroke="${COLORS.textDim}" stroke-width="1.2"/>
  <rect x="6.3" y="5.5" width="1.4" height="4" fill="${COLORS.textDim}" rx="0.5"/>
  <circle cx="7" cy="4" r="0.8" fill="${COLORS.textDim}"/>
</svg>`;

// Shared email header (logo + nav link)
const emailHeader = () => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
  style="background-color:${COLORS.bg};border-bottom:1px solid ${COLORS.border};">
  <tr>
    <td style="padding:18px 32px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="vertical-align:middle;">
                  <div style="width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,${COLORS.accent},#36e4da);display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;">
                    ${LOGO_SVG}
                  </div>
                </td>
                <td style="vertical-align:middle;padding-left:9px;">
                  <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:${COLORS.textPrimary};letter-spacing:-0.3px;">Sol<span style="color:${COLORS.accent}">Ease</span></span>
                </td>
              </tr>
            </table>
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <span style="font-size:11px;color:${COLORS.textSubtle};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">solease.io</span>
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
    <td style="padding:40px 32px 36px;${center ? 'text-align:center;' : ''}">
      <!-- eyebrow -->
      <div style="display:inline-block;border:1px solid ${COLORS.borderMid};border-radius:20px;padding:4px 12px;margin-bottom:18px;">
        <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background-color:${COLORS.accent};vertical-align:middle;margin-right:6px;"></span>
        <span style="font-size:11px;font-weight:500;color:${COLORS.accent};letter-spacing:0.3px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${eyebrow}</span>
      </div>
      <!-- title -->
      <h1 style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:26px;font-weight:700;line-height:1.2;color:${COLORS.textPrimary};letter-spacing:-0.5px;margin:0 0 10px 0;">
        ${title}
      </h1>
      <!-- subtitle -->
      <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;color:${COLORS.textMuted};margin:0;${center ? '' : 'max-width:420px;'}">
        ${subtitle}
      </p>
    </td>
  </tr>
</table>`;

// Shared footer
const emailFooter = (links = ['Help Center', 'Privacy']) => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
  style="background-color:${COLORS.footerBg};border-top:1px solid ${COLORS.border};">
  <tr>
    <td style="padding:20px 32px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td>
            <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;color:${COLORS.footerText};">Sol<span style="color:${COLORS.footerTld};">Ease</span></span>
          </td>
          <td style="text-align:right;">
            ${links.map(l => `<a href="#" style="font-size:11px;color:${COLORS.textDim};text-decoration:none;margin-left:16px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${l}</a>`).join('')}
          </td>
        </tr>
      </table>
      <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:${COLORS.footerText};margin:8px 0 0 0;">
        &copy; ${new Date().getFullYear()} SolEase Inc. All rights reserved.
      </p>
    </td>
  </tr>
</table>`;

// Shared CTA button
const emailButton = (text, url, ghost = false) => ghost
  ? `<a href="${url}" style="display:inline-block;background:transparent;color:${COLORS.accent};font-size:14px;font-weight:700;padding:11px 24px;border-radius:8px;text-decoration:none;border:1px solid ${COLORS.borderMid};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${text}</a>`
  : `<a href="${url}" style="display:inline-block;background-color:${COLORS.accent};color:${COLORS.btnText};font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${text}</a>`;

// ─── 1. WELCOME EMAIL ─────────────────────────────────────────────────────────

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Welcome to SolEase</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgDeep};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bgDeep};padding:32px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background-color:${COLORS.bg};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.borderMid};">
          <tr><td>${emailHeader()}</td></tr>

          <tr><td>${emailHero({
            eyebrow: 'New Account',
            title: `Welcome to SolEase,<br><span style="color:${COLORS.accent}">{{userName}}</span>`,
            subtitle: 'Experience technical serenity with precision concierge IT support. We manage the complexity so you can focus on what matters.'
          })}</td></tr>

          <!-- Feature cards -->
          <tr>
            <td style="background-color:${COLORS.bg};padding:32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  ${[
                    { icon: '🎫', title: 'Submit a ticket',   desc: 'Describe your issue and our concierge handles the rest.',       link: 'Open Portal →' },
                    { icon: '📚', title: 'Browse knowledge',  desc: 'Curated guides for quick self-service solutions.',               link: 'View Library →' },
                    { icon: '📊', title: 'Track progress',    desc: 'Real-time updates on all your active requests.',                 link: 'Dashboard →' },
                  ].map(f => `
                    <td width="33%" style="vertical-align:top;padding:0 6px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                        style="background-color:${COLORS.bgCard};border:1px solid ${COLORS.border};border-radius:10px;">
                        <tr><td style="padding:16px 14px;">
                          <div style="width:34px;height:34px;border-radius:8px;background-color:${COLORS.accentBg};border:1px solid ${COLORS.borderAccent};display:inline-flex;align-items:center;justify-content:center;font-size:14px;margin-bottom:10px;">${f.icon}</div>
                          <div style="font-size:13px;font-weight:600;color:${COLORS.textSecondary};margin-bottom:4px;">${f.title}</div>
                          <div style="font-size:11px;color:${COLORS.textSubtle};line-height:1.5;margin-bottom:8px;">${f.desc}</div>
                          <a href="#" style="font-size:11px;font-weight:600;color:${COLORS.accent};text-decoration:none;">${f.link}</a>
                        </td></tr>
                      </table>
                    </td>`).join('')}
                </tr>
              </table>

              <div style="text-align:center;margin-top:24px;">
                ${emailButton('Get started →', '#')}
              </div>
              <p style="text-align:center;font-size:12px;color:${COLORS.textDim};margin:14px 0 0 0;">
                Questions? Reply to this email or contact our support team.
              </p>
            </td>
          </tr>

          <tr><td>${emailFooter(['Help Center', 'Privacy', 'Security'])}</td></tr>
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
  <title>Verify Your Email — SolEase</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgDeep};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bgDeep};padding:32px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background-color:${COLORS.bg};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.borderMid};">
          <tr><td>${emailHeader()}</td></tr>

          <tr><td>${emailHero({
            eyebrow: 'Email Verification',
            title: `Verify your<br><span style="color:${COLORS.accent}">email address</span>`,
            subtitle: 'Enter the code below to complete your account setup. This only takes a moment.'
          })}</td></tr>

          <!-- OTP block -->
          <tr>
            <td style="background-color:${COLORS.bg};padding:32px;">

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color:${COLORS.bgCard};border:1px solid ${COLORS.border};border-radius:10px;margin-bottom:20px;">
                <tr>
                  <td style="padding:28px;text-align:center;">
                    <p style="font-size:12px;color:${COLORS.textSubtle};margin:0 0 14px 0;">Your one-time verification code</p>
                    <div style="font-family:'Courier New',Courier,monospace;font-size:38px;font-weight:700;letter-spacing:12px;color:${COLORS.accent};">
                      {verificationCode}
                    </div>
                    <div style="display:inline-block;border:1px solid ${COLORS.border};border-radius:20px;padding:4px 12px;margin-top:14px;">
                      <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background-color:${COLORS.accent};vertical-align:middle;margin-right:6px;"></span>
                      <span style="font-size:11px;color:${COLORS.textSubtle};">Expires in 15 minutes</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Info notice -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color:${COLORS.bgCard};border:1px solid ${COLORS.border};border-radius:8px;">
                <tr>
                  <td style="padding:12px 16px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:10px;">${INFO_SVG}</td>
                        <td style="font-size:12px;color:${COLORS.textSubtle};line-height:1.5;">
                          Didn't create an account? You can safely ignore this email — nothing will change.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr><td>${emailFooter(['Help Center', 'Privacy'])}</td></tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

// ─── 3. PASSWORD RESET REQUEST ────────────────────────────────────────────────

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Reset Your Password — SolEase</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgDeep};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bgDeep};padding:32px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background-color:${COLORS.bg};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.borderMid};">
          <tr><td>${emailHeader()}</td></tr>

          <tr><td>${emailHero({
            eyebrow: 'Password Reset',
            title: `Reset your<br><span style="color:${COLORS.accent}">password</span>`,
            subtitle: 'We received a request to reset your SolEase password. Click the button below to set a new one.'
          })}</td></tr>

          <!-- CTA card -->
          <tr>
            <td style="background-color:${COLORS.bg};padding:32px;">

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color:${COLORS.bgCard};border:1px solid ${COLORS.border};border-radius:10px;margin-bottom:16px;">
                <tr>
                  <td style="padding:28px;text-align:center;">
                    <p style="font-size:13px;color:${COLORS.textSubtle};line-height:1.6;margin:0 0 18px 0;">
                      This link is single-use and expires in
                      <span style="color:${COLORS.textSecondary};font-weight:600;">1 hour</span>.
                    </p>
                    ${emailButton('Set new password &rarr;', '{resetURL}')}
                    <p style="font-size:11px;color:${COLORS.textDimmer};margin:14px 0 0 0;">
                      Or copy the link: {resetURL}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Warning notice -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color:${COLORS.warnBg};border:1px solid ${COLORS.warnBorder};border-radius:8px;">
                <tr>
                  <td style="padding:12px 16px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:10px;">${WARN_SVG}</td>
                        <td style="font-size:12px;color:${COLORS.warnText};line-height:1.5;">
                          If you didn't request this, your password remains unchanged. No action needed.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr><td>${emailFooter(['Help Center', 'Privacy'])}</td></tr>
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
  <title>Password Changed — SolEase</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgDeep};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bgDeep};padding:32px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background-color:${COLORS.bg};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.borderMid};">
          <tr><td>${emailHeader()}</td></tr>

          <!-- Hero (centered, with success ring above eyebrow) -->
          <tr>
            <td style="background-color:${COLORS.bg};padding:40px 32px 36px;text-align:center;border-bottom:1px solid ${COLORS.border};">
              <!-- Success ring -->
              <div style="width:60px;height:60px;border-radius:50%;background-color:${COLORS.accentBg};border:1px solid ${COLORS.borderAccent};display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
                ${CHECK_SVG}
              </div>
              <!-- Eyebrow -->
              <div style="display:inline-block;border:1px solid ${COLORS.borderMid};border-radius:20px;padding:4px 12px;margin-bottom:18px;">
                <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background-color:${COLORS.accent};vertical-align:middle;margin-right:6px;"></span>
                <span style="font-size:11px;font-weight:500;color:${COLORS.accent};letter-spacing:0.3px;">Security Update</span>
              </div>
              <h1 style="font-size:26px;font-weight:700;line-height:1.2;color:${COLORS.textPrimary};letter-spacing:-0.5px;margin:0 0 10px 0;">
                Password changed<br><span style="color:${COLORS.accent};">successfully</span>
              </h1>
              <p style="font-size:14px;line-height:1.65;color:${COLORS.textMuted};margin:0 auto;max-width:380px;">
                Your SolEase account is now secured with your new password. You can sign in immediately.
              </p>
            </td>
          </tr>

          <!-- Tips + CTA -->
          <tr>
            <td style="background-color:${COLORS.bg};padding:32px;">
              <p style="font-size:11px;font-weight:700;color:${COLORS.textDim};text-transform:uppercase;letter-spacing:0.8px;margin:0 0 12px 0;">Security tips</p>

              ${[
                'Use a unique password not reused on other services',
                'Enable two-factor authentication for an extra layer of protection',
                'Never share your credentials — not even with support agents',
              ].map((tip, i) => `
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="border-bottom:1px solid ${COLORS.border};">
                <tr>
                  <td style="padding:12px 0;vertical-align:top;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:12px;">
                          <div style="width:22px;height:22px;border-radius:50%;border:1px solid ${COLORS.borderMid};display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${COLORS.accent};">${i + 1}</div>
                        </td>
                        <td style="font-size:13px;color:${COLORS.textMuted};line-height:1.55;">${tip}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>`).join('')}

              <div style="text-align:center;margin-top:24px;">
                ${emailButton('Sign in now &rarr;', '#')}
              </div>
              <p style="text-align:center;font-size:12px;color:${COLORS.dangerBg};margin:14px 0 0 0;">
                Didn't make this change?
                <strong style="color:${COLORS.dangerText};">Contact support immediately.</strong>
              </p>
            </td>
          </tr>

          <tr><td>${emailFooter(['Help Center', 'Privacy'])}</td></tr>
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
  <title>Ticket Updated — SolEase</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bgDeep};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${COLORS.bgDeep};padding:32px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background-color:${COLORS.bg};border-radius:12px;overflow:hidden;border:1px solid ${COLORS.borderMid};">
          <tr><td>${emailHeader()}</td></tr>

          <tr><td>${emailHero({
            eyebrow: 'Ticket Update',
            title: `Your ticket has<br><span style="color:${COLORS.accent}">been updated</span>`,
            subtitle: 'Hi {{userName}}, an agent has reviewed and updated the status of your support request.'
          })}</td></tr>

          <!-- Ticket details + agent note -->
          <tr>
            <td style="background-color:${COLORS.bg};padding:32px;">

              <!-- Ticket table -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="border:1px solid ${COLORS.border};border-radius:10px;overflow:hidden;margin-bottom:16px;">
                ${[
                  ['Ticket ID',  '#{{ticketId}}'],
                  ['Subject',    '{{subject}}'],
                  ['Priority',   `<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background-color:${COLORS.dangerBg};color:${COLORS.dangerText};border:1px solid ${COLORS.dangerBorder};">{{priority}}</span>`],
                  ['Status',
                    `<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background-color:#1a1f2b;color:${COLORS.textSubtle};border:1px solid ${COLORS.borderMid};">{{previousStatus}}</span>
                     <span style="color:${COLORS.textDim};font-size:12px;margin:0 5px;">&#8594;</span>
                     <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background-color:{{statusBgColor}};color:{{statusTextColor}};border:1px solid {{statusBorderColor}};">{{newStatus}}</span>`
                  ],
                  ['Updated',    '{{updatedAt}}'],
                ].map(([label, value]) => `
                <tr style="border-bottom:1px solid ${COLORS.border};">
                  <td style="padding:11px 14px;font-size:13px;color:${COLORS.textSubtle};width:130px;">${label}</td>
                  <td style="padding:11px 14px;font-size:13px;color:${COLORS.textSecondary};font-weight:500;">${value}</td>
                </tr>`).join('')}
              </table>

              <!-- Agent note -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color:${COLORS.bgCard};border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px;">
                    <p style="font-size:10px;font-weight:700;color:${COLORS.textSubtle};text-transform:uppercase;letter-spacing:0.8px;margin:0 0 8px 0;">Agent note</p>
                    <p style="font-size:13px;color:${COLORS.textMuted};line-height:1.6;margin:0;">{{statusMessage}}</p>
                  </td>
                </tr>
              </table>

              <!-- Buttons -->
              <div style="text-align:center;">
                ${emailButton('View ticket &rarr;', '#')}
                &nbsp;&nbsp;
                ${emailButton('Reply to agent', '#', true)}
              </div>

            </td>
          </tr>

          <tr><td>${emailFooter(['Help Center', 'Privacy', 'Unsubscribe'])}</td></tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;