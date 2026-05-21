import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith("/admin")) return NextResponse.next()

  // Allow login page through without auth check
  if (pathname === "/admin/login") return NextResponse.next()

  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(cookies) { cookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options)) },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = "/admin/login"
    return NextResponse.redirect(loginUrl)
  }
  return res
}

export const config = { matcher: ["/admin/:path*"] }
