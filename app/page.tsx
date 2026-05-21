import Link from "next/link"

const stats = [
  { value: "98%", label: "open rate" },
  { value: "30×", label: "ROI" },
  { value: "+400%", label: "conversion vs email" },
  { value: "24h", label: "to go live" },
]

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <header
        style={{
          backgroundColor: "#1F2A44",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            color: "#1FAD5A",
            fontWeight: 700,
            fontSize: "24px",
            letterSpacing: "-0.5px",
          }}
        >
          FLOWA
        </div>
        <Link
          href="/privacy"
          style={{
            color: "#D0D5DD",
            fontSize: "13px",
            textDecoration: "none",
          }}
        >
          Privacy
        </Link>
      </header>

      {/* Hero */}
      <section
        style={{
          backgroundColor: "#1F2A44",
          padding: "80px 24px 96px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(31,173,90,0.15)",
              color: "#1FAD5A",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: "100px",
              marginBottom: "24px",
            }}
          >
            WhatsApp Business API · South Africa
          </div>

          <h1
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-1px",
              margin: "0 0 24px",
            }}
          >
            WhatsApp is Africa&apos;s #1 business channel.
            <br />
            <span style={{ color: "#1FAD5A" }}>Are you using it properly?</span>
          </h1>

          <p
            style={{
              color: "#D0D5DD",
              fontSize: "clamp(16px, 2.5vw, 20px)",
              lineHeight: 1.65,
              margin: "0 auto 40px",
              maxWidth: "600px",
            }}
          >
            Flowa turns WhatsApp into your highest-converting revenue channel. Tell us about your
            business and book a free discovery call — takes under 3 minutes.
          </p>

          <Link
            href="/scope"
            style={{
              display: "inline-block",
              backgroundColor: "#1FAD5A",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "18px",
              padding: "16px 40px",
              borderRadius: "10px",
              textDecoration: "none",
              boxShadow: "0 4px 24px rgba(31,173,90,0.35)",
              transition: "opacity 0.15s",
            }}
          >
            Start scoping →
          </Link>

          <p style={{ color: "#667085", fontSize: "13px", marginTop: "16px" }}>
            No credit card required · Takes &lt; 3 minutes
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #D0D5DD",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "24px",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                textAlign: "center",
                padding: "24px 16px",
                borderRadius: "12px",
                border: "1px solid #F2F4F7",
                backgroundColor: "#FAFAFA",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 800,
                  color: "#1FAD5A",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: "14px", color: "#667085", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "64px 24px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 700,
            color: "#1F2A44",
            marginBottom: "8px",
          }}
        >
          Book your demo in 3 steps
        </h2>
        <p style={{ textAlign: "center", color: "#667085", marginBottom: "48px" }}>
          We scope your needs first so the demo is relevant to your business.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {[
            {
              num: "1",
              title: "Tell us about you",
              desc: "Your name, company, and contact details.",
            },
            {
              num: "2",
              title: "Scope your needs",
              desc: "Industry, team size, features, and budget — so we come prepared.",
            },
            {
              num: "3",
              title: "Pick a time",
              desc: "Choose a slot and we'll send a personalised prep pack.",
            },
          ].map((step) => (
            <div
              key={step.num}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #D0D5DD",
                borderRadius: "12px",
                padding: "28px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#1FAD5A",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                {step.num}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px", color: "#1F2A44" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#667085", lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link
            href="/scope"
            style={{
              display: "inline-block",
              backgroundColor: "#1FAD5A",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "16px",
              padding: "14px 36px",
              borderRadius: "10px",
              textDecoration: "none",
            }}
          >
            Start scoping →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: "auto",
          borderTop: "1px solid #D0D5DD",
          backgroundColor: "#FFFFFF",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "13px", color: "#667085" }}>
          © {new Date().getFullYear()} Flowa (Pty) Ltd · South Africa ·{" "}
          <Link href="/privacy" style={{ color: "#667085" }}>
            Privacy Notice
          </Link>{" "}
          · POPIA compliant
        </p>
      </footer>
    </div>
  )
}
