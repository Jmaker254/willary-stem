import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Edge gate for /admin. Verifies the session cookie's signature only — role
 * checks happen in server components/actions where the DB is available.
 * (Next 16 renamed the "middleware" convention to "proxy".)
 */
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

// Routes that authenticate themselves in the handler. Kept out of the proxy so
// large request bodies (video uploads) aren't buffered/truncated at the edge.
const SELF_AUTH_PATHS = ["/admin/media/upload"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    SELF_AUTH_PATHS.includes(pathname) ||
    PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("ws_session")?.value;
  const secret = process.env.AUTH_SECRET;
  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      return NextResponse.next();
    } catch {
      // fall through to redirect
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Gate /admin and everything under it, except the self-authenticating upload
  // endpoint (so video uploads aren't capped by the proxy body limit).
  matcher: ["/admin", "/admin/((?!media/upload).*)"],
};
