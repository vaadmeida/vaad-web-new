import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const user = request.cookies.get("user")?.value;

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname.startsWith("/admin/login");

  // 🚫 Not logged in
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // 🔁 Logged in user trying to access login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ 🔥 THIS IS WHAT YOU WERE MISSING
  if (token && pathname === "/admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🔒 Validate user status
  try {
    if (user) {
      const parsedUser = JSON.parse(user);

      if (parsedUser.status !== "ACTIVE") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/dashboard/:path*"],
};