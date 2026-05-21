import { createServiceClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { AdminActions } from "./AdminActions"

const FEATURES = [
  "broadcast_campaigns", "chatbot_flows", "live_chat", "ai_responses",
  "contact_management", "team_inbox", "analytics_reports", "api_webhooks",
  "whatsapp_catalog", "payment_links", "appointment_booking", "multi_language",
  "role_based_access", "white_label",
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px", paddingBottom: "8px", borderBottom: "1px solid #E4E7EC" }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ fontSize: "11px", fontWeight: 600, color: "#98A2B3", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px" }}>{label}</div>
      <div style={{ fontSize: "14px", color: value ? "#1F2937" : "#D0D5DD" }}>{value || "—"}</div>
    </div>
  )
}

function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
      {children}
    </div>
  )
}

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let s: Record<string, unknown> | null = null
  try {
    const db = createServiceClient()
    const { data, error } = await db.from("submissions").select("*").eq("id", id).single()
    if (error || !data) notFound()
    s = data as Record<string, unknown>
  } catch {
    notFound()
  }

  const features = (s.features ?? {}) as Record<string, boolean>

  return (
    <div>
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <a href="/admin/submissions" style={{ color: "#667085", textDecoration: "none", fontSize: "14px" }}>← Submissions</a>
        <span style={{ color: "#D0D5DD" }}>/</span>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1F2A44", margin: 0 }}>
          {s.first_name as string} {s.last_name as string}
        </h1>
        <span style={{
          display: "inline-block", padding: "3px 12px", borderRadius: "20px",
          backgroundColor: "#EFF8FF", color: "#175CD3", fontSize: "12px", fontWeight: 600,
        }}>
          {(s.recommended_tier as string) ?? "—"}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
        {/* LEFT */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #D0D5DD", borderRadius: "12px", padding: "28px" }}>
          <Section title="Contact">
            <Grid2>
              <Field label="First name" value={s.first_name as string} />
              <Field label="Last name" value={s.last_name as string} />
              <Field label="Email" value={s.work_email as string} />
              <Field label="Mobile" value={s.mobile_e164 as string} />
              <Field label="Preferred channel" value={s.preferred_channel as string} />
              <Field label="Role / Title" value={s.role_title as string} />
              <Field label="Company" value={s.company_legal_name as string} />
              <Field label="Website" value={s.company_website as string} />
            </Grid2>
          </Section>

          <Section title="Business">
            <Grid2>
              <Field label="Industry" value={s.industry as string} />
              <Field label="Employees" value={s.employee_band as string} />
              <Field label="WhatsApp use" value={s.current_whatsapp_use as string} />
              <Field label="Existing WABA" value={s.existing_waba === true ? "Yes" : s.existing_waba === false ? "No" : "Unsure"} />
            </Grid2>
          </Section>

          <Section title="Features">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "8px" }}>
              {FEATURES.map(f => {
                const enabled = features[f] === true
                return (
                  <div key={f} style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    backgroundColor: enabled ? "#F0FDF4" : "#F2F4F7",
                    color: enabled ? "#166534" : "#98A2B3",
                    fontSize: "12px",
                    fontWeight: enabled ? 600 : 400,
                    border: `1px solid ${enabled ? "#BBF7D0" : "#E4E7EC"}`,
                  }}>
                    {enabled ? "✓ " : ""}{f.replace(/_/g, " ")}
                  </div>
                )
              })}
            </div>
          </Section>

          <Section title="Scale">
            <Grid2>
              <Field label="Monthly conversations" value={s.monthly_conversation_band as string} />
              <Field label="User seats" value={s.user_seats_needed ? String(s.user_seats_needed) : null} />
              <Field label="Timeline" value={s.timeline as string} />
              <Field label="Budget band" value={s.budget_band as string} />
            </Grid2>
          </Section>

          <Section title="Demo">
            <Grid2>
              <Field label="Booking ID" value={s.calcom_booking_id as string} />
              <Field label="Demo at" value={s.demo_at ? new Date(s.demo_at as string).toLocaleString("en-ZA") : null} />
              <Field label="Demo status" value={s.demo_status as string} />
              <Field label="Pipeline status" value={s.status as string} />
            </Grid2>
          </Section>
        </div>

        {/* RIGHT — Action Panel */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #D0D5DD", borderRadius: "12px", padding: "24px", position: "sticky", top: "24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1F2A44", margin: "0 0 20px" }}>Actions</h3>
          <AdminActions
            submissionId={id}
            currentStatus={(s.status as string) ?? "new"}
            currentNotes={(s.notes as string) ?? ""}
          />
        </div>
      </div>
    </div>
  )
}
