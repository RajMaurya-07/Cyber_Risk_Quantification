import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { readSessionToken, SESSION_COOKIE_NAME } from '../../../../lib/server/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await readSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({ user });
  } catch (error) {
    console.error('[Auth] Session validation failed:', error);
    return NextResponse.json({ error: 'Unable to validate the session.' }, { status: 503 });
  }
}
