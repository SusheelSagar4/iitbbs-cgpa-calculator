import { NextResponse } from 'next/server'

export async function middleware() {
  // Public access - no auth redirects required
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
