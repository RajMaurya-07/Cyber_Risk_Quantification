import { NextResponse } from 'next/server';
import { createSessionToken, ensureAuthReady, SESSION_COOKIE_NAME, sessionCookieOptions } from '../../../../lib/server/auth';
import { authenticateUser, validateCredentials } from '../../../../lib/server/supabase-users';

export async function POST(request) {
  try {
    await ensureAuthReady();
    const body = await request.json();
    const validationError = validateCredentials(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const user = await authenticateUser(body.email, body.password);
    if (!user) return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });

    const response = NextResponse.json({ user });
    response.cookies.set(SESSION_COOKIE_NAME, await createSessionToken(user), sessionCookieOptions());
    return response;
  } catch (error) {
    console.error('[Auth] Login failed:', error);
    return NextResponse.json(
      {
        error: error.message?.startsWith('Set SUPABASE_') || error.message?.startsWith('AUTH_SECRET')
          ? error.message
          : 'Unable to sign in right now.',
      },
      { status: 503 }
    );
  }
}
