import { createServiceClient } from "@/lib/supabase"
import Link from "next/link"
import { startOfWeek, endOfWeek, addWeeks, format, parseISO } from "date-fns"

const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  Starter: { bg: "#EFF8FF", color: "#175CD3" },
  Growth: { bg: "#F0FDF4", color: "#166534" },
  Pro: { bg: "#FEF9C3", color: "#854D0E" },
  Enterprise: { bg: "#F5F3FF", color: "#5B21B6" },
}

function tierBadge(tier: string) {
  const c = TIER_COLORS[tier] ?? { bg: "#F2F4F7", color: "#667085" }
  return (
    <span style={{
      display: "inline-block", padding: "1px 8px", borderRadius: "12px",
      backgroundColor: c.bg, color: c.color, fontSize: "11px", fontWeight: 600,
    }}>
      {tier ?? "—"}
    </span>
  )
}

function demoBadge(status: string) {
  const colors: Record<string, { bg: string; color: string }> = {
    attended: { bg: "#DCFCE7", color: "#14532D" },
    no_show: { bg: "#FEE2E2", color: "#991B1B" },
    rescheduled: { bg: "#FEF9C3", color: "#854D0E" },
    scheduled: { bg: "#F2F4F7", color: "#667085" },
  }
  const c = colors[status] ?? { bg: "#F2F4F7", color: "#667085" }
  return (
    <span style={{
      display: "inline-block", padding: "1px 8px", borderRadius: "12px",
      backgroundColor: c.bg, color: c.color, fontSize: "11px", fontWeight: 600,
    }}>
      {status?.replace(/_/g, " ") ?? "scheduled"}
    </span>
  )
}

type DemoRow = {
  id: string
  first_name: string
  last_name: string
  company_legal_name: string
  recommended_tier: string
  demo_at: string
  demo_status: string
}

export default async function CalendarPage() {
  let demos: DemoRow[] = []

  try {
    const db = createServiceClient()
    const now = new Date()
    const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const { data } = await db
      .from("submissions")
      .select("id, first_name, last_name, company_legal_name, recommended_tier, demo_at, demo_status")
      .gte("demo_at", now.toISOString())
      .lte("demo_at", in30.toISOString())
      .not("demo_status", "eq", "cancelled")
      .order("demo_at", { ascending: true })

    demos = (data ?? []) as DemoRow[]
  } catch {
    // Supabase not configured
  }

  // Group by week
  const weeks: { label: string; start: Date; end: Date; items: DemoRow[] }[] = []
  for (let i = 0; i < 5; i++) {
    const base = addWeeks(new Date(), i)
    const start = startOfWeek(base, { weekStartsOn: 1 })
    const end = endOfWeek(base, { weekStartsOn: 1 })
    const items = demos.filter(d => {
      const dt = parseISO(d.demo_at)
      return dt >= start && dt <= end
    })
    if (items.length > 0 || i < 4) {
      weeks.push({ label: `Week of ${format(start, "d MMM yyyy")}`, start, end, items })
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1F2A44", margin: 0 }}>Upcoming demos</h1>
        <p style={{ color: "#667085", fontSize: "14px", marginTop: "4px" }}>Next 30 days — {demos.length} demo{demos.length !== 1 ? "s" : ""} scheduled</p>
      </div>

      {weeks.map(week => (
        <div key={week.label} style={{ marginBottom: "28px" }}>
          <div style={{
            fontSize: "13px", fontWeight: 700, color: "#667085",
            textTransform: "uppercase", letterSpacing: "0.06em",
            marginBottom: "10px",
          }}>
            {week.label}
          </div>
          {week.items.length === 0 ? (
            <div style={{
              backgroundColor: "#fff", border: "1px solid #E4E7EC", borderRadius: "10px",
              padding: "20px", color: "#98A2B3", fontSize: "14px", textAlign: "center",
            }}>
              No demos this week
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {week.items.map(d => (
                <Link key={d.id} href={`/admin/submissions/${d.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    backgroundColor: "#fff",
                    border: "1px solid #D0D5DD",
                    borderRadius: "10px",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    cursor: "pointer",
                  }}>
                    <div style={{
                      minWidth: "80px",
                      textAlign: "center",
                      backgroundColor: "#F2F4F7",
                      borderRadius: "8px",
                      padding: "8px",
                    }}>
                      <div style={{ fontSize: "11px", color: "#667085", fontWeight: 600 }}>
                        {format(parseISO(d.demo_at), "EEE")}
                      </div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#1F2A44", lineHeight: 1.1 }}>
                        {format(parseISO(d.demo_at), "d")}
                      </div>
                      <div style={{ fontSize: "11px", color: "#667085" }}>
                        {format(parseISO(d.demo_at), "HH:mm")}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: 600, color: "#1F2A44" }}>
                        {d.first_name} {d.last_name}
                      </div>
                      <div style={{ fontSize: "13px", color: "#667085", marginTop: "2px" }}>
                        {d.company_legal_name}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {tierBadge(d.recommended_tier)}
                      {demoBadge(d.demo_status)}
                    </div>
                    <div style={{ color: "#D0D5DD", fontSize: "16px" }}>→</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      {demos.length === 0 && (
        <div style={{
          backgroundColor: "#fff", border: "1px solid #D0D5DD", borderRadius: "12px",
          padding: "48px", textAlign: "center",
        }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📅</div>
          <p style={{ color: "#667085", fontSize: "15px" }}>No demos scheduled in the next 30 days.</p>
        </div>
      )}
    </div>
  )
}
