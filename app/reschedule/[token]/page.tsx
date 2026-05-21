import Link from "next/link"

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function ReschedulePage({ params }: PageProps) {
  const { token } = await params
  const calUsername = process.env.NEXT_PUBLIC_CAL_USERNAME ?? "flowa"
  const calEventType = process.env.NEXT_PUBLIC_CAL_EVENT_TYPE ?? "discovery-call"

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F2F4F7", padding: "32px 16px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <Link href="/" style={{ color: "#1FAD5A", fontWeight: 800, fontSize: "22px", textDecoration: "none" }}>
            FLOWA
          </Link>
          <h1 style={{ color: "#1F2A44", fontSize: "24px", fontWeight: 700, margin: "16px 0 8px" }}>
            Pick a new time
          </h1>
          <p style={{ color: "#667085", fontSize: "15px", margin: 0 }}>
            Choose a slot below — your previous booking will be cancelled automatically.
          </p>
        </div>

        {/* Cal.com embed placeholder — replace with real embed once account is set up */}
        <div style={{
          background: "#fff",
          border: "1px solid #D0D5DD",
          borderRadius: "16px",
          padding: "40px",
          textAlign: "center",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}>
          <span style={{ fontSize: "40px" }}>📅</span>
          <p style={{ color: "#667085", fontSize: "15px", margin: 0 }}>
            Cal.com calendar loads here once your account is connected.
          </p>
          <p style={{ color: "#98A2B3", fontSize: "13px", margin: 0 }}>
            Set <code>NEXT_PUBLIC_CAL_USERNAME</code> in your Vercel environment variables.
          </p>
          <a
            href={`https://cal.com/${calUsername}/${calEventType}?metadata[submission_id]=${token}`}
            style={{ color: "#1FAD5A", fontSize: "14px" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open booking page in new tab →
          </a>
        </div>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#98A2B3" }}>
          Questions? <a href="mailto:info@flowa.co.za" style={{ color: "#1FAD5A" }}>info@flowa.co.za</a>
        </p>
      </div>
    </div>
  )
}
