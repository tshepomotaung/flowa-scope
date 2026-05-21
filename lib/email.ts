import { Resend } from "resend"
import { format } from "date-fns"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@flowa.co.za"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://scope.flowa.co.za"

const FOOTER = `
  <div style="margin-top:40px;padding-top:20px;border-top:1px solid #E4E7EC;font-size:11px;color:#98A2B3;line-height:1.6">
    <strong style="color:#667085">Flowa (Pty) Ltd</strong> · AI-Powered WhatsApp Commerce<br/>
    POPIA Information Officer: Tshepo Motaung · <a href="mailto:info@flowa.co.za" style="color:#1FAD5A">info@flowa.co.za</a><br/>
    <a href="${APP_URL}/privacy" style="color:#98A2B3">Privacy Notice</a>
  </div>
`

function wrap(body: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
  <body style="margin:0;padding:0;background:#F2F4F7;font-family:'Inter',Arial,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border:1px solid #D0D5DD;border-radius:16px;overflow:hidden">
    <div style="background:#1F2A44;padding:24px 32px;display:flex;align-items:center">
      <span style="color:#1FAD5A;font-weight:800;font-size:22px;letter-spacing:-0.5px">FLOWA</span>
    </div>
    <div style="padding:32px">${body}${FOOTER}</div>
  </div></body></html>`
}

// ── Internal new lead ─────────────────────────────────────────
interface InternalLeadPayload {
  id: string
  firstName: string
  lastName: string
  workEmail: string
  companyLegalName: string
  industry: string
  tier: string
}

export async function sendInternalLeadEmail(payload: InternalLeadPayload) {
  const recipients = (process.env.INTERNAL_NOTIFY_EMAILS ?? "").split(",").filter(Boolean)
  if (!recipients.length) return
  const body = `
    <h2 style="color:#1F2A44;margin-bottom:4px">New scope submission</h2>
    <p style="color:#667085;font-size:14px;margin-top:0">Just came in from ${payload.companyLegalName}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#667085;width:140px">Name</td><td style="padding:8px 0;color:#1F2937">${payload.firstName} ${payload.lastName}</td></tr>
      <tr><td style="padding:8px 0;color:#667085">Email</td><td style="padding:8px 0;color:#1F2937">${payload.workEmail}</td></tr>
      <tr><td style="padding:8px 0;color:#667085">Company</td><td style="padding:8px 0;color:#1F2937">${payload.companyLegalName}</td></tr>
      <tr><td style="padding:8px 0;color:#667085">Industry</td><td style="padding:8px 0;color:#1F2937">${payload.industry}</td></tr>
      <tr><td style="padding:8px 0;color:#667085">Tier</td><td style="padding:8px 0;color:#1FAD5A;font-weight:700">${payload.tier}</td></tr>
    </table>
    <div style="margin-top:24px">
      <a href="${APP_URL}/admin/submissions/${payload.id}" style="background:#1FAD5A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">View submission →</a>
    </div>
  `
  await resend.emails.send({ from: FROM, to: recipients, subject: `New scope — ${payload.companyLegalName} (${payload.tier})`, html: wrap(body) })
}

// ── Customer confirmation ─────────────────────────────────────
export async function sendConfirmationEmail(params: {
  to: string
  firstName: string
  companyLegalName: string
  tier: string
  demoAt?: Date
  rescheduleUrl?: string
  submissionId: string
}) {
  const demoLine = params.demoAt
    ? `<p style="font-size:15px;color:#1F2937">Your demo is booked for <strong>${format(params.demoAt, "EEEE d MMMM yyyy 'at' HH:mm")} (SAST)</strong>.</p>`
    : `<p style="font-size:15px;color:#667085">We'll be in touch to confirm a demo slot that works for you.</p>`
  const body = `
    <h2 style="color:#1F2A44">Hi ${params.firstName}, you're all set.</h2>
    ${demoLine}
    <div style="background:rgba(31,173,90,0.06);border:1px solid rgba(31,173,90,0.2);border-radius:12px;padding:20px;margin:24px 0">
      <div style="font-size:12px;font-weight:600;color:#667085;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Recommended plan</div>
      <div style="font-size:24px;font-weight:800;color:#1FAD5A">${params.tier}</div>
      <p style="font-size:14px;color:#1F2937;margin:8px 0 0">We'll confirm the details during the demo.</p>
    </div>
    <h3 style="color:#1F2A44">What happens next</h3>
    <ol style="color:#1F2937;font-size:14px;line-height:2;padding-left:20px">
      <li>We'll review your scope and prepare a tailored demo agenda.</li>
      <li>You'll get a reminder 24 hours before the call.</li>
      <li>We'll walk through exactly how Flowa can work for ${params.companyLegalName}.</li>
    </ol>
    ${params.rescheduleUrl ? `<p style="font-size:13px;color:#667085">Need to reschedule? <a href="${params.rescheduleUrl}" style="color:#1FAD5A">Pick a new time →</a></p>` : ""}
  `
  await resend.emails.send({ from: FROM, to: params.to, subject: "Your Flowa demo is confirmed", html: wrap(body) })
}

// ── Reminder 48h ─────────────────────────────────────────────
export async function sendReminder48hEmail(params: {
  to: string; firstName: string; demoAt: Date; rescheduleUrl: string
}) {
  const body = `
    <h2 style="color:#1F2A44">Your Flowa demo is in 2 days</h2>
    <p style="color:#1F2937;font-size:15px">Hi ${params.firstName}, just a heads-up — your discovery call is on <strong>${format(params.demoAt, "EEEE d MMMM 'at' HH:mm")} (SAST)</strong>.</p>
    <p style="color:#667085;font-size:14px">We'll send the join link an hour before the call.</p>
    <p style="font-size:13px;color:#667085">Need to reschedule? <a href="${params.rescheduleUrl}" style="color:#1FAD5A">Pick a new time →</a></p>
  `
  await resend.emails.send({ from: FROM, to: params.to, subject: "Flowa demo in 2 days", html: wrap(body) })
}

// ── Reminder 24h ─────────────────────────────────────────────
export async function sendReminder24hEmail(params: {
  to: string; firstName: string; demoAt: Date; rescheduleUrl: string
}) {
  const body = `
    <h2 style="color:#1F2A44">Your Flowa demo is tomorrow</h2>
    <p style="color:#1F2937;font-size:15px">Hi ${params.firstName}, your discovery call is tomorrow at <strong>${format(params.demoAt, "HH:mm")} (SAST)</strong>.</p>
    <p style="color:#667085;font-size:14px">We'll send the join link an hour before — see you then.</p>
    <p style="font-size:13px;color:#667085">Need to reschedule? <a href="${params.rescheduleUrl}" style="color:#1FAD5A">Pick a new time →</a></p>
  `
  await resend.emails.send({ from: FROM, to: params.to, subject: "Flowa demo tomorrow", html: wrap(body) })
}

// ── Reminder 1h ──────────────────────────────────────────────
export async function sendReminder1hEmail(params: {
  to: string; firstName: string; demoAt: Date; joinUrl: string
}) {
  const body = `
    <h2 style="color:#1F2A44">Your demo starts in 1 hour</h2>
    <p style="color:#1F2937;font-size:15px">Hi ${params.firstName}, your Flowa discovery call starts at <strong>${format(params.demoAt, "HH:mm")} (SAST)</strong> — that's in about an hour.</p>
    <div style="margin:24px 0;text-align:center">
      <a href="${params.joinUrl}" style="background:#1FAD5A;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:700;display:inline-block">Join the call →</a>
    </div>
  `
  await resend.emails.send({ from: FROM, to: params.to, subject: "Your Flowa demo starts in 1 hour", html: wrap(body) })
}

// ── Thank you ─────────────────────────────────────────────────
export async function sendThankYouEmail(params: {
  to: string; firstName: string; companyLegalName: string
}) {
  const body = `
    <h2 style="color:#1F2A44">Thanks for the call, ${params.firstName}</h2>
    <p style="color:#1F2937;font-size:15px">It was great learning about ${params.companyLegalName} and how we can help. Here's what happens next:</p>
    <ol style="color:#1F2937;font-size:14px;line-height:2;padding-left:20px">
      <li>We'll put together a proposal based on what we discussed.</li>
      <li>You'll hear from us within 1 business day.</li>
      <li>Reply to this email any time if you have questions.</li>
    </ol>
    <p style="color:#667085;font-size:14px">— Team Flowa</p>
  `
  await resend.emails.send({ from: FROM, to: params.to, subject: `Great talking, ${params.firstName} — next steps from Flowa`, html: wrap(body) })
}

// ── No-show follow-up ─────────────────────────────────────────
export async function sendNoShowEmail(params: {
  to: string; firstName: string; rescheduleUrl: string
}) {
  const body = `
    <h2 style="color:#1F2A44">We missed you</h2>
    <p style="color:#1F2937;font-size:15px">Hi ${params.firstName}, we had a demo booked today but couldn't connect. These things happen.</p>
    <p style="color:#667085;font-size:14px">If you'd still like to see Flowa in action, pick a time that works better:</p>
    <div style="margin:24px 0;text-align:center">
      <a href="${params.rescheduleUrl}" style="background:#1FAD5A;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:700;display:inline-block">Book a new time →</a>
    </div>
  `
  await resend.emails.send({ from: FROM, to: params.to, subject: "Did we miss each other?", html: wrap(body) })
}

// ── Reschedule link ───────────────────────────────────────────
export async function sendRescheduleEmail(params: {
  to: string; firstName: string; rescheduleUrl: string
}) {
  const body = `
    <h2 style="color:#1F2A44">Pick a new time, ${params.firstName}</h2>
    <p style="color:#1F2937;font-size:15px">Use the link below to choose a time that works for you:</p>
    <div style="margin:24px 0;text-align:center">
      <a href="${params.rescheduleUrl}" style="background:#1FAD5A;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:700;display:inline-block">Pick a new time →</a>
    </div>
  `
  await resend.emails.send({ from: FROM, to: params.to, subject: "Reschedule your Flowa demo", html: wrap(body) })
}
