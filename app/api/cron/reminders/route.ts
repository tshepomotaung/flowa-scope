import { NextRequest, NextResponse } from "next/server"
import { processDueReminders } from "@/lib/reminders"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }
  const result = await processDueReminders()
  return NextResponse.json({ ok: true, ...result })
}
