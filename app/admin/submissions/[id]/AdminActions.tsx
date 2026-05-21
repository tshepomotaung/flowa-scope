"use client"
import { useState, useTransition } from "react"
import { updateStatus, updateNotes, markAttended, markNoShow } from "./actions"

interface AdminActionsProps {
  submissionId: string
  currentStatus: string
  currentNotes: string
}

export function AdminActions({ submissionId, currentStatus, currentNotes }: AdminActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [notes, setNotes] = useState(currentNotes ?? "")
  const [status, setStatus] = useState(currentStatus)

  const btn = (label: string, onClick: () => void, variant: "primary" | "danger" | "secondary" = "primary") => (
    <button
      onClick={onClick}
      disabled={isPending}
      style={{
        width: "100%",
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: isPending ? "not-allowed" : "pointer",
        backgroundColor: variant === "primary" ? "#1FAD5A" : variant === "danger" ? "#EF4444" : "#F2F4F7",
        color: variant === "secondary" ? "#1F2937" : "#fff",
        opacity: isPending ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  )

  const STATUSES = ["new","qualified","demo_booked","demo_done","proposal","negotiation","closed_won","closed_lost","on_hold"]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#667085", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Pipeline status
        </label>
        <select
          value={status}
          onChange={e => {
            setStatus(e.target.value)
            startTransition(() => updateStatus(submissionId, e.target.value))
          }}
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #D0D5DD", borderRadius: "8px", fontSize: "14px", backgroundColor: "#fff" }}
        >
          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {btn("Mark attended ✓", () => startTransition(() => markAttended(submissionId)))}
      {btn("Mark no-show ✗", () => startTransition(() => markNoShow(submissionId)), "danger")}

      <div>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#667085", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Notes
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #D0D5DD", borderRadius: "8px", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }}
          placeholder="Internal notes..."
        />
        {btn("Save notes", () => startTransition(() => updateNotes(submissionId, notes)), "secondary")}
      </div>

      <div style={{ borderTop: "1px solid #E4E7EC", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <a
          href={`/api/docs/onboarding/${submissionId}`}
          style={{ display: "block", padding: "10px 16px", border: "1px solid #D0D5DD", borderRadius: "8px", fontSize: "14px", fontWeight: 500, color: "#1F2937", textDecoration: "none", textAlign: "center", backgroundColor: "#fff" }}
        >
          📄 Download onboarding doc
        </a>
        <a
          href={`/api/docs/scoping/${submissionId}`}
          style={{ display: "block", padding: "10px 16px", border: "1px solid #D0D5DD", borderRadius: "8px", fontSize: "14px", fontWeight: 500, color: "#1F2937", textDecoration: "none", textAlign: "center", backgroundColor: "#fff" }}
        >
          📝 Download scoping brief
        </a>
      </div>

      {isPending && <p style={{ fontSize: "12px", color: "#667085", textAlign: "center" }}>Saving...</p>}
    </div>
  )
}
