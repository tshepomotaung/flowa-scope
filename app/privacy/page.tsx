import Link from "next/link"

export const metadata = {
  title: "Privacy Notice | Flowa",
  description:
    "Flowa's POPIA-compliant Privacy Notice. Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F2F4F7" }}>
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
      </header>

      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #D0D5DD",
            borderRadius: "16px",
            padding: "clamp(24px, 5vw, 48px)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 800,
              color: "#1F2A44",
              marginBottom: "8px",
            }}
          >
            Privacy Notice
          </h1>
          <p style={{ fontSize: "13px", color: "#667085", marginBottom: "36px" }}>
            Last updated: May 2025 · Effective date: May 2025
          </p>

          <Section title="1. Who we are">
            <p>
              This Privacy Notice applies to <strong>Flowa (Pty) Ltd</strong> ("Flowa", "we", "us",
              "our"), a company registered in South Africa. We operate the Flowa WhatsApp Business
              automation platform, including the scope and demo booking service at{" "}
              <strong>scope.flowa.co.za</strong>.
            </p>
            <p style={{ marginTop: "12px" }}>
              <strong>General enquiries:</strong>{" "}
              <a href="mailto:info@flowa.co.za" style={{ color: "#1FAD5A" }}>
                info@flowa.co.za
              </a>
            </p>
          </Section>

          <Section title="2. Information Officer (POPIA)">
            <p>
              In terms of the Protection of Personal Information Act 4 of 2013 ("POPIA"), our
              Information Officer is:
            </p>
            <div
              style={{
                backgroundColor: "#F2F4F7",
                borderRadius: "10px",
                padding: "16px 20px",
                marginTop: "12px",
                fontSize: "14px",
              }}
            >
              <p style={{ margin: "0 0 4px" }}>
                <strong>Tshepo Motaung</strong>
              </p>
              <p style={{ margin: "0 0 4px", color: "#667085" }}>Information Officer</p>
              <p style={{ margin: 0 }}>
                <a href="mailto:info@flowa.co.za" style={{ color: "#1FAD5A" }}>
                  info@flowa.co.za
                </a>
              </p>
            </div>
          </Section>

          <Section title="3. What personal information we collect">
            <p>When you complete our scope and demo booking form, we collect:</p>
            <ul style={{ paddingLeft: "20px", marginTop: "12px", lineHeight: 1.8 }}>
              <li>
                <strong>Identity data:</strong> first name, last name, job title
              </li>
              <li>
                <strong>Contact data:</strong> work email address, mobile phone number
              </li>
              <li>
                <strong>Business data:</strong> company legal name, trading name, website, industry,
                employee count
              </li>
              <li>
                <strong>Needs data:</strong> desired features, conversation volumes, budget range,
                go-live timeline
              </li>
              <li>
                <strong>Technical data:</strong> UTM / marketing attribution parameters captured
                automatically from the URL
              </li>
              <li>
                <strong>Consent records:</strong> timestamps of your POPIA consent and any marketing
                opt-in
              </li>
            </ul>
          </Section>

          <Section title="4. Why we process your information and the lawful basis">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
                marginTop: "12px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#F2F4F7" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: "8px 0 0 0",
                      fontWeight: 700,
                      color: "#1F2A44",
                    }}
                  >
                    Purpose
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: "0 8px 0 0",
                      fontWeight: 700,
                      color: "#1F2A44",
                    }}
                  >
                    Lawful basis
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Respond to your demo enquiry", "Consent (Section 11(1)(a))"],
                  ["Book and confirm your discovery call", "Consent"],
                  ["Recommend the appropriate Flowa plan", "Consent"],
                  ["Send you a demo confirmation email", "Consent"],
                  [
                    "Send marketing communications (if opted in)",
                    "Consent (separately obtained)",
                  ],
                  [
                    "Internal analytics and improving our service",
                    "Legitimate interest (Section 11(1)(f))",
                  ],
                ].map(([purpose, basis], i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid #F2F4F7" }}
                  >
                    <td style={{ padding: "10px 12px", color: "#1F2937" }}>{purpose}</td>
                    <td style={{ padding: "10px 12px", color: "#667085" }}>{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="5. How long we keep your data">
            <p>
              We retain your personal information for a maximum of{" "}
              <strong>24 months</strong> from the date of collection, unless you request earlier
              deletion or we are required by law to retain it for longer.
            </p>
            <p style={{ marginTop: "12px" }}>
              If you do not proceed with Flowa services after the demo, your data will be
              anonymised or deleted within the 24-month window.
            </p>
          </Section>

          <Section title="6. Who we share your data with">
            <p>We do not sell your personal information. We share it only with:</p>
            <ul style={{ paddingLeft: "20px", marginTop: "12px", lineHeight: 1.8 }}>
              <li>
                <strong>Supabase Inc.</strong> — our database provider (see cross-border transfers
                below)
              </li>
              <li>
                <strong>Resend Inc.</strong> — our transactional email provider (USA; Standard
                Contractual Clauses apply)
              </li>
              <li>
                <strong>Cal.com Inc.</strong> — our calendar booking provider (USA; SCCs apply)
              </li>
              <li>
                <strong>Internal Flowa staff</strong> — only those who need access to process your
                demo request
              </li>
            </ul>
          </Section>

          <Section title="7. Cross-border transfers">
            <p>
              Your data is stored on <strong>Supabase</strong> infrastructure located in the{" "}
              <strong>European Union (Frankfurt, Germany)</strong>. The EU has been assessed as
              providing an adequate level of data protection for South African POPIA purposes.
            </p>
            <p style={{ marginTop: "12px" }}>
              Where other sub-processors are located outside South Africa, we ensure appropriate
              safeguards are in place (including Standard Contractual Clauses where applicable).
            </p>
          </Section>

          <Section title="8. Your rights under POPIA">
            <p>You have the right to:</p>
            <ul style={{ paddingLeft: "20px", marginTop: "12px", lineHeight: 1.8 }}>
              <li>
                <strong>Access</strong> — request a copy of the personal information we hold about
                you
              </li>
              <li>
                <strong>Correction</strong> — ask us to correct inaccurate or incomplete information
              </li>
              <li>
                <strong>Deletion</strong> — request erasure of your personal information (subject to
                legal retention obligations)
              </li>
              <li>
                <strong>Objection</strong> — object to processing based on legitimate interest
              </li>
              <li>
                <strong>Withdraw consent</strong> — withdraw your consent at any time, without
                affecting the lawfulness of prior processing
              </li>
              <li>
                <strong>Lodge a complaint</strong> — with the Information Regulator of South Africa
                at{" "}
                <a href="https://inforegulator.org.za" style={{ color: "#1FAD5A" }}>
                  inforegulator.org.za
                </a>
              </li>
            </ul>
          </Section>

          <Section title="9. How to exercise your rights">
            <p>
              To exercise any of the rights above, please email our Information Officer at{" "}
              <a
                href="mailto:info@flowa.co.za?subject=POPIA Request"
                style={{ color: "#1FAD5A" }}
              >
                info@flowa.co.za
              </a>{" "}
              with the subject line <strong>"POPIA Request"</strong> and a description of your
              request. We will respond within 30 days.
            </p>
          </Section>

          <Section title="10. Security">
            <p>
              We implement appropriate technical and organisational security measures to protect your
              personal information against unauthorised access, disclosure, alteration, and
              destruction. Access to personal data is restricted to authorised personnel on a
              need-to-know basis.
            </p>
          </Section>

          <Section title="11. Cookies and analytics">
            <p>
              We may use PostHog for privacy-respecting, cookieless analytics to understand how
              visitors use our scope form. No personally identifiable information is sent to PostHog
              without your consent. We do not use advertising cookies or third-party tracking pixels
              on this site.
            </p>
          </Section>

          <Section title="12. Changes to this notice">
            <p>
              We may update this Privacy Notice from time to time. The &quot;Last updated&quot; date at the
              top of this page reflects the most recent version. We will notify you of material
              changes via email if you have an active relationship with Flowa.
            </p>
          </Section>

          <Section title="13. Contact us">
            <p>
              For all privacy-related queries, please contact us at{" "}
              <a href="mailto:info@flowa.co.za" style={{ color: "#1FAD5A" }}>
                info@flowa.co.za
              </a>
              .
            </p>
            <p style={{ marginTop: "12px", color: "#667085", fontSize: "13px" }}>
              Flowa (Pty) Ltd · South Africa
            </p>
          </Section>
        </div>
      </main>

      <footer
        style={{
          borderTop: "1px solid #D0D5DD",
          backgroundColor: "#FFFFFF",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "13px", color: "#667085" }}>
          © {new Date().getFullYear()} Flowa (Pty) Ltd ·{" "}
          <Link href="/" style={{ color: "#667085" }}>
            Home
          </Link>
        </p>
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "32px" }}>
      <h2
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#1F2A44",
          marginBottom: "12px",
          paddingBottom: "8px",
          borderBottom: "1px solid #F2F4F7",
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: "14px", color: "#1F2937", lineHeight: 1.7 }}>{children}</div>
    </section>
  )
}
