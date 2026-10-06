import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const PASSWORD_HASH_BYTES = 64;

function getSupabaseConfig() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/+$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for server-side account storage.');
  }

  return { url, serviceRoleKey };
}

async function requestUsers(path, options = {}) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  let response;

  try {
    response = await fetch(`${url}/rest/v1/app_users${path}`, {
      ...options,
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      cache: 'no-store',
    });
  } catch (cause) {
    const error = new Error('Unable to reach the account database.');
    error.status = 503;
    error.cause = cause;
    throw error;
  }

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(result?.message || 'Account database request failed.');
    error.status = response.status;
    error.code = result?.code;
    throw error;
  }

  return result;
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, PASSWORD_HASH_BYTES);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== 'string') return false;
  const [algorithm, salt, digest, extra] = storedHash.split(':');
  if (
    algorithm !== 'scrypt'
    || !/^[\da-f]{32}$/.test(salt || '')
    || !/^[\da-f]{128}$/.test(digest || '')
    || extra !== undefined
  ) {
    return false;
  }

  const expected = Buffer.from(digest, 'hex');
  const actual = await scryptAsync(password, salt, PASSWORD_HASH_BYTES);
  return timingSafeEqual(expected, actual);
}

export async function createUser({ name, email, password }) {
  const result = await requestUsers('?select=id,name,email', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: await hashPassword(password),
    }),
  });

  const user = Array.isArray(result) ? result[0] : null;
  if (!user) throw new Error('Account database returned an invalid user profile.');
  return normalizeUser(user);
}

export async function authenticateUser(email, password) {
  const query = new URLSearchParams({
    select: 'id,name,email,password_hash',
    email: `eq.${email.trim().toLowerCase()}`,
    limit: '1',
  });
  const result = await requestUsers(`?${query.toString()}`);
  const user = Array.isArray(result) ? result[0] : null;
  if (!user || !(await verifyPassword(password, user.password_hash))) return null;
  return normalizeUser(user);
}

export function normalizeUser(user) {
  if (!user || typeof user.id !== 'string' || typeof user.name !== 'string' || typeof user.email !== 'string') {
    throw new Error('Account database returned an invalid user profile.');
  }
  return { id: user.id, name: user.name, email: user.email };
}

export function validateCredentials(body, includeName = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Invalid request.';
  }
  const { name, email, password } = body;
  if (includeName && (typeof name !== 'string' || !name.trim() || name.trim().length > 100)) {
    return 'Enter a name of 1 to 100 characters.';
  }
  if (
    typeof email !== 'string'
    || email.length > 254
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return 'Enter a valid email address.';
  }
  if (typeof password !== 'string' || Buffer.byteLength(password, 'utf8') < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return 'Password must be between 8 and 72 UTF-8 bytes.';
  }
  return null;
}
