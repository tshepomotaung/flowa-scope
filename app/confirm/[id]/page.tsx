import { createServiceClient } from "@/lib/supabase"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}

interface Submission {
  id: string
  first_name: string
  last_name: string
  company_legal_name: string
  recommended_tier: string | null
  demo_status: string | null
}

const tierCopy: Record<string, string> = {
  Starter:
    "Sounds like a great fit for our Starter plan — we'll confirm the details during the demo.",
  Growth: "Sounds like a great fit for our Growth plan — we'll confirm the details during the demo.",
  Pro: "Based on your scope, our Pro plan looks like the right match — we'll walk through it on the call.",
  Enterprise:
    "Your needs point to our Enterprise plan — we'll design a custom solution together on the call.",
}

export default async function ConfirmPage({ params }: PageProps) {
  const { id } = await params

  let submission: Submission | null = null

  try {
    const db = createServiceClient()
    const { data, error } = await db
      .from("submissions")
      .select("id, first_name, last_name, company_legal_name, recommended_tier, demo_status")
      .eq("id", id)
      .single()

    if (!error && data) {
      submission = data as Submission
    }
  } catch {
    // graceful fallback
  }

  const tier = submission?.recommended_tier ?? "Growth"
  const tierMessage = tierCopy[tier] ?? tierCopy.Growth

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F2F4F7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 16px",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "40px" }}>
        <Link
          href="/"
          style={{
            color: "#1FAD5A",
            fontWeight: 700,
            fontSize: "24px",
            textDecoration: "none",
            letterSpacing: "-0.5px",
          }}
        >
          FLOWA
        </Link>
      </div>

      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#FFFFFF",
          border: "1px solid #D0D5DD",
          borderRadius: "20px",
          padding: "clamp(24px, 5vw, 48px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          textAlign: "center",
        }}
      >
        {/* Success icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "rgba(31,173,90,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: "32px",
          }}
        >
          🎉
        </div>

        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 800,
            color: "#1F2A44",
            marginBottom: "12px",
            lineHeight: 1.2,
          }}
        >
          {submission ? "You're all set!" : "We've got your details"}
        </h1>

        {submission ? (
          <p style={{ fontSize: "16px", color: "#667085", lineHeight: 1.6, marginBottom: "28px" }}>
            Thanks,{" "}
            <strong style={{ color: "#1F2937" }}>
              {submission.first_name} {submission.last_name}
            </strong>
            ! We&apos;ve received your scope for{" "}
            <strong style={{ color: "#1F2937" }}>{submission.company_legal_name}</strong>.
          </p>
        ) : (
          <p style={{ fontSize: "16px", color: "#667085", lineHeight: 1.6, marginBottom: "28px" }}>
            Thanks for completing the scope form. We&apos;ve received your details and will be in
            touch shortly.
          </p>
        )}

        {/* Tier recommendation */}
        <div
          style={{
            backgroundColor: "rgba(31,173,90,0.06)",
            border: "1px solid rgba(31,173,90,0.2)",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "32px",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{ fontSize: "20px" }}>✅</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#667085", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Recommended plan
            </span>
          </div>
          <div
            style={{
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 800,
              color: "#1FAD5A",
              marginBottom: "8px",
            }}
          >
            {tier}
          </div>
          <p style={{ fontSize: "14px", color: "#1F2937", lineHeight: 1.6, margin: 0 }}>
            {tierMessage}
          </p>
        </div>

        {/* What happens next */}
        <div style={{ textAlign: "left", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1F2A44", marginBottom: "16px" }}>
            What happens next
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              {
                icon: "📋",
                text: "We'll review your scope details and prepare a tailored demo agenda.",
              },
              {
                icon: "📧",
                text: "You'll receive a confirmation email with your booking details shortly.",
              },
              {
                icon: "🤝",
                text: "See you at the demo — we'll show you exactly how Flowa can work for your business.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "14px 16px",
                  backgroundColor: "#FAFAFA",
                  borderRadius: "10px",
                  border: "1px solid #F2F4F7",
                }}
              >
                <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: "14px", color: "#1F2937", lineHeight: 1.6, margin: 0 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <a
          href="https://flowa.co.za"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            backgroundColor: "#1FAD5A",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: "15px",
            borderRadius: "10px",
            textDecoration: "none",
          }}
        >
          Visit flowa.co.za →
        </a>
      </div>

      {/* Footer */}
      <p style={{ marginTop: "32px", fontSize: "12px", color: "#667085", textAlign: "center" }}>
        Questions? Email{" "}
        <a href="mailto:info@flowa.co.za" style={{ color: "#1FAD5A" }}>
          info@flowa.co.za
        </a>{" "}
        ·{" "}
        <Link href="/privacy" style={{ color: "#667085" }}>
          Privacy Notice
        </Link>
      </p>
    </div>
  )
}
