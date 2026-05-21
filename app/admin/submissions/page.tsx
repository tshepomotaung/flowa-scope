import { createServiceClient } from "@/lib/supabase"
import Link from "next/link"

const STATUSES = ["all", "new", "qualified", "demo_booked", "demo_done", "proposal", "negotiation", "closed_won", "closed_lost", "on_hold"]
const TIERS = ["all", "Starter", "Growth", "Pro", "Enterprise"]
const PAGE_SIZE = 20

function statusBadge(status: string) {
  const colors: Record<string, { bg: string; color: string }> = {
    new: { bg: "#EFF8FF", color: "#175CD3" },
    qualified: { bg: "#F0FDF4", color: "#166534" },
    demo_booked: { bg: "#FEF9C3", color: "#854D0E" },
    demo_done: { bg: "#F5F3FF", color: "#5B21B6" },
    proposal: { bg: "#FFF7ED", color: "#9A3412" },
    negotiation: { bg: "#FDF4FF", color: "#86198F" },
    closed_won: { bg: "#DCFCE7", color: "#14532D" },
    closed_lost: { bg: "#FEE2E2", color: "#991B1B" },
    on_hold: { bg: "#F2F4F7", color: "#667085" },
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
      whiteSpace: "nowrap",
    }}>
      {status?.replace(/_/g, " ") ?? "—"}
    </span>
  )
}

interface SearchParams {
  status?: string
  tier?: string
  page?: string
}

export default async function SubmissionsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const statusFilter = sp.status && sp.status !== "all" ? sp.status : null
  const tierFilter = sp.tier && sp.tier !== "all" ? sp.tier : null
  const page = Math.max(1, parseInt(sp.page ?? "1", 10))
  const offset = (page - 1) * PAGE_SIZE

  let rows: Record<string, unknown>[] = []
  let total = 0

  try {
    const db = createServiceClient()
    let query = db.from("submissions").select(
      "id, created_at, first_name, last_name, work_email, company_legal_name, industry, recommended_tier, demo_at, demo_status, status",
      { count: "exact" }
    )
    if (statusFilter) query = query.eq("status", statusFilter)
    if (tierFilter) query = query.eq("recommended_tier", tierFilter)
    query = query.order("created_at", { ascending: false }).range(offset, offset + PAGE_SIZE - 1)

    const { data, count } = await query
    rows = (data ?? []) as Record<string, unknown>[]
    total = count ?? 0
  } catch {
    // Supabase not configured
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams()
    if (sp.status) params.set("status", sp.status)
    if (sp.tier) params.set("tier", sp.tier)
    if (sp.page) params.set("page", sp.page)
    Object.entries(overrides).forEach(([k, v]) => params.set(k, v))
    return `/admin/submissions?${params.toString()}`
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1F2A44", margin: 0 }}>Submissions</h1>
          <p style={{ color: "#667085", fontSize: "14px", marginTop: "4px" }}>{total} total</p>
        </div>
        <a
          href="/api/admin/export"
          style={{
            padding: "10px 18px",
            backgroundColor: "#1FAD5A",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          Export CSV
        </a>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <form method="get" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <select
            name="status"
            defaultValue={sp.status ?? "all"}
            style={{ padding: "8px 12px", border: "1px solid #D0D5DD", borderRadius: "8px", fontSize: "14px", backgroundColor: "#fff", cursor: "pointer" }}
            onChange={(e) => { const f = new FormData(); f.set("status", e.target.value); }}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s === "all" ? "All statuses" : s.replace(/_/g, " ")}</option>
            ))}
          </select>
          <select
            name="tier"
            defaultValue={sp.tier ?? "all"}
            style={{ padding: "8px 12px", border: "1px solid #D0D5DD", borderRadius: "8px", fontSize: "14px", backgroundColor: "#fff", cursor: "pointer" }}
          >
            {TIERS.map(t => (
              <option key={t} value={t}>{t === "all" ? "All tiers" : t}</option>
            ))}
          </select>
          <button
            type="submit"
            style={{ padding: "8px 16px", backgroundColor: "#1F2A44", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            Filter
          </button>
          {(statusFilter || tierFilter) && (
            <Link href="/admin/submissions" style={{ padding: "8px 16px", color: "#667085", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center" }}>
              Clear filters
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #D0D5DD", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ backgroundColor: "#F9FAFB", position: "sticky", top: 0 }}>
                {["Created", "Name", "Company", "Industry", "Tier", "Demo at", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#667085", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#667085" }}>No submissions found.</td>
                </tr>
              ) : rows.map((row, i) => (
                <tr key={row.id as string} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#FAFAFA", borderTop: "1px solid #F2F4F7" }}>
                  <td style={{ padding: "11px 14px", fontSize: "13px", color: "#667085", whiteSpace: "nowrap" }}>
                    {row.created_at ? new Date(row.created_at as string).toLocaleDateString("en-ZA") : "—"}
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: "14px", color: "#1F2937", fontWeight: 500, whiteSpace: "nowrap" }}>
                    {row.first_name as string} {row.last_name as string}
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: "14px", color: "#1F2937" }}>{row.company_legal_name as string ?? "—"}</td>
                  <td style={{ padding: "11px 14px", fontSize: "13px", color: "#667085" }}>{row.industry as string ?? "—"}</td>
                  <td style={{ padding: "11px 14px", fontSize: "13px", color: "#1F2937" }}>{row.recommended_tier as string ?? "—"}</td>
                  <td style={{ padding: "11px 14px", fontSize: "13px", color: "#667085", whiteSpace: "nowrap" }}>
                    {row.demo_at ? new Date(row.demo_at as string).toLocaleString("en-ZA", { dateStyle: "short", timeStyle: "short" }) : "—"}
                  </td>
                  <td style={{ padding: "11px 14px" }}>{statusBadge(row.status as string)}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <Link
                      href={`/admin/submissions/${row.id}`}
                      style={{ fontSize: "13px", color: "#1FAD5A", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid #E4E7EC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", color: "#667085" }}>
              Page {page} of {totalPages}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              {page > 1 && (
                <Link href={buildUrl({ page: String(page - 1) })} style={{ padding: "6px 14px", border: "1px solid #D0D5DD", borderRadius: "6px", fontSize: "13px", color: "#1F2937", textDecoration: "none", backgroundColor: "#fff" }}>
                  ← Prev
                </Link>
              )}
              {page < totalPages && (
                <Link href={buildUrl({ page: String(page + 1) })} style={{ padding: "6px 14px", border: "1px solid #D0D5DD", borderRadius: "6px", fontSize: "13px", color: "#1F2937", textDecoration: "none", backgroundColor: "#fff" }}>
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
