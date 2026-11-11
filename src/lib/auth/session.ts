import crypto from 'crypto';

const SESSION_SECRET =
  process.env.SESSION_SECRET || 'cashcollect-demo-session-secret-2026';

export const SESSION_COOKIE_NAME = 'cashcollect_session';

/** Max session age — 24 hours in milliseconds. */
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * Create a signed session token containing the user email and org id.
 * Format: base64(payload).hmac
 */
export function createSessionToken(email: string, orgId: string): string {
  const payload = JSON.stringify({ email, org: orgId, ts: Date.now() });
  const hmac = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + hmac;
}

/**
 * Verify a session token. Returns the decoded payload if valid, null otherwise.
 */
export function verifySessionToken(
  token: string,
): { email: string; org: string; ts: number } | null {
  try {
    const dotIdx = token.indexOf('.');
    if (dotIdx === -1) return null;

    const payloadB64 = token.slice(0, dotIdx);
    const hmac = token.slice(dotIdx + 1);

    const payload = Buffer.from(payloadB64, 'base64').toString();
    const expectedHmac = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('hex');

    // Constant-time comparison
    if (
      hmac.length !== expectedHmac.length ||
      !crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))
    ) {
      return null;
    }

    const data = JSON.parse(payload) as {
      email: string;
      org: string;
      ts: number;
    };

    // Check expiry
    if (Date.now() - data.ts > MAX_AGE_MS) return null;

    return data;
  } catch {
    return null;
  }
}
