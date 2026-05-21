import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const db = createServiceClient()
  const { data } = await db
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000)

  if (!data) return NextResponse.json({ error: "No data" }, { status: 500 })

  const headers = [
    "id", "created_at", "first_name", "last_name", "work_email", "mobile_e164",
    "company_legal_name", "industry", "employee_band", "recommended_tier",
    "demo_at", "demo_status", "status", "timeline", "budget_band",
  ]

  const csv = [
    headers.join(","),
    ...data.map(row =>
      headers.map(h => JSON.stringify((row as Record<string, unknown>)[h] ?? "")).join(",")
    ),
  ].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="flowa-submissions-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}
