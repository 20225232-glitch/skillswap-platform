import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySession } from "@/lib/auth"

const publicRoutes = ["/", "/login", "/signup", "/forgot-password"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check session for protected routes
  const token = request.cookies.get("session")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const session = await verifySession(token)

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
}
