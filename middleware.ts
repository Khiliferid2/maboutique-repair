import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mbr_session";

// Vérification légère (présence du cookie) au niveau du middleware (edge runtime).
// La vérification complète du token (signature + expiration) se fait dans
// app/dashboard/layout.tsx, exécuté en runtime Node.
export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
