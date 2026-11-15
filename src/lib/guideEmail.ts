/**
 * Branded HTML for the guide email. Table layout and inline styles so it renders in
 * Gmail, Outlook and Apple Mail. Plain-text fallback is sent alongside it.
 */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SITE = 'https://relocateraleigh.com';

export function guideEmailHtml({ name, hasPdf }: { name?: string; hasPdf: boolean }) {
  const hello = name ? `Hi ${esc(name)},` : 'Hi there,';
  const lead = hasPdf
    ? 'Your Relocate Raleigh guide is attached. It has 8 chapters plus checklists, written by a tech worker who made the move himself.'
    : "Thanks for requesting the Relocate Raleigh guide. We'll email the PDF shortly.";

  const link = (href: string, label: string) =>
    `<a href="${href}" style="color:#1F1F1F;font-weight:600;text-decoration:underline;">${label}</a>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>Your Relocate Raleigh guide</title>
</head>
<body style="margin:0;padding:0;background:#F6F6F4;">
<div style="display:none;max-height:0;overflow:hidden;">${hasPdf ? 'Your guide is attached, plus three ways to start planning.' : 'Thanks for requesting the guide.'}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F6F4;">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FEFEFF;border-radius:20px;overflow:hidden;font-family:Poppins,'Segoe UI',Helvetica,Arial,sans-serif;color:#1F1F1F;">
    <tr><td style="background:#C4DFE8;background-image:linear-gradient(100deg,#C4DFE8,#E9E3D8 52%,#FCDABD);padding:28px 32px 36px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle;padding-right:10px;">
          <div style="width:0;height:0;border-left:11px solid transparent;border-right:11px solid transparent;border-bottom:19px solid #1F1F1F;"></div>
        </td>
        <td style="vertical-align:middle;font-size:16px;font-weight:600;">Relocate Raleigh</td>
      </tr></table>
      <h1 style="margin:28px 0 0;font-size:30px;line-height:1.15;font-weight:600;letter-spacing:-0.5px;">Your guide to moving to the Triangle</h1>
    </td></tr>
    <tr><td style="padding:32px;font-size:16px;line-height:1.65;">
      <p style="margin:0 0 16px;">${hello}</p>
      <p style="margin:0 0 24px;">${lead}</p>
      <p style="margin:0 0 12px;font-weight:600;">Three ways to start planning</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
        <tr><td style="padding:12px 0;border-top:1px solid #E7E7E7;">${link(`${SITE}/#math`, 'Run your numbers')}<br><span style="color:#545454;font-size:14px;">See what your salary is worth in Raleigh.</span></td></tr>
        <tr><td style="padding:12px 0;border-top:1px solid #E7E7E7;">${link(`${SITE}/#neighborhoods`, 'Shortlist neighborhoods')}<br><span style="color:#545454;font-size:14px;">Compare commutes, prices and schools.</span></td></tr>
        <tr><td style="padding:12px 0;border-top:1px solid #E7E7E7;border-bottom:1px solid #E7E7E7;">${link(`${SITE}/scouting`, 'Plan your scouting trip')}<br><span style="color:#545454;font-size:14px;">A 3- or 5-day itinerary you can print.</span></td></tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#1F1F1F;border-radius:999px;">
        <a href="${SITE}/#about" style="display:inline-block;padding:14px 26px;color:#FEFEFF;font-size:15px;font-weight:600;text-decoration:none;">Book a free call with Nick</a>
      </td></tr></table>
      <p style="margin:28px 0 0;color:#545454;font-size:14px;">Reply to this email with any questions about the move. We read every response.<br>The Relocate Raleigh team, (347) 757-9850</p>
    </td></tr>
  </table>
  <p style="margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#6E6E6E;">You're getting this because you asked for the guide on relocateraleigh.com.</p>
</td></tr>
</table>
</body>
</html>`;
}
