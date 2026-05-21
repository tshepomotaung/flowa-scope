export default function PrivacyRequestPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F2F4F7", padding: "40px 16px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <a href="/" style={{ color: "#1FAD5A", fontWeight: 800, fontSize: "20px", textDecoration: "none" }}>FLOWA</a>
        </div>
        <div style={{ backgroundColor: "#fff", border: "1px solid #D0D5DD", borderRadius: "16px", padding: "40px" }}>
          <h1 style={{ color: "#1F2A44", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>POPIA Request</h1>
          <p style={{ color: "#667085", fontSize: "15px", lineHeight: 1.7, marginBottom: "24px" }}>
            Under the Protection of Personal Information Act (POPIA), you have the right to request access to, correction of, or deletion of your personal information held by Flowa.
          </p>
          <h2 style={{ color: "#1F2A44", fontSize: "17px", fontWeight: 600, marginBottom: "12px" }}>Your rights</h2>
          <ul style={{ color: "#1F2937", fontSize: "14px", lineHeight: 2, paddingLeft: "20px", marginBottom: "24px" }}>
            <li><strong>Access</strong> — Request a copy of the personal information we hold about you.</li>
            <li><strong>Correction</strong> — Ask us to correct inaccurate information.</li>
            <li><strong>Deletion</strong> — Ask us to delete your personal information.</li>
            <li><strong>Objection</strong> — Object to the processing of your personal information.</li>
          </ul>
          <h2 style={{ color: "#1F2A44", fontSize: "17px", fontWeight: 600, marginBottom: "12px" }}>How to submit a request</h2>
          <p style={{ color: "#667085", fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>
            Email our Information Officer with your full name, email address, and the nature of your request. We will respond within 30 days.
          </p>
          <a
            href="mailto:info@flowa.co.za?subject=POPIA%20Data%20Request&body=Full%20name%3A%0AEmail%20address%3A%0ARequest%20type%20(access%2C%20correction%2C%20deletion)%3A%0ADetails%3A"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              backgroundColor: "#1FAD5A",
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              borderRadius: "10px",
              textDecoration: "none",
            }}
          >
            Email info@flowa.co.za →
          </a>
          <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #E4E7EC" }}>
            <p style={{ fontSize: "13px", color: "#98A2B3", lineHeight: 1.6 }}>
              <strong style={{ color: "#667085" }}>Information Officer:</strong> Tshepo Motaung<br/>
              <strong style={{ color: "#667085" }}>Email:</strong> info@flowa.co.za<br/>
              <strong style={{ color: "#667085" }}>Company:</strong> Flowa (Pty) Ltd
            </p>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <a href="/privacy" style={{ color: "#667085", fontSize: "13px" }}>← Back to Privacy Notice</a>
        </div>
      </div>
    </div>
  )
}
