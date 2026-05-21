import { createServiceClient } from "@/lib/supabase"
import Link from "next/link"

interface StatCard {
  label: string
  value: number
  icon: string
}

function Card({ label, value, icon }: StatCard) {
  return (
    <div style={{
      backgroundColor: "#fff",
      border: "1px solid #D0D5DD",
      borderRadius: "12px",
      padding: "24px",
      display: "flex",
      alignItems: "flex-start",
      gap: "16px",
    }}>
      <div style={{ fontSize: "28px" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "32px", fontWeight: 800, color: "#1FAD5A", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "13px", color: "#667085", marginTop: "6px", fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  )
}

function statusBadge(status: string) {
  const colors: Record<string, { bg: string; color: string }> = {
    new: { bg: "#EFF8FF", color: "#175CD3" },
    qualified: { bg: "#F0FDF4", color: "#166534" },
    demo_booked: { bg: "#FEF9C3", color: "#854D0E" },
    demo_done: { bg: "#F5F3FF", color: "#5B21B6" },
    closed_won: { bg: "#DCFCE7", color: "#14532D" },
    closed_lost: { bg: "#FEE2E2", color: "#991B1B" },
  }
  const c = colors[status] ?? { bg: "#F2F4F7", color: "#667085" }
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "20px",
      backgroundColor: c.bg,
      color: c.color,
      fontSize: "12px",
      fontWeight: 600,
    }}>
      {status?.replace(/_/g, " ") ?? "—"}
    </span>
  )
}

export default async function AdminDashboardPage() {
  let newSubmissions = 0
  let demosThisWeek = 0
  let noShowsLast7d = 0
  let totalAttended = 0
  let recent: Record<string, unknown>[] = []

  try {
    const db = createServiceClient()

    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [newRes, demosRes, noShowRes, attendedRes, recentRes] = await Promise.all([
      db.from("submissions").select("id", { count: "exact", head: true })
        .eq("status", "new")
        .gte("created_at", sevenDaysAgo),
      db.from("submissions").select("id", { count: "exact", head: true })
        .gte("demo_at", weekStart.toISOString())
        .lt("demo_at", weekEnd.toISOString()),
      db.from("submissions").select("id", { count: "exact", head: true })
        .eq("demo_status", "no_show")
        .gte("demo_at", sevenDaysAgo),
      db.from("submissions").select("id", { count: "exact", head: true })
        .eq("demo_status", "attended"),
      db.from("submissions").select("id, first_name, last_name, company_legal_name, recommended_tier, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
    ])

    newSubmissions = newRes.count ?? 0
    demosThisWeek = demosRes.count ?? 0
    noShowsLast7d = noShowRes.count ?? 0
    totalAttended = attendedRes.count ?? 0
    recent = (recentRes.data ?? []) as Record<string, unknown>[]
  } catch {
    // Supabase not configured — show zeros
  }

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1F2A44", margin: 0 }}>Dashboard</h1>
        <p style={{ color: "#667085", fontSize: "14px", marginTop: "4px" }}>Overview of your pipeline</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "32px",
      }}>
        <Card label="New submissions (7d)" value={newSubmissions} icon="🆕" />
        <Card label="Demos this week" value={demosThisWeek} icon="📅" />
        <Card label="No-shows (7d)" value={noShowsLast7d} icon="🚫" />
        <Card label="Total attended" value={totalAttended} icon="✅" />
      </div>

      <div style={{
        backgroundColor: "#fff",
        border: "1px solid #D0D5DD",
        borderRadius: "12px",
        overflow: "hidden",
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E4E7EC" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1F2A44", margin: 0 }}>Recent submissions</h2>
        </div>
        {recent.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#667085" }}>No submissions yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#F9FAFB" }}>
                {["Name", "Company", "Tier", "Status", "Created"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#667085", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((row, i) => (
                <tr key={row.id as string} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#FAFAFA", borderTop: "1px solid #F2F4F7" }}>
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                    <Link href={`/admin/submissions/${row.id}`} style={{ color: "#1FAD5A", textDecoration: "none" }}>
                      {row.first_name as string} {row.last_name as string}
                    </Link>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "#1F2937" }}>{row.company_legal_name as string ?? "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "#1F2937" }}>{row.recommended_tier as string ?? "—"}</td>
                  <td style={{ padding: "12px 16px" }}>{statusBadge(row.status as string)}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#667085" }}>
                    {row.created_at ? new Date(row.created_at as string).toLocaleDateString("en-ZA") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #E4E7EC" }}>
          <Link href="/admin/submissions" style={{ fontSize: "13px", color: "#1FAD5A", fontWeight: 600, textDecoration: "none" }}>
            View all submissions →
          </Link>
        </div>
      </div>
    </div>
  )
}
