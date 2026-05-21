import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"
import { createServiceClient } from "@/lib/supabase"
import { scheduleReminders } from "@/lib/reminders"
import { sendConfirmationEmail } from "@/lib/email"
import { sendDemoConfirmedWA } from "@/lib/whatsapp"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://scope.flowa.co.za"

function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.CALCOM_WEBHOOK_SECRET ?? ""
  if (!secret) return true // skip verification if not configured
  const expected = createHmac("sha256", secret).update(body).digest("hex")
  return signature === expected
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get("x-cal-signature-256") ?? ""

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try { payload = JSON.parse(rawBody) } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }) }

  const triggerEvent = payload.triggerEvent as string
  const booking = payload.payload as Record<string, unknown>

  // Extract submission_id from booking metadata or attendee notes
  const metadata = (booking.metadata ?? {}) as Record<string, string>
  const submissionId = metadata.submission_id as string | undefined
  if (!submissionId) return NextResponse.json({ ok: true, note: "no submission_id" })

  const db = createServiceClient()

  if (triggerEvent === "BOOKING_CREATED" || triggerEvent === "BOOKING_RESCHEDULED") {
    const startTime = booking.startTime as string
    const demoAt = new Date(startTime)
    const bookingId = booking.uid as string

    const demoStatus = triggerEvent === "BOOKING_RESCHEDULED" ? "rescheduled" : "booked"

    await db.from("submissions").update({
      demo_booking_id: bookingId,
      demo_at: demoAt.toISOString(),
      demo_status: demoStatus,
      status: "demo_booked",
    }).eq("id", submissionId)

    // Schedule reminders
    await scheduleReminders(submissionId, demoAt)

    // Send confirmation to customer
    const { data: sub } = await db.from("submissions")
      .select("first_name, work_email, mobile_e164, company_legal_name, recommended_tier")
      .eq("id", submissionId).single()

    if (sub) {
      const rescheduleUrl = `${APP_URL}/reschedule/${submissionId}`
      await sendConfirmationEmail({
        to: sub.work_email,
        firstName: sub.first_name,
        companyLegalName: sub.company_legal_name,
        tier: sub.recommended_tier ?? "Growth",
        demoAt,
        rescheduleUrl,
        submissionId,
      }).catch(console.error)
      await sendDemoConfirmedWA(sub.mobile_e164, sub.first_name, demoAt, rescheduleUrl).catch(console.error)
    }
  } else if (triggerEvent === "BOOKING_CANCELLED") {
    await db.from("submissions").update({ demo_status: "cancelled" }).eq("id", submissionId)
    await db.from("reminders").update({ status: "cancelled" }).eq("submission_id", submissionId).eq("status", "scheduled")
  }

  return NextResponse.json({ ok: true })
}
