import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const loggedIn = req.cookies.get("isLoggedIn")?.value === "true";

  const protectedPaths = ["/", "/dashboard"]; // Add any routes you want to protect
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !loggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If already logged in, prevent visiting login/register again
  if (
    loggedIn &&
    (req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/login", "/register"],
};
