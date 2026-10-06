const SESSION_COOKIE_NAME = 'risknexus_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

function base64UrlEncode(value) {
  const bytes = value instanceof Uint8Array ? value : new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function getSigningKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be set to a value with at least 32 characters.');
  }
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function ensureAuthReady() {
  await getSigningKey();
}

export async function createSessionToken(user) {
  const payload = base64UrlEncode(JSON.stringify({
    user,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  }));
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign('HMAC', await key, new TextEncoder().encode(payload));
  return `${payload}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function readSessionToken(token) {
  if (!token || typeof token !== 'string') return null;

  try {
    const [payload, encodedSignature, extra] = token.split('.');
    if (!payload || !encodedSignature || extra !== undefined) return null;
    const key = await getSigningKey();
    const signature = base64UrlDecode(encodedSignature);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      await key,
      signature,
      new TextEncoder().encode(payload)
    );
    if (!isValid) return null;

    const session = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
    if (!session.user?.id || !session.user?.name || !session.user?.email) return null;
    if (!Number.isInteger(session.expiresAt) || session.expiresAt <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return session.user;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('AUTH_SECRET')) throw error;
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export { SESSION_COOKIE_NAME };
