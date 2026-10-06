import { NextResponse } from 'next/server';
import { createSessionToken, ensureAuthReady, SESSION_COOKIE_NAME, sessionCookieOptions } from '../../../../lib/server/auth';
import { createUser, validateCredentials } from '../../../../lib/server/supabase-users';

export async function POST(request) {
  try {
    await ensureAuthReady();
    const body = await request.json();
    const validationError = validateCredentials(body, true);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const user = await createUser(body);
    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, await createSessionToken(user), sessionCookieOptions());
    return response;
  } catch (error) {
    if (error?.code === '23505' || error?.status === 409) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }
    console.error('[Auth] Signup failed:', error);
    return NextResponse.json(
      {
        error: error.message?.startsWith('Set SUPABASE_') || error.message?.startsWith('AUTH_SECRET')
          ? error.message
          : 'Unable to create your account right now.',
      },
      { status: 503 }
    );
  }
}
