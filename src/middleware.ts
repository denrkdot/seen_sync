import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/team/'];
const AUTH_ROUTES = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getSession() for instantaneous local JWT validation instead of a
  // remote getUser() network round-trip on every navigation and prefetch.
  // getUser() is still called inside protected server components (lib/auth.ts)
  // for authoritative verification once the page actually renders.
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname === route);

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Exclude static assets, images, and ALL /api/ routes.
    // API routes handle their own auth via the server Supabase client,
    // so intercepting them here only adds latency to SWR polling.
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
