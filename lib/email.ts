import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

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
  const recipients = (process.env.INTERNAL_NOTIFY_EMAILS || "").split(",").filter(Boolean)
  if (!recipients.length) return

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "hello@flowa.co.za",
    to: recipients,
    subject: `New scope submission — ${payload.companyLegalName} (${payload.tier})`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#1F2A44;margin-bottom:16px">New scope submission</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#667085;font-size:14px">Name</td><td style="padding:8px 0;font-size:14px;color:#1F2937">${payload.firstName} ${payload.lastName}</td></tr>
          <tr><td style="padding:8px 0;color:#667085;font-size:14px">Email</td><td style="padding:8px 0;font-size:14px;color:#1F2937">${payload.workEmail}</td></tr>
          <tr><td style="padding:8px 0;color:#667085;font-size:14px">Company</td><td style="padding:8px 0;font-size:14px;color:#1F2937">${payload.companyLegalName}</td></tr>
          <tr><td style="padding:8px 0;color:#667085;font-size:14px">Industry</td><td style="padding:8px 0;font-size:14px;color:#1F2937">${payload.industry}</td></tr>
          <tr><td style="padding:8px 0;color:#667085;font-size:14px">Recommended tier</td><td style="padding:8px 0;font-size:14px;font-weight:600;color:#1FAD5A">${payload.tier}</td></tr>
        </table>
        <div style="margin-top:24px">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://scope.flowa.co.za"}/admin/submissions/${payload.id}"
             style="background:#1FAD5A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">
            View submission →
          </a>
        </div>
        <p style="margin-top:32px;font-size:12px;color:#667085">
          POPIA Information Officer: Tshepo Motaung · info@flowa.co.za · Flowa (Pty) Ltd
        </p>
      </div>
    `,
  })
}
