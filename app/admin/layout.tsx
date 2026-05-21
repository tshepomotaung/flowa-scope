import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F2F4F7" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px", flexShrink: 0,
        backgroundColor: "#1F2A44",
        padding: "0",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ color: "#1FAD5A", fontWeight: 800, fontSize: "20px" }}>FLOWA</span>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "2px" }}>Admin</div>
        </div>
        <nav style={{ padding: "12px 8px", flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          {[
            { href: "/admin", label: "Dashboard", icon: "📊" },
            { href: "/admin/submissions", label: "Submissions", icon: "📋" },
            { href: "/admin/calendar", label: "Calendar", icon: "📅" },
          ].map(({ href, label, icon }) => (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "8px",
              color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "14px",
              fontWeight: 500,
            }}>
              <span>{icon}</span>{label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "4px" }}>Signed in as</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", wordBreak: "break-all" }}>{user.email}</div>
        </div>
      </aside>
      {/* Main */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  )
}
