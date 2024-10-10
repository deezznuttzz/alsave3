import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export function middleware(req: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.redirect('/login');
  }

  try {
    verifyAccessToken(accessToken);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect('/login');
  }
}

export const config = {
  matcher: ['/protected-page'],
};
