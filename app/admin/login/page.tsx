"use client"
import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      })
      if (err) throw err
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F2F4F7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "#fff",
        border: "1px solid #D0D5DD",
        borderRadius: "16px",
        padding: "40px 36px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ color: "#1FAD5A", fontWeight: 800, fontSize: "28px", letterSpacing: "-0.5px" }}>FLOWA</div>
          <div style={{ color: "#667085", fontSize: "12px", marginTop: "2px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Admin Portal</div>
        </div>

        {sent ? (
          <div style={{
            backgroundColor: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: "10px",
            padding: "20px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>📬</div>
            <p style={{ color: "#166534", fontSize: "15px", fontWeight: 600, margin: "0 0 6px" }}>Check your email</p>
            <p style={{ color: "#15803D", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
              The magic link expires in 10 minutes.
            </p>
          </div>
        ) : (
          <>
            <h1 style={{ color: "#1F2A44", fontSize: "22px", fontWeight: 700, margin: "0 0 6px" }}>Admin sign in</h1>
            <p style={{ color: "#667085", fontSize: "14px", margin: "0 0 28px", lineHeight: 1.6 }}>
              We&apos;ll send a magic link to your email.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@flowa.co.za"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #D0D5DD",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#1F2937",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {error && (
                <div style={{
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "#DC2626",
                  fontSize: "13px",
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  padding: "12px",
                  backgroundColor: loading || !email ? "#A7F3C4" : "#1FAD5A",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: loading || !email ? "not-allowed" : "pointer",
                  transition: "background-color 0.15s",
                }}
              >
                {loading ? "Sending…" : "Send magic link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
