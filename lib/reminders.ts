"use server"
import { createServiceClient } from "./supabase"
import { addHours, subHours } from "date-fns"
import {
  sendReminder48hEmail,
  sendReminder24hEmail,
  sendReminder1hEmail,
  sendThankYouEmail,
  sendNoShowEmail,
} from "./email"
import {
  sendDemo48hWA,
  sendDemo24hWA,
  sendDemo1hWA,
  sendThankYouWA,
  sendNoShowWA,
} from "./whatsapp"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://scope.flowa.co.za"

// Call this after a demo_at is set (new booking or reschedule)
export async function scheduleReminders(submissionId: string, demoAt: Date) {
  const db = createServiceClient()
  // Cancel any existing scheduled reminders
  await db.from("reminders").update({ status: "cancelled" }).eq("submission_id", submissionId).eq("status", "scheduled")

  const rows = [
    { channel: "email", template_id: "reminder_48h", fire_at: subHours(demoAt, 48).toISOString() },
    { channel: "whatsapp", template_id: "reminder_48h", fire_at: subHours(demoAt, 48).toISOString() },
    { channel: "email", template_id: "reminder_24h", fire_at: subHours(demoAt, 24).toISOString() },
    { channel: "whatsapp", template_id: "reminder_24h", fire_at: subHours(demoAt, 24).toISOString() },
    { channel: "email", template_id: "reminder_1h", fire_at: subHours(demoAt, 1).toISOString() },
    { channel: "whatsapp", template_id: "reminder_1h", fire_at: subHours(demoAt, 1).toISOString() },
    { channel: "email", template_id: "no_show", fire_at: addHours(demoAt, 2).toISOString() },
    { channel: "whatsapp", template_id: "no_show", fire_at: addHours(demoAt, 2).toISOString() },
    { channel: "email", template_id: "thank_you", fire_at: addHours(demoAt, 0.5).toISOString() },
  ]

  await db.from("reminders").insert(rows.map(r => ({ ...r, submission_id: submissionId, status: "scheduled" })))
}

// Called by the cron route to process due reminders
export async function processDueReminders() {
  const db = createServiceClient()
  const { data: due } = await db
    .from("reminders")
    .select("*, submissions(first_name, work_email, mobile_e164, company_legal_name, demo_at, demo_status)")
    .lte("fire_at", new Date().toISOString())
    .eq("status", "scheduled")
    .limit(50)

  if (!due?.length) return { processed: 0 }

  let processed = 0
  for (const r of due) {
    const sub = r.submissions as Record<string, string>
    if (!sub) continue
    const rescheduleUrl = `${APP_URL}/reschedule/${r.submission_id}`
    const demoAt = sub.demo_at ? new Date(sub.demo_at) : new Date()
    const joinUrl = sub.demo_at ? `https://cal.com/flowa` : `https://flowa.co.za`

    try {
      if (r.template_id === "reminder_48h") {
        if (r.channel === "email") await sendReminder48hEmail({ to: sub.work_email, firstName: sub.first_name, demoAt, rescheduleUrl })
        if (r.channel === "whatsapp") await sendDemo48hWA(sub.mobile_e164, sub.first_name, demoAt, rescheduleUrl)
      } else if (r.template_id === "reminder_24h") {
        if (r.channel === "email") await sendReminder24hEmail({ to: sub.work_email, firstName: sub.first_name, demoAt, rescheduleUrl })
        if (r.channel === "whatsapp") await sendDemo24hWA(sub.mobile_e164, sub.first_name, demoAt)
      } else if (r.template_id === "reminder_1h") {
        if (r.channel === "email") await sendReminder1hEmail({ to: sub.work_email, firstName: sub.first_name, demoAt, joinUrl })
        if (r.channel === "whatsapp") await sendDemo1hWA(sub.mobile_e164, sub.first_name, joinUrl)
      } else if (r.template_id === "thank_you" && sub.demo_status === "attended") {
        if (r.channel === "email") await sendThankYouEmail({ to: sub.work_email, firstName: sub.first_name, companyLegalName: sub.company_legal_name })
        if (r.channel === "whatsapp") await sendThankYouWA(sub.mobile_e164, sub.first_name, `${APP_URL}/confirm/${r.submission_id}`)
      } else if (r.template_id === "no_show" && sub.demo_status !== "attended") {
        if (r.channel === "email") await sendNoShowEmail({ to: sub.work_email, firstName: sub.first_name, rescheduleUrl })
        if (r.channel === "whatsapp") await sendNoShowWA(sub.mobile_e164, sub.first_name, rescheduleUrl)
        // Update demo_status
        await db.from("submissions").update({ demo_status: "no_show" }).eq("id", r.submission_id).eq("demo_status", "reminded_1h")
      }

      await db.from("reminders").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", r.id)
      processed++
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      await db.from("reminders").update({ status: "failed", error: errMsg }).eq("id", r.id)
    }
  }
  return { processed }
}
