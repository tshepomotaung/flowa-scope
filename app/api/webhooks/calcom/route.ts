import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  // Phase B: handle BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED
  void req
  return NextResponse.json({ ok: true })
}
